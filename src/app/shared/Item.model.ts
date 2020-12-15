import { Review } from './review.model';

export class Item {
  constructor(public id: number,
              public name: string,
              public description: string,
              public individualPrice: number,
              public individualTax: number,
              public individualShipping : number,
              public manufacturer: string,
              public reviews: Review[],
              public rating: number){
  }


}
