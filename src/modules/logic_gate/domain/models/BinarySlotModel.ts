export class BinarySlotModel {
  id: number;
  value?: number ;

  constructor({ id, value }: { id: number; value?: number }) {
    this.id = id;
    if (value !== undefined){
    this.value = value;
   }
  }
}
