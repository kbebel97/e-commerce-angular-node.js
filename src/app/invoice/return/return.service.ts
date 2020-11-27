import { Injectable } from "@angular/core";
import { invoice } from 'src/app/shared/invoice.model';
import { purchasedItem } from 'src/app/shared/purchasedItem.model';

@Injectable()
export class returnService{
  invoice: invoice;
  purchasedItem: purchasedItem;

  invoicetoReturn(invoice: invoice){
    this.invoice = invoice;

  }

  purchasedItemtoReturn(purchasedItem: purchasedItem, invoice: invoice){
    this.purchasedItem = purchasedItem;
    this.invoice = invoice;
  }

  getInvoice(){
    return this.invoice;
  }

  getPurchasedItem(){
    return this.purchasedItem;
  }

}
