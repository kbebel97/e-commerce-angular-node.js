import { cartItem } from '../shared/cartItem.model';
import { purchasedItem } from '../shared/purchasedItem.model';
import { invoice } from '../shared/invoice.model';

export class invoiceService{
  private invoiceHistory = [];
  private invoiceSelected : invoice;
  private purchasedItemSelected : purchasedItem;

  pushtoHistory(items: cartItem[]){
    let invoiceTotal : number = 0;
    let invoiceTax : number = 0;
    let invoiceShipping : number = 0;
    let purchasedItems = [];


    for(let cartItem of items){
      console.log(cartItem);
      invoiceTax = parseFloat((invoiceTax + (cartItem.individualTax * cartItem.qty)).toFixed(2));
      invoiceTotal = parseFloat((invoiceTotal + (cartItem.individualPrice + cartItem.individualTax + cartItem.indiviudalshippingFee) * cartItem.qty).toFixed(2));
      invoiceShipping = parseFloat((invoiceShipping + (cartItem.indiviudalshippingFee * cartItem.qty)).toFixed(2));
      let itemTotal =  (cartItem.individualPrice + cartItem.individualTax + cartItem.indiviudalshippingFee) * cartItem.qty;
      let pI = new purchasedItem(cartItem.itemId,
                             cartItem.name,
                             cartItem.description,
                             cartItem.manuFacturer,
                             cartItem.individualPrice,
                             cartItem.individualTax,
                             cartItem.indiviudalshippingFee,
                             cartItem.qty,
                             0,
                             parseFloat((itemTotal).toFixed(2)),
                             true);
                             console.log(pI);
        purchasedItems.push(pI);
    }
    let unformatteddate : Date = new Date();
    let formatteddate = (unformatteddate.getMonth() + 1) + "-" + unformatteddate.getDate() + "-" + unformatteddate.getFullYear();

    let i = new invoice(1, purchasedItems, formatteddate, invoiceTotal, invoiceTax, invoiceShipping, items.length, true);
    console.log(i);
    this.invoiceHistory.unshift(i);


  }

  getPurchaseHistory(){
    return this.invoiceHistory;
  }

  setInvoiceSelected(invoice: invoice){
    this.invoiceSelected = invoice;
  }

  getInvoiceSelected(){
    return this.invoiceSelected;
  }

  setPurchasedItemSelected(purchasedItem : purchasedItem){
    this.purchasedItemSelected = purchasedItem;
  }

  getPurchasedItemSelected(){
    return this.purchasedItemSelected;
  }

  deletefromInvoiceHistory(invoice: invoice){
    this.invoiceHistory.splice(this.invoiceHistory.indexOf(invoice),1);
  }


  isReturned(){
    let returned : boolean = false;
    this.invoiceHistory.forEach( function(invoice){
      invoice.purchasedItems.forEach(item => {
        if(item.returnQ != item.purchaseQ){
          returned = true;
        }
      });

    });
    return returned;

  }




}
