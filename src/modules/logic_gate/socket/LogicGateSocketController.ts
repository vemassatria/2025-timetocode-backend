import 'reflect-metadata';
import { Server, Socket } from 'socket.io';
import { singleton, inject } from 'tsyringe';
import { LogicGateRoomRepository } from '../domain/repositories/LogicGateRoomRepository.js';
import { LogicGateService } from '../services/LogicGateService.js';
import { PlayerModel } from '../domain/models/PlayerModel.js';
import type { Room } from '../domain/models/RoomModel.js';

@singleton()
export class LogicGateSocketController {
  private disconnectTimeouts: Map<string, NodeJS.Timeout> = new Map();
  private gracefullyDisconnectedSocketIds: Set<string> = new Set();
  constructor(
    @inject(LogicGateRoomRepository)
    private roomRepository: LogicGateRoomRepository,
    @inject(LogicGateService)
    private logicGateService: LogicGateService
  ) {
    console.log('LogicGateSocketController initialized');
  }

  public registerHandlers(io: Server): void {
    io.on('connection', (socket: Socket) => {
      console.log(`Socket connected: ${socket.id}`);

      socket.on('createRoom', () => this.handleCreateRoom(socket));
      socket.on('joinRoom', (roomId: string) =>
        this.handleJoinRoom(socket, roomId, io)
      );
      socket.on('playerMove', (data: { cardSlotId: number; cardId: number }) =>
        this.handlePlayerMove(socket, data, io)
      );
      socket.on(
        'playerReconnect',
        (data: { roomId: string; playerId: number }) =>
          this.handlePlayerReconnect(socket, data, io)
      );
      socket.on('leaveRoom', () => this.handleLeaveRoom(socket, io));
      socket.on('disconnect', () => this.handleDisconnect(socket, io));
    });
    console.log('Socket handlers registered.');
  }

  private handleCreateRoom(socket: Socket): void {
    try {
      const room = this.roomRepository.create();
      const player1Hand = this.logicGateService.getAvailableCards(1);
      const player1 = new PlayerModel(1, player1Hand, 1);

      room.addPlayer(socket.id, player1);
      socket.join(room.id);
      console.log(`Socket ${socket.id} created and joined room ${room.id}`);
      socket.emit('roomCreated', { roomId: room.id, playerId: player1.id });
    } catch (error) {
      console.error(`Error creating room for ${socket.id}:`, error);
      socket.emit('error', 'Failed to create room.');
    }
  }

  private handleJoinRoom(socket: Socket, roomId: string, io: Server): void {
    try {
      const room = this.roomRepository.findById(roomId);
      if (room) {
        if (room.players.size < 2) {
          if (Array.from(room.players.keys())[0] === socket.id) {
            console.warn(
              `Socket ${socket.id} attempted to join their own room ${roomId}`
            );
            socket.emit('error', 'Cannot join your own room.');
            return;
          }

          const player2Hand = this.logicGateService.getAvailableCards(2);
          const player2 = new PlayerModel(2, player2Hand, 0);

          room.addPlayer(socket.id, player2);
          socket.join(room.id);
          socket.emit('roomJoined', { roomId: room.id, playerId: player2.id });
          console.log(`Socket ${socket.id} joined room ${roomId}`);

          const player1SocketId = Array.from(room.players.keys())[0]!;
          const player1 = room.getPlayer(player1SocketId)!;
          room.gameState = this.logicGateService.createInitialState(
            player1,
            player2
          );

          console.log(`Game state created for room ${roomId}`);

          io.to(roomId).emit('gameStateUpdate', room.gameState);
          console.log(`Initial game state sent to room ${roomId}`);
        } else {
          console.warn(
            `Socket ${socket.id} failed to join room ${roomId}: Room full.`
          );
          socket.emit('error', 'Room is full.');
        }
      } else {
        console.warn(
          `Socket ${socket.id} failed to join room ${roomId}: Room not found.`
        );
        socket.emit('error', 'Room not found.');
      }
    } catch (error) {
      console.error(`Error joining room ${roomId} for ${socket.id}:`, error);
      socket.emit('error', 'Failed to join room.');
    }
  }

  private handlePlayerMove(
    socket: Socket,
    data: { cardSlotId: number; cardId: number },
    io: Server
  ): void {
    const room = this.roomRepository.findBySocketId(socket.id);
    if (room && room.gameState) {
      try {
        const newState = this.logicGateService.processPlayerMove(
          data.cardSlotId,
          data.cardId,
          room.gameState
        );
        room.gameState = newState;
        io.to(room.id).emit('gameStateUpdate', room.gameState);
        if (newState.winnerPlayerId !== undefined) {
          io.to(room.id).emit('gameOver');
        }
      } catch (error: any) {
        console.error(
          `Error processing move for ${socket.id} in room ${room.id}:`,
          error
        );
        socket.emit(
          'error',
          `Invalid move: ${error.message || 'Unknown error'}`
        );
      }
    } else {
      console.warn(
        `Move attempt by ${socket.id} failed: Room or game state not found.`
      );
      socket.emit(
        'error',
        'Room or game state not found. Cannot process move.'
      );
    }
  }

