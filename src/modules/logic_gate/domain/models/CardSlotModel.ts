import type { LogicGateCardModel } from './LogicGateCardModel.js';

export class CardSlotModel {
  id: number;
  placedCard?: LogicGateCardModel | undefined;

  constructor({
    id,
    placedCard,
  }: {
    id: number;
    placedCard?: LogicGateCardModel;
  }) {
    this.id = id;
    this.placedCard = placedCard;
  }
}
