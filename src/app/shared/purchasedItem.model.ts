import { Review } from './review.model';

export class purchasedItem {
  constructor(public id: number,
              public name: string,
              public description: string,
              public amount: number,
              public manufacturer: string,
              public date: Date
             ){

  }


}