  private handleLeaveRoom(socket: Socket, io: Server): void {
    console.log(`Graceful disconnect requested by ${socket.id}.`);
    this.gracefullyDisconnectedSocketIds.add(socket.id);

    const room = this.roomRepository.findBySocketId(socket.id);
    if (room) {
      if (room.gameState?.winnerPlayerId === undefined) {
        const opponent = room.getOpponent(socket.id);

        room.players.delete(socket.id);
        if (opponent) {
          const opponentSocketId = this.findSocketIdByPlayerId(
            room,
            opponent.id
          );
          if (opponentSocketId) {
            io.to(opponentSocketId).emit('opponentDisconnected', {});
          }
        }
      }
      this.roomRepository.remove(room.id);
      console.log(`Room ${room.id} removed due to graceful disconnect.`);
    }

    socket.disconnect();
  }

  private handleDisconnect(socket: Socket, io: Server): void {
    console.log(`Socket disconnected: ${socket.id}`);

    if (this.gracefullyDisconnectedSocketIds.has(socket.id)) {
      console.log(
        `Socket ${socket.id} was disconnected gracefully. No reconnect timer.`
      );
      this.gracefullyDisconnectedSocketIds.delete(socket.id);
      return;
    }

    console.log(`Socket ${socket.id} disconnected abruptly (network issue?).`);
    const room = this.roomRepository.findBySocketId(socket.id);
    if (room) {
      const player = room.getPlayer(socket.id);
      if (!player) return;

      console.log(
        `Player ${player.id} (Socket ${socket.id}) disconnected from room ${room.id}. Starting 30s reconnect timer.`
      );

      const opponent = room.getOpponent(socket.id);
      if (opponent) {
        const opponentSocketId = this.findSocketIdByPlayerId(room, opponent.id);
        if (opponentSocketId) {
          io.to(opponentSocketId).emit('opponentReconnecting');
        }
      }

      const timerKey = player.id.toString() + room.id;
      const timeout = setTimeout(() => {
        console.log(
          `Reconnect timer expired for player ${player.id} in room ${room.id}.`
        );

        const oldSocketId = this.findSocketIdByPlayerId(room, player.id);
        if (oldSocketId) {
          room.players.delete(oldSocketId);
        }

        if (opponent) {
          const opponentSocketId = this.findSocketIdByPlayerId(
            room,
            opponent.id
          );
          if (opponentSocketId) {
            io.to(opponentSocketId).emit('opponentDisconnected');
          }
        }
        this.roomRepository.remove(room.id);
        this.disconnectTimeouts.delete(timerKey);
      }, 30000);

      this.disconnectTimeouts.set(timerKey, timeout);
    } else {
      console.log(`Socket ${socket.id} was not in any active room.`);
    }
  }

  private handlePlayerReconnect(
    socket: Socket,
    data: { roomId: string; playerId: number },
    io: Server
  ): void {
    const { roomId, playerId } = data;
    console.log(
      `Attempting reconnect for Player ${playerId} (New Socket ${socket.id}) to Room ${roomId}`
    );

    const room = this.roomRepository.findById(roomId);
    if (room) {
      const timerKey = playerId.toString() + roomId;
      const timeout = this.disconnectTimeouts.get(timerKey);

      if (timeout) {
        clearTimeout(timeout);
        this.disconnectTimeouts.delete(timerKey);
        console.log(`Player ${playerId} reconnected successfully.`);

        const oldSocketId = this.findSocketIdByPlayerId(room, playerId);
        let playerModel: PlayerModel | undefined;

        if (oldSocketId) {
          playerModel = room.players.get(oldSocketId);
          room.players.delete(oldSocketId);
        }

        if (playerModel) {
          room.players.set(socket.id, playerModel);
        } else {
          socket.emit(
            'error',
            'Reconnect failed: Could not find player model.'
          );
          return;
        }

        socket.join(room.id);

        const opponent = room.getOpponent(socket.id);
        if (opponent) {
          const opponentSocketId = this.findSocketIdByPlayerId(
            room,
            opponent.id
          );
          if (opponentSocketId) {
            io.to(opponentSocketId).emit('opponentReconnected');
          }
        }

        socket.emit('gameStateUpdate', room.gameState);
      } else {
        console.log(
          `Reconnect failed for Player ${playerId}. No active timer.`
        );
        socket.emit('error', 'Failed to reconnect (room expired or invalid).');
      }
    } else {
      console.log(`Reconnect failed. Room ${roomId} not found.`);
      socket.emit('error', 'Room not found.');
    }
  }

  private findSocketIdByPlayerId(
    room: Room,
    playerId: number
  ): string | undefined {
    for (const [socketId, player] of room.players.entries()) {
      if (player.id === playerId) {
        return socketId;
      }
    }
    return undefined;
  }
}
