
export class purchasedItem {
  constructor(public id: number,
              public name: string,
              public description: string,
              public manufacturer: string,
              public singleItemTotal: number,
              public singleItemTax: number,
              public singleItemShippingFee: number,
              public purchaseQ: number,
              public returnQ: number,
              public total: number,
              public display: boolean
             ){

  }


}
