import { cartItem } from '../shared/cartItem.model';
import { invoice } from '../shared/invoice.model';
import { purchasedItem } from '../shared/purchasedItem.model';

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
      invoiceTax += cartItem.item.individualTax * cartItem.qty;
      invoiceTotal += (cartItem.item.individualShipping + cartItem.item.individualTax + cartItem.item.individualPrice) * cartItem.qty;
      invoiceShipping += cartItem.item.individualShipping * cartItem.qty;
      let itemTotal = (cartItem.item.individualShipping + cartItem.item.individualTax + cartItem.item.individualPrice) * cartItem.qty;
      let pI = new purchasedItem(this.invoiceHistory.length + 1,
                             cartItem.item,
                             cartItem.qty,
                             0,
                             itemTotal,
                             true,
                             false);
                             console.log(pI);
        purchasedItems.push(pI);
    }
    let unformatteddate : Date = new Date();
    let formatteddate = (unformatteddate.getMonth() + 1) + "-" + unformatteddate.getDate() + "-" + unformatteddate.getFullYear();

    let i = new invoice(1, purchasedItems, formatteddate, invoiceTotal, invoiceTax, invoiceShipping, items.length, true, 0, true);
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

  //crud operations
  // on component initilization, load all invoices based on userId

  //* An invoice is composed on the follow attributes */
  // public invoiceId: number,
  // public purchasedItems: purchasedItem[],
  // public date: string,
  // public total: number,
  // public tax: number,
  // public shipping: number,
  // public quantity: number,
  // public display: boolean,
  // public height : number,
  // public isReturnable : boolean




}
