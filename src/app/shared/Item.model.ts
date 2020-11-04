import { Review } from './review.model';

export class Item {
  constructor(public id: number, public name: string, public description: string, public amount: number, public shippingFee: number, public manufacturer: string, public reviews: Review[], public rating: number){

  }


}
