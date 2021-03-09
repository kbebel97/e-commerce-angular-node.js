import { Item } from './Item.model';

export interface cartItem{
              cartItemId: number,
              qty: number,
              display: boolean,
              item : Item,
              itemId: string,
              creator: string
}
