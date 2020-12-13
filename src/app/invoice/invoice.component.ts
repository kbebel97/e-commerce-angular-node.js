import { Component, OnInit, ElementRef, ViewChildren, QueryList, OnDestroy} from '@angular/core';
import { Router } from '@angular/router';
import { invoice } from '../shared/invoice.model';
import { purchasedItem } from '../shared/purchasedItem.model';
import { invoiceService } from './invoice.service';


@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css']
})
export class InvoiceComponent implements OnInit, OnDestroy{
  returnedall : boolean;
  invoiceHistory : invoice[];
  invoiceSelected: invoice;
  purchaseditemSelected: purchasedItem;
  pixelheight: number = 0;
  Quantity: number = 0;
  @ViewChildren('invoices') invoices: QueryList<ElementRef>;
  constructor(private invoiceService: invoiceService, private router: Router) {

  }

  ngOnInit(){
    this.pixelheight = 0;
    this.invoiceHistory = this.invoiceService.getPurchaseHistory();
    console.log("initializing invoice component");
  }

  ngOnDestroy(){
    this.pixelheight = 0;
    console.log("destroying invoice component");
    this.reset();

  }

  isReturned(invoice){
    let returned : boolean = false;
      invoice.purchasedItems.forEach(item => {
        if(item.returnQ != item.purchaseQ){
          returned = true;
        }
      });
      return returned;
  }


  onShowMore(purchasedItem: purchasedItem){
    this.router.navigate(['/item', purchasedItem.item.name], {queryParams: {id: purchasedItem.item.id}});
  }

  returnItem(purchasedItem: purchasedItem, invoice: invoice){
    this.reset();
    this.purchaseditemSelected = purchasedItem;
    this.invoiceSelected = invoice;
    this.Quantity = purchasedItem.purchaseQ - purchasedItem.returnQ;
    this.purchaseditemSelected.display = false;
  }

  returnAll(invoice: invoice){
    this.reset();
    this.invoiceSelected = invoice;
    this.pixelheight = this.invoices.toArray()[this.invoiceHistory.indexOf(invoice)].nativeElement.offsetHeight;
    invoice.display = false;
  };

  increaseItemQuantity(item: purchasedItem){
    if(this.Quantity < item.purchaseQ - item.returnQ)
    this.Quantity++;
  }

  decreaseItemQuantity(){
    if(this.Quantity > 1)
      this.Quantity--;
  }

  confirm(item : purchasedItem){
    item.returnQ = item.returnQ + this.Quantity;
    item.display = true;
  }


  cancel(item : purchasedItem){
    item.display = true;
  }

  confirmInvoice(invoice : invoice){
    invoice.purchasedItems.forEach(item => {
      item.returnQ = item.purchaseQ;
    });
    invoice.display = true;
  }

  cancelInvoice(invoice : invoice){
    invoice.display = true;
  }

  reset(){
    if(this.purchaseditemSelected!=null)
      this.purchaseditemSelected.display = true;

    if(this.invoiceSelected!=null)
      this.invoiceSelected.display = true;
  }





}

