import { LogicGateState } from './LogicGateState.js';
import { PlayerModel } from './PlayerModel.js';

export class Room {
  public readonly id: string;
  public players: Map<string, PlayerModel> = new Map();
  public gameState?: LogicGateState | undefined;

  constructor(id: string) {
    this.id = id;
  }

  public addPlayer(socketId: string, player: PlayerModel): void {
    if (this.players.size < 2) {
      this.players.set(socketId, player);
    }
  }

  public getPlayer(socketId: string): PlayerModel | undefined {
    return this.players.get(socketId);
  }

  public getOpponent(socketId: string): PlayerModel | undefined {
    for (const [id, player] of this.players.entries()) {
      if (id !== socketId) {
        return player;
      }
    }
    return undefined;
  }
}
