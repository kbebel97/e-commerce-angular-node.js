export class cartItem{
  constructor(public cartId: number,
              public itemId: number,
              public name: string,
              public description: string,
              public qty: number,
              public manuFacturer: string,
              public individualTax: number,
              public indiviudalshippingFee: number,
              public individualPrice: number,
              public tax: number,
              public shippingFee: number,
              public total: number
              ){


  }

}
