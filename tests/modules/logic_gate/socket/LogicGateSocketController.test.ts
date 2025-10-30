import 'reflect-metadata';
import { container } from 'tsyringe';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { LogicGateSocketController } from '../../../../src/modules/logic_gate/socket/LogicGateSocketController.js';
import { LogicGateRoomRepository } from '../../../../src/modules/logic_gate/domain/repositories/LogicGateRoomRepository.js';
import { LogicGateService } from '../../../../src/modules/logic_gate/services/LogicGateService.js';
import { Room } from '../../../../src/modules/logic_gate/domain/models/RoomModel.js';
import { PlayerModel } from '../../../../src/modules/logic_gate/domain/models/PlayerModel.js';
import { LogicGateCardModel } from '../../../../src/modules/logic_gate/domain/models/LogicGateCardModel.js';
import { LogicGateType } from '../../../../src/modules/logic_gate/domain/models/LogicGateType.js';
import { LogicGateState } from '../../../../src/modules/logic_gate/domain/models/LogicGateState.js';
import type { Server, Socket } from 'socket.io';

const mockEmit = jest.fn();

const mockIo = {
  to: jest.fn(() => ({
    emit: mockEmit,
  })),
  on: jest.fn(),
} as unknown as Server;

const mockSocket = {
  id: 'socket-1',
  join: jest.fn(),
  emit: jest.fn(),
  on: jest.fn(),
  disconnect: jest.fn(),
} as unknown as Socket;

const mockSocket2 = {
  id: 'socket-2',
  join: jest.fn(),
  emit: jest.fn(),
  on: jest.fn(),
  disconnect: jest.fn(),
} as unknown as Socket;

const mockRoomRepo = {
  create: jest.fn(),
  findById: jest.fn(),
  findBySocketId: jest.fn(),
  remove: jest.fn(),
  getActiveRoomCount: jest.fn(),
};

const mockLogicGateService = {
  createInitialState: jest.fn(),
  processPlayerMove: jest.fn(),
  getAvailableCards: jest.fn(),
};

