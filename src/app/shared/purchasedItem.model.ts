
export class purchasedItem {
  constructor(public id: number,
              public name: string,
              public description: string,
              public manufacturer: string,
              public singleItemTotal: number,
              public singleItemTax: number,
              public singleItemShippingFee: number,
              public quantity: number,
              public total: number,
              public returned: boolean,
              public display: boolean
             ){

  }


}
