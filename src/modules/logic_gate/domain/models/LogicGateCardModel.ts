import type { LogicGateType } from './LogicGateType.js';

export class LogicGateCardModel {
  id: number;
  type: LogicGateType;

  constructor({ id, type }: { id: number; type: LogicGateType }) {
    this.id = id;
    this.type = type;
  }
}