describe('LogicGateSocketController', () => {
  let controller: LogicGateSocketController;

  const player1Hand: LogicGateCardModel[] = [
    new LogicGateCardModel({ id: 1, type: LogicGateType.and }),
  ];
  const player2Hand: LogicGateCardModel[] = [
    new LogicGateCardModel({ id: 6, type: LogicGateType.or }),
  ];

  const player1 = new PlayerModel(1, player1Hand, 1);
  const player2 = new PlayerModel(2, player2Hand, 0);

  const mockRoom = new Room('room-123');

  const mockInitialState = new LogicGateState({
    binarySlots: [],
    cardSlots: [],
    player: player1,
    opponent: player2,
    currentPlayerId: 1,
  });

  beforeEach(() => {
    jest.clearAllMocks();
    container.clearInstances();

    container.registerInstance(LogicGateRoomRepository, mockRoomRepo as any);
    container.registerInstance(LogicGateService, mockLogicGateService as any);

    controller = container.resolve(LogicGateSocketController);

    mockRoom.players.clear();
    mockRoom.gameState = undefined;
  });

  describe('handleCreateRoom', () => {
    it('should create a new room, add player 1, join the socket, and emit roomCreated', () => {
      mockRoomRepo.create.mockReturnValue(mockRoom);
      mockLogicGateService.getAvailableCards.mockReturnValue(player1Hand);
      controller['handleCreateRoom'](mockSocket);

      expect(mockRoomRepo.create).toHaveBeenCalledTimes(1);
      expect(mockLogicGateService.getAvailableCards).toHaveBeenCalledWith(1);
      expect(mockRoom.players.size).toBe(1);
      expect(mockRoom.getPlayer(mockSocket.id)?.id).toBe(1);
      expect(mockSocket.join).toHaveBeenCalledWith(mockRoom.id);
      expect(mockSocket.emit).toHaveBeenCalledWith('roomCreated', {
        roomId: mockRoom.id,
        playerId: 1,
      });
    });

    it('should emit an error if room creation fails', () => {
      const error = new Error('Failed to create');
      mockRoomRepo.create.mockImplementation(() => {
        throw error;
      });

      controller['handleCreateRoom'](mockSocket);

      expect(mockSocket.emit).toHaveBeenCalledWith(
        'error',
        'Failed to create room.'
      );
    });
  });

  describe('handleJoinRoom', () => {
    beforeEach(() => {
      mockRoom.addPlayer(mockSocket.id, player1);
      mockRoomRepo.findById.mockReturnValue(mockRoom);
    });

    it('should allow player 2 to join, create game state, and emit updates', () => {
      mockLogicGateService.getAvailableCards.mockReturnValue(player2Hand);
      mockLogicGateService.createInitialState.mockReturnValue(mockInitialState);

      controller['handleJoinRoom'](mockSocket2, mockRoom.id, mockIo);

      expect(mockRoomRepo.findById).toHaveBeenCalledWith(mockRoom.id);
      expect(mockLogicGateService.getAvailableCards).toHaveBeenCalledWith(2);
      expect(mockRoom.players.size).toBe(2);
      expect(mockRoom.getPlayer(mockSocket2.id)?.id).toBe(2);
      expect(mockSocket2.join).toHaveBeenCalledWith(mockRoom.id);
      expect(mockSocket2.emit).toHaveBeenCalledWith('roomJoined', {
        roomId: mockRoom.id,
        playerId: 2,
      });
      expect(mockLogicGateService.createInitialState).toHaveBeenCalledWith(
        player1,
        player2
      );
      expect(mockRoom.gameState).toBe(mockInitialState);
      expect(mockIo.to).toHaveBeenCalledWith(mockRoom.id);
      expect(mockIo.to(mockRoom.id).emit).toHaveBeenCalledWith(
        'gameStateUpdate',
        mockInitialState
      );
    });

    it('should emit "Room is full" error if room already has 2 players', () => {
      mockRoom.addPlayer('socket-3', player2);
      expect(mockRoom.players.size).toBe(2);

      const mockSocket3 = {
        id: 'socket-3',
        join: jest.fn(),
        emit: jest.fn(),
        on: jest.fn(),
        disconnect: jest.fn(),
      } as unknown as Socket;

      controller['handleJoinRoom'](mockSocket3, mockRoom.id, mockIo);

      expect(mockSocket3.emit).toHaveBeenCalledWith('error', 'Room is full.');
      expect(mockSocket3.join).not.toHaveBeenCalled();
      expect(mockIo.to(mockRoom.id).emit).not.toHaveBeenCalled();
    });

    it('should emit "Room not found" error if room does not exist', () => {
      mockRoomRepo.findById.mockReturnValue(undefined);

      controller['handleJoinRoom'](mockSocket2, 'wrong-id', mockIo);

      expect(mockSocket2.emit).toHaveBeenCalledWith('error', 'Room not found.');
    });

    it('should emit "Cannot join your own room" error if player tries to join twice', () => {
      controller['handleJoinRoom'](mockSocket, mockRoom.id, mockIo);

      expect(mockSocket.emit).toHaveBeenCalledWith(
        'error',
        'Cannot join your own room.'
      );
      expect(mockSocket.join).not.toHaveBeenCalled();
    });
  });

  describe('handlePlayerMove', () => {
    const moveData = { cardSlotId: 3, cardId: 1 };
    let newState: LogicGateState;

    beforeEach(() => {
      mockRoom.addPlayer(mockSocket.id, player1);
      mockRoom.addPlayer(mockSocket2.id, player2);
      mockRoom.gameState = mockInitialState;

      mockRoomRepo.findBySocketId.mockReturnValue(mockRoom);

      newState = new LogicGateState({
        binarySlots: mockInitialState.binarySlots,
        cardSlots: mockInitialState.cardSlots.map((slot, index) =>
          index === moveData.cardSlotId
            ? new LogicGateCardModel({ id: 1, type: LogicGateType.and })
            : slot
        ),
        player: {
          ...player1,
          hand: player1.hand.filter((card) => card.id !== moveData.cardId),
        },
        opponent: player2,
        currentPlayerId: 2,
      });
    });

    it('should process a valid move, update state, and emit to room', () => {
      mockLogicGateService.processPlayerMove.mockReturnValue(newState);

      controller['handlePlayerMove'](mockSocket, moveData, mockIo);
      expect(mockRoomRepo.findBySocketId).toHaveBeenCalledWith(mockSocket.id);
      expect(mockLogicGateService.processPlayerMove).toHaveBeenCalledWith(
        moveData.cardSlotId,
        moveData.cardId,
        mockInitialState
      );
      expect(mockRoom.gameState).toBe(newState);
      expect(mockIo.to).toHaveBeenCalledWith(mockRoom.id);
      expect(mockIo.to(mockRoom.id).emit).toHaveBeenCalledWith(
        'gameStateUpdate',
        newState
      );
    });

    it('should emit "gameOver" if the move results in a winner', () => {
      const finalState = { ...newState, winnerPlayerId: 1 };
      mockLogicGateService.processPlayerMove.mockReturnValue(finalState);

      controller['handlePlayerMove'](mockSocket, moveData, mockIo);

      expect(mockIo.to(mockRoom.id).emit).toHaveBeenCalledWith(
        'gameStateUpdate',
        finalState
      );
      expect(mockIo.to(mockRoom.id).emit).toHaveBeenCalledWith('gameOver');
    });

    it('should emit an error if the move is invalid (service throws error)', () => {
      const error = new Error('Invalid move');
      mockLogicGateService.processPlayerMove.mockImplementation(() => {
        throw error;
      });

      controller['handlePlayerMove'](mockSocket, moveData, mockIo);

      expect(mockLogicGateService.processPlayerMove).toHaveBeenCalled();
      expect(mockSocket.emit).toHaveBeenCalledWith(
        'error',
        `Invalid move: ${error.message}`
      );
      expect(mockIo.to(mockRoom.id).emit).not.toHaveBeenCalledWith(
        'gameStateUpdate',
        expect.anything()
      );
    });

    it('should emit an error if room or game state is not found', () => {
      mockRoomRepo.findBySocketId.mockReturnValue(undefined);

      controller['handlePlayerMove'](mockSocket, moveData, mockIo);

      expect(mockSocket.emit).toHaveBeenCalledWith(
        'error',
        'Room or game state not found. Cannot process move.'
      );
      expect(mockLogicGateService.processPlayerMove).not.toHaveBeenCalled();
    });
  });
});
