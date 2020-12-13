import { Item } from './Item.model';

export class purchasedItem {
  constructor(public id: number,
              public item : Item,
              public purchaseQ: number,
              public returnQ: number,
              public total: number,
              public display: boolean,
              public isReturned: boolean
             ){

  }


}
