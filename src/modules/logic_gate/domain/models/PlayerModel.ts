import type { LogicGateCardModel } from './LogicGateCardModel.js';

export class PlayerModel {
  id: number;
  hand: LogicGateCardModel[];
  targetValue: number;

  constructor(id: number, hand: LogicGateCardModel[], targetValue: number) {
    this.id = id;
    this.hand = hand;
    this.targetValue = targetValue;
  }
}
