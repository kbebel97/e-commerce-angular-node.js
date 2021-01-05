import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { cartItem } from '../shared/cartItem.model';
import { Invoice } from '../shared/invoice.model';
import { purchasedItem } from '../shared/purchasedItem.model';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';



@Injectable()
export class invoiceService{
  private invoiceHistory : Invoice[] = [];
  private invoiceSelected : Invoice;
  private purchasedItemSelected : purchasedItem;

  constructor(private http: HttpClient){

  }

  private invoicesUpdated = new Subject<{invoices: Invoice[], invoiceCount: number}>();

  pushtoHistory(items: cartItem[]){
    let invoiceTotal : number = 0;
    let invoiceTax : number = 0;
    let invoiceShipping : number = 0;
    let purchasedItems = [];
  }

  addInvoice(cartItems : cartItem[], totalItems : number){
    let invoiceTotal : number = 0;
    let invoiceTax : number = 0;
    let invoiceShipping : number = 0;
    let purchasedItems = [];

    for(let cartItem of cartItems){
      invoiceTax += cartItem.item.individualTax * cartItem.qty;
      invoiceTotal += (cartItem.item.individualShipping + cartItem.item.individualTax + cartItem.item.individualPrice) * cartItem.qty;
      invoiceShipping += cartItem.item.individualShipping * cartItem.qty;
      let itemTotal = (cartItem.item.individualShipping + cartItem.item.individualTax + cartItem.item.individualPrice) * cartItem.qty;
      let purchasedItem = {
                            id : cartItem.itemId,
                            item: cartItem.item,
                            purchaseQ: cartItem.qty,
                            returnQ: 0,
                            total: itemTotal,
                            isReturned: false
                          };
        purchasedItems.push(purchasedItem);
    }
    let unformatteddate : Date = new Date();
    let formatteddate = (unformatteddate.getMonth() + 1) + "-" + unformatteddate.getDate() + "-" + unformatteddate.getFullYear();

    let Invoice = {
      invoiceId: null,
      date: formatteddate,
      total: invoiceTotal,
      tax: invoiceTax,
      shipping: invoiceShipping,
      quantity: totalItems,
      isReturned: false,
      purchasedItems: purchasedItems
    }

    this.http
    .post<{message: string, invoice : any, count : number}>('http://localhost:3000/api/invoices', Invoice)
    .pipe(map((result) => {
      return { purchasedItems: result.invoice.purchasedItems.map(purchasedItem => {
        return{
          id : purchasedItem.id,
          item: purchasedItem.item,
          purchaseQ: purchasedItem.qty,
          returnQ: 0,
          total: purchasedItem.total,
          display: true,
          isReturned: false
        };
      }),
      invoiceId : result.invoice.id,
      date : result.invoice.date,
      total: result.invoice.total,
      tax: result.invoice.tax,
      shipping: result.invoice.shipping,
      quantity : result.invoice.totalItems,
      display : true,
      isReturned: false,
      invoiceCount: result.count
      };
    }))
    .subscribe(result => {
      let purchasedItems : purchasedItem[] = []
      purchasedItems = result.purchasedItems;
        let invoice = {
          invoiceId : result.invoiceId+"",
          date : result.date+"",
          total: parseInt(result.total),
          tax: parseInt(result.tax),
          shipping: parseInt(result.shipping),
          quantity : parseInt(result.quantity),
          display : true,
          isReturned: false,
          purchasedItems: purchasedItems
        }
        this.invoiceHistory.push(invoice);
        this.invoicesUpdated.next({ invoices: [...this.invoiceHistory], invoiceCount: result.invoiceCount});
    });
  }

  getInvoices(itemsPerPage: number, currentPage: number){
    const queryParams = `?pagesize=${itemsPerPage}&page=${currentPage}`;
    this.http
    .get<{message: string, invoices: any, invoiceCount: number}>('http://localhost:3000/api/invoices' + queryParams)
    .pipe(map((result) => {
      return {invoices: result.invoices.purchasedItems.map(item => {
        return{
          invoiceId: item._id,
          date: item.date,
          total: item.total,
          tax: item.tax,
          shipping: item.shipping,
          quantity: item.quantity,
          display: true,
          isReturned : item.isReturned,
          purchasedItems: item.purchasedItems.map( purchasedItem => {
            return {
            id: purchasedItem.id,
            item : purchasedItem.item,
            purchaseQ: purchasedItem.purchaseQ,
            returnQ: purchasedItem.returnQ,
            total: purchasedItem.total,
            display: true,
            isReturned: purchasedItem.isReturned
          }
          })
        };
      }), invoiceCount: result.invoiceCount
    };
    }))
    .subscribe((transformedInvoices) => {

      this.invoiceHistory = transformedInvoices.invoices;
      this.invoicesUpdated.next({invoices: [...this.invoiceHistory], invoiceCount: transformedInvoices.invoiceCount });
    });
  }

  getInvoiceUpdateListener(){
    return this.invoicesUpdated.asObservable();
  }



  getPurchaseHistory(){
    return this.invoiceHistory;
  }

  setInvoiceSelected(invoice: Invoice){
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

  deletefromInvoiceHistory(invoice: Invoice){
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
