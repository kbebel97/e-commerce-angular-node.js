import { Item } from './Item.model';

export interface purchasedItem {
  id: number,
  item : Item,
  purchaseQ: number,
  returnQ: number,
  total: number,
  display: boolean,
  isReturned: boolean
}
