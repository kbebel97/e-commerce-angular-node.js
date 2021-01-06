import { Component, OnInit, ElementRef, ViewChildren, QueryList} from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Invoice } from '../shared/invoice.model';
import { purchasedItem } from '../shared/purchasedItem.model';
import { invoiceService } from './invoice.service';


@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css']
})
export class InvoiceComponent implements OnInit{
  returnedall : boolean;
  invoiceHistory : Invoice[];
  invoiceSelected: Invoice;
  purchaseditemSelected: purchasedItem;
  pixelheight: number = 0;
  Quantity: number = 0;
  isLoading = false;
  itemsPerPage = 20;
  totalInvoices : number;
  invoiceSub: Subscription;

  @ViewChildren('invoices') invoices: QueryList<ElementRef>;
  constructor(private invoiceService: invoiceService, private router: Router) {}

  ngOnInit(){
    this.pixelheight = 0;
    console.log("initializing invoice component");
    this.isLoading = true;
    this.invoiceService.getInvoices(this.itemsPerPage, 1);
    this.invoiceSub = this.invoiceService.getInvoiceUpdateListener()
      .subscribe((invoiceData: {invoices: Invoice[], invoiceCount: number}) => {
        this.isLoading = false;
        let temp = invoiceData.invoices.slice().reverse();
        this.invoiceHistory = temp;
        this.totalInvoices = invoiceData.invoiceCount;
        console.log(this.invoiceHistory);
    })
  }

  //Code runs to determine whether an Invoice
  isInvoiceReturned(invoice){
    let isInvoiceReturned : boolean = true;
      invoice.purchasedItems.forEach(purchasedItem => {
        if(purchasedItem.returnQ != purchasedItem.purchaseQ){
          isInvoiceReturned = false;
        }
      });
      return isInvoiceReturned;
  }

  //Navigates to item component to show one Item
  onShowMore(purchasedItem: purchasedItem){
    this.router.navigate(['/item', purchasedItem.item.name], {queryParams: {id: purchasedItem.item.id}});
  }

  //Triggers return Single Item Menu
  returnSingleItemMenu(purchasedItem: purchasedItem, invoice: Invoice){
    this.reset();
    this.purchaseditemSelected = purchasedItem;
    this.invoiceSelected = invoice;
    this.Quantity = purchasedItem.purchaseQ - purchasedItem.returnQ;
    this.purchaseditemSelected.display = false;
  }

  // Updates purchased Item to show purchased Item has been returned
  confirmReturnSingleItem(purchasedItem : purchasedItem, invoice: Invoice){
    purchasedItem.returnQ = purchasedItem.returnQ + this.Quantity;
    purchasedItem.display = true;
    this.invoiceService.returnOne(invoice);


  }
  // Cancel initial call to return purchased Item
  cancelReturnSingleItem(item : purchasedItem){
    item.display = true;
  }

  //Triggers return Invoice Menu
  returnAllMenu(invoice: Invoice){
    this.reset();
    this.invoiceSelected = invoice;
    this.pixelheight = this.invoices.toArray()[this.invoiceHistory.indexOf(invoice)].nativeElement.offsetHeight;
    invoice.display = !invoice.display;
  };

  //Returns all items belonging to an Invoice
  confirmReturnAll(invoice : Invoice){
    this.invoiceService.returnAll(invoice);
    invoice.purchasedItems.forEach(item => {
      item.returnQ = item.purchaseQ;
      });
  }

  // Cancel initial call to return all purchased Items
  cancelReturnAll(invoice : Invoice){
    invoice.display = true;
  }


  // Increase Item Quantity and Decrease Item Quantity change return quantity of a purchased Item
  increaseItemQuantity(item: purchasedItem){
    if(this.Quantity < item.purchaseQ - item.returnQ)
    this.Quantity++;
  }
  decreaseItemQuantity(){
    if(this.Quantity > 1)
      this.Quantity--;
  }

  reset(){
    if(this.purchaseditemSelected!=null)
      this.purchaseditemSelected.display = true;
    if(this.invoiceSelected!=null)
      this.invoiceSelected.display = true;
  }





}

