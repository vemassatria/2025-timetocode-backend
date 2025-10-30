import { singleton } from 'tsyringe';
import { nanoid } from 'nanoid';
import { Room } from '../models/RoomModel.js';

@singleton()
export class LogicGateRoomRepository {
  private rooms: Map<string, Room> = new Map();

  create(): Room {
    const roomId = nanoid(6); 
    const room = new Room(roomId);
    this.rooms.set(roomId, room);
    console.log(`Repository: Room created with ID: ${roomId}`); 
    return room;
  }

  findById(id: string): Room | undefined {
    console.log(`Repository: Searching for room with ID: ${id}`); 
    const room = this.rooms.get(id);
    console.log(room ? `Repository: Room found.` : `Repository: Room not found.`); 
    return room;
  }

  findBySocketId(socketId: string): Room | undefined {
    console.log(`Repository: Searching for room by socket ID: ${socketId}`); 
    for (const room of this.rooms.values()) {
      if (room.players.has(socketId)) {
        console.log(`Repository: Room found for socket ID ${socketId}, Room ID: ${room.id}`); 
        return room;
      }
    }
    console.log(`Repository: No room found for socket ID ${socketId}.`); 
    return undefined;
  }

  remove(id: string): void {
    const deleted = this.rooms.delete(id);
    if (deleted) {
      console.log(`Repository: Room removed with ID: ${id}`); 
    } else {
      console.log(`Repository: Attempted to remove non-existent room with ID: ${id}`); 
    }
  }

  getActiveRoomCount(): number {
    return this.rooms.size;
  }
}