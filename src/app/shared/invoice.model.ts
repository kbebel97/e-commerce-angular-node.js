import { purchasedItem } from './purchasedItem.model';
import { Review } from './review.model';

export class invoice {
  constructor(public invoiceId: number,
              public purchasedItems: purchasedItem[],
              public date: string,
              public total: number,
              public tax: number,
              public shipping: number,
              public quantity: number,
              public display: boolean,
              public height : number,
              public isReturnable : boolean
             ){

  }


}
