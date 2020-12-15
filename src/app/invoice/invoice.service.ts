import { cartItem } from '../shared/cartItem.model';
import { invoice } from '../shared/invoice.model';
import { purchasedItem } from '../shared/purchasedItem.model';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { generalService } from '../service/general.service';
import { Item } from '../shared/Item.model';

@Injectable()
export class invoiceService{
  private invoiceHistory = [];
  private invoiceSelected : invoice;
  private purchasedItemSelected : purchasedItem;
  private savedInvoice: any;

  private invoiceURL = 'http://localhost:3080/api/invoices';
  private invoiceItemURL = 'http://localhost:3080/api/invoiceitems';
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private generalService : generalService,
    private http: HttpClient){}

  saveInvoice(userId: number, invoice: invoice): Observable<any> {
    // Save both invoice and invoice items in this function
    const user = this.generalService.getUser();

    let invoiceParams = {
      "user_id": userId,
      "total": invoice.total,
      "tax": invoice.tax,
      "display": true,
      "isReturnable": true
    }

    this.savedInvoice = this.http.post(this.invoiceURL, invoiceParams, this.httpOptions);
    let invoiceId;

    // ISSUE
    // invoiceId is not being saved/read properly
    // Async issue?
    this.savedInvoice.subscribe(id => {
      console.log("SavedInvoice Subscribe:");
      console.log(id);
      invoiceId = id[0];
      console.log(invoiceId);
      console.log(JSON.parse(id));
    })

    for(let item of invoice.purchasedItems) {
      console.log('checking what the item in Purchased Items is');
      console.log(item);
      console.log(invoiceId);
      let itemParams = {
        "invoice_id": invoiceId,
        "product_id": item.id,
        "purchaseQuantity": item.purchaseQ,
        "returnQuantity": item.returnQ,
        "total": item.total,
        "display": true,
        "isReturned": false
      }

      this.http.post(this.invoiceItemURL, itemParams, this.httpOptions);
    }

    return 
  }

  pushtoHistory(items: cartItem[]){
    // Create the invoice
    // Using the retrieved json, get the ID and pass to invoice items

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
    // TODO
    // Code to send invoice to backend
    this.saveInvoice(1, i);
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
