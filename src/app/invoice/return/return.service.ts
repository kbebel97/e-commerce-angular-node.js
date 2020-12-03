import { Injectable } from "@angular/core";
import { invoice } from 'src/app/shared/invoice.model';
import { purchasedItem } from 'src/app/shared/purchasedItem.model';

@Injectable()
export class returnService{
  invoice: invoice;
  purchasedItem: purchasedItem;
  componentSelected: string;
  height : number;

  setInvoice(invoice: invoice){
    this.invoice = invoice;

  }

  setItem(purchasedItem: purchasedItem, invoice: invoice){
    this.purchasedItem = purchasedItem;
    this.invoice = invoice;
  }

  setHeight(height : number){
    this.height = height;
    console.log(this.height);
  }

  getheight(){
    return this.height;
  }

  getInvoice(){
    return this.invoice;
  }

  getComponentSelected(){
    return this.componentSelected;
  }

  getPurchasedItem(){
    return this.purchasedItem;
  }

}
