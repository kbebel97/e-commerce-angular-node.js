import { Item } from './Item.model';

export class cartItem{
  constructor(
              public cartId: number,
              public qty: number,
              public display: boolean,
              public item : Item
              ){


  }

}
