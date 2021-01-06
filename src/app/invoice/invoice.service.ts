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
      return { invoice : {
          invoiceId : result.invoice._id+"",
          date: result.invoice.date+"",
          total: parseInt(result.invoice.total),
          tax: parseInt(result.invoice.tax),
          shipping: parseInt(result.invoice.shipping),
          quantity: parseInt(result.invoice.quantity),
          display: true,
          isReturned: Boolean(JSON.parse(result.invoice.isReturned)),
          purchasedItems: result.invoice.purchasedItems.map((purchasedItem) => {
            return {
              item : purchasedItem.item,
              purchaseQ: purchasedItem.purchaseQ,
              returnQ: purchasedItem.returnQ,
              total: purchasedItem.total,
              display: true,
              isReturned: purchasedItem.isReturned
            }
          })
        }, invoiceCount: result.count

      };
    }))
    .subscribe(result => {
        this.invoiceHistory.push(result.invoice);
        this.invoicesUpdated.next({ invoices: [...this.invoiceHistory], invoiceCount: result.invoiceCount});
    });
  }

  returnAll(invoice: Invoice){
    let purchasedItems = invoice.purchasedItems.map(purchasedItem => {
      // console.log(purchasedItem.purchaseQ);
      return{
        item: purchasedItem.item,
        purchaseQ: purchasedItem.purchaseQ,
        returnQ: purchasedItem.purchaseQ,
        total: purchasedItem.total,
        isReturned: true
      }
    });
    invoice.display = true;
    // invoice.isReturned = true;

    let transformedInvoice = {
      invoiceId: invoice.invoiceId,
      date: invoice.date,
      total: invoice.total,
      tax: invoice.tax,
      shipping: invoice.shipping,
      quantity: invoice.quantity,
      isReturned: true,
      purchasedItems: purchasedItems
    }

    this.http
      .put<{message: string}>('http://localhost:3000/api/invoices', transformedInvoice).subscribe((result)=> {
        console.log(result.message);
      })
  }

  returnOne(invoice: Invoice){
    let purchasedItems = invoice.purchasedItems.map(purchasedItem => {
      return{
        item: purchasedItem.item,
        purchaseQ: purchasedItem.purchaseQ,
        returnQ: purchasedItem.returnQ,
        total: purchasedItem.total,
        isReturned: true
      }
    });

    let transformedInvoice = {
      invoiceId: invoice.invoiceId,
      date: invoice.date,
      total: invoice.total,
      tax: invoice.tax,
      shipping: invoice.shipping,
      quantity: invoice.quantity,
      isReturned: true,
      purchasedItems: purchasedItems
    }

    this.http
      .put<{message: string}>('http://localhost:3000/api/invoices', transformedInvoice).subscribe((result)=> {
        console.log(result.message);
      })

  }



  getInvoices(itemsPerPage: number, currentPage: number){
    const queryParams = `?pagesize=${itemsPerPage}&page=${currentPage}`;
    this.http
    .get<{message: string, invoices: any, invoiceCount: number}>('http://localhost:3000/api/invoices' + queryParams)
    .pipe(map((result) => {
      return {invoices: result.invoices.map(invoice => {
        return{
          invoiceId: invoice._id,
          date: invoice.date,
          total: invoice.total,
          tax: invoice.tax,
          shipping: invoice.shipping,
          quantity: invoice.quantity,
          display: true,
          isReturned : invoice.isReturned,
          purchasedItems: invoice.purchasedItems.map( purchasedItem => {
            return {
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
