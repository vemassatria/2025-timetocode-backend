import type { BinarySlotModel } from './BinarySlotModel.js';
import type { CardSlotModel } from './CardSlotModel.js';
import type { PlayerModel } from './PlayerModel.js';

export class LogicGateState {
  binarySlots: BinarySlotModel[];
  cardSlots: CardSlotModel[];
  player: PlayerModel;
  opponent: PlayerModel;
  currentPlayerId: number;
  lastUpdatedCardSlotId?: number | undefined;
  winnerPlayerId?: number | undefined;

  constructor({
    binarySlots,
    cardSlots,
    player,
    opponent,
    currentPlayerId,
    lastUpdatedCardSlotId,
    winnerPlayerId,
  }: {
    binarySlots: BinarySlotModel[];
    cardSlots: CardSlotModel[];
    player: PlayerModel;
    opponent: PlayerModel;
    currentPlayerId: number;
    lastUpdatedCardSlotId?: number;
    winnerPlayerId?: number | undefined;
  }) {
    this.binarySlots = binarySlots;
    this.cardSlots = cardSlots;
    this.player = player;
    this.opponent = opponent;
    this.currentPlayerId = currentPlayerId;
    this.lastUpdatedCardSlotId = lastUpdatedCardSlotId;
    this.winnerPlayerId = winnerPlayerId;
  }
}
