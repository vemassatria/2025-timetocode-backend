import { singleton } from 'tsyringe';
import { BinarySlotModel } from '../domain/models/BinarySlotModel.js';
import { CardSlotModel } from '../domain/models/CardSlotModel.js';
import { LogicGateCardModel } from '../domain/models/LogicGateCardModel.js';
import { LogicGateState } from '../domain/models/LogicGateState.js';
import { LogicGateType } from '../domain/models/LogicGateType.js';
import { PlayerModel } from '../domain/models/PlayerModel.js';

@singleton()
export class LogicGateService {
  createInitialState(
    player1: PlayerModel,
    player2: PlayerModel
  ): LogicGateState {
    const initialState = new LogicGateState({
      binarySlots: this.initializeBinarySlots(15),
      cardSlots: this.initializeCardSlots(10),
      player: player1,
      opponent: player2,
      currentPlayerId: 1,
    });
    console.log('Service: Initial game state created:', initialState);
    return initialState;
  }

  processPlayerMove(
    cardSlotId: number,
    cardId: number,
    state: LogicGateState
  ): LogicGateState {
    const currentPlayer = state.currentPlayerId == 1;
    const player = currentPlayer ? state.player! : state.opponent!;
    const binarySlots = state.binarySlots;
    const cardSlots = state.cardSlots;
    const cardToMove = this.getCardById(cardId, player.hand);
    const outPutBinarySlot = this.getOutputBinarySlot(
      cardSlotId,
      binarySlots,
      cardToMove
    );

    const updatedPlayer = this.updatePlayerHand(player, cardId);
    const updatedCardSlots = this.updateCardSlots(
      cardSlotId,
      cardToMove,
      cardSlots
    );
    const updatedBinarySlots = this.updateBinarySlot(
      outPutBinarySlot.id,
      binarySlots,
      outPutBinarySlot
    );

    const nextPlayerId = currentPlayer ? 0 : 1;
    const isEndGame = cardSlotId === 10;

    return new LogicGateState({
      binarySlots: updatedBinarySlots,
      cardSlots: updatedCardSlots,
      player: currentPlayer ? updatedPlayer : state.player,
      opponent: currentPlayer ? state.opponent : updatedPlayer,
      currentPlayerId: isEndGame ? state.currentPlayerId : nextPlayerId,
      winnerPlayerId: isEndGame
        ? outPutBinarySlot.value! == 1
          ? 1
          : 2
        : undefined,
      lastUpdatedCardSlotId: cardSlotId,
    });
  }

  private calculateCard(
    logicGateType: LogicGateType,
    input1: number,
    input2: number
  ): number {
    switch (logicGateType) {
      case LogicGateType.and:
        return input1 & input2;
      case LogicGateType.or:
        return input1 | input2;
      case LogicGateType.nand:
        return (input1 & input2) == 0 ? 1 : 0;
      case LogicGateType.nor:
        return (input1 | input2) == 0 ? 1 : 0;
      case LogicGateType.xor:
        return input1 ^ input2;
    }
  }

  private initializeBinarySlots(count: number): BinarySlotModel[] {
    return Array.from({ length: count }, (_, index) => {
      if (index < 5) {
        return new BinarySlotModel({ id: index + 1, value: index % 2 });
      }
      return new BinarySlotModel({ id: index + 1 });
    });
  }

  private initializeCardSlots(count: number): CardSlotModel[] {
    return Array.from({ length: count }, (_, index) => {
      return new CardSlotModel({ id: index + 1 });
    });
  }

  getAvailableCards(playerId: number): LogicGateCardModel[] {
    const numberOfCards = 5;
    const logicGateTypes = Object.values(LogicGateType);

    const startId: number = playerId === 1 ? 1 : numberOfCards + 1;

    return Array.from({ length: numberOfCards }, (_, index) => {
      return new LogicGateCardModel({
        id: startId + index,
        type: logicGateTypes[index]!,
      });
    });
  }

  private updatePlayerHand(player: PlayerModel, cardId: number): PlayerModel {
    return {
      ...player,
      hand: player.hand.filter((card) => card.id !== cardId),
    };
  }

  private updateCardSlots(
    cardSlotId: number,
    card: LogicGateCardModel,
    cardSlots: CardSlotModel[]
  ): CardSlotModel[] {
    return cardSlots.map((slot) => {
      if (slot.id === cardSlotId) {
        return new CardSlotModel({ id: slot.id, placedCard: card });
      }
      return slot;
    });
  }

  private updateBinarySlot(
    binarySlotId: number,
    binarySlots: BinarySlotModel[],
    binarySlot: BinarySlotModel
  ): BinarySlotModel[] {
    return binarySlots.map((slot) => {
      if (slot.id === binarySlotId) {
        return binarySlot;
      }
      return slot;
    });
  }

  private getOutputBinarySlot(
    cardSlotId: number,
    binarySlots: BinarySlotModel[],
    placedCard: LogicGateCardModel
  ): BinarySlotModel {
    const input1SlotId1 = this.calculateTopBinarySlotIndex(cardSlotId);
    const input2SlotId2 = input1SlotId1 + 1;
    const value1 = binarySlots.find((slot) => slot.id === input1SlotId1)!.value;
    const value2 = binarySlots.find((slot) => slot.id === input2SlotId2)!.value;
    const outputSlotId = this.calculateNextBinarySlotIndex(
      input1SlotId1,
      input2SlotId2
    );
    const outputValue = this.calculateCard(placedCard!.type, value1!, value2!);
    return new BinarySlotModel({ id: outputSlotId, value: outputValue });
  }

  // calculate binary slot index (on the top position) based on the card slot index
  private calculateTopBinarySlotIndex(slotId: number): number {
    const isLowerThanEight = slotId < 8;
    const offset = isLowerThanEight
      ? Math.floor((slotId - 1) / 4)
      : Math.floor((slotId - 1) / 3);
    return slotId + offset;
  }

  // find next binary slot index based on the previous binary slots
  private calculateNextBinarySlotIndex(
    binarySlotId1: number,
    binarySlotId2: number
  ): number {
    const offset = Math.floor((binarySlotId1 - 1) / 4);
    const fixedOffset = 4;

    return binarySlotId2 + fixedOffset - offset;
  }

  private getCardById(
    cardId: number,
    cards: LogicGateCardModel[]
  ): LogicGateCardModel {
    return cards.find((card) => card.id === cardId)!;
  }
}
