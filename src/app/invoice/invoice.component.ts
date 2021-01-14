import { Component, OnInit, ElementRef, ViewChildren, QueryList} from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { authService } from '../auth/auth.service';
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
  userIsAuthenticated: boolean;
  authStatusSub: Subscription;
  displayMessage: string = "No purchases have been made yet!";
  showInvoices = false;
  currentPage = 1;

  selectedInvoiceTax = 0;
  selectedInvoiceTotal = 0;
  selectedInvoiceShipping = 0;
  selectedinvoiceQty = 0;

  @ViewChildren('invoices') invoices: QueryList<ElementRef>;
  constructor(private invoiceService: invoiceService, private router: Router, private authService: authService) {}

  ngOnInit(){
    this.pixelheight = 0;
    console.log("initializing invoice component");
    this.isLoading = true;
    this.invoiceService.getInvoices(this.itemsPerPage, this.currentPage);
    this.invoiceSub = this.invoiceService.getInvoiceUpdateListener()
      .subscribe((invoiceData: {invoices: Invoice[], invoiceCount: number}) => {
        this.isLoading = false;
        this.totalInvoices = invoiceData.invoiceCount;
        let temp = invoiceData.invoices.slice().reverse();
        this.invoiceHistory = temp;
        if(this.invoiceHistory.length > 0){
          this.showInvoices = true;
        }
        this.totalInvoices = invoiceData.invoiceCount;
        console.log(this.invoiceHistory);
    })
    this.userIsAuthenticated = this.authService.getIsAuth();
    if(this.userIsAuthenticated == false){
      this.isLoading = false;
      this.displayMessage = "Sign in or make an account to view invoices!"
    }
    this.authStatusSub = this.authService
    .getAuthStatusListener()
    .subscribe( isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
    })
  }

  onChangedPage(pageData: PageEvent){
    console.log(pageData);
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.invoiceService.getInvoices(this.itemsPerPage, this.currentPage);
  }


  goLogin(){
    this.router.navigate(['/login']);
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
    // this.tempinvoice = invoice;
    this.reset();
    this.selectedInvoiceTax = 0;
    this.selectedInvoiceTotal = 0;
    this.selectedInvoiceShipping = 0;
    this.selectedinvoiceQty = 0;
    for(let i = 0; i < invoice.purchasedItems.length; i++){
      let qty : number = invoice.purchasedItems[i].purchaseQ - invoice.purchasedItems[i].returnQ;
      if(qty > 0){
        let purchasedItemTax = invoice.purchasedItems[i].item.individualTax * qty;
        let purchasedItemtotal = invoice.purchasedItems[i].item.individualPrice * qty;
        let purchasedItemShipping = invoice.purchasedItems[i].item.individualShipping * qty;
        this.selectedInvoiceTax += purchasedItemTax;
        this.selectedInvoiceShipping += purchasedItemShipping;
        this.selectedInvoiceTotal += purchasedItemShipping + purchasedItemTax + purchasedItemtotal;
        this.selectedinvoiceQty += 1;
      };
    }
    this.pixelheight = this.invoices.toArray()[this.invoiceHistory.indexOf(invoice)].nativeElement.offsetHeight;
    invoice.display = !invoice.display;
  };

  //Returns all items belonging to an Invoice
  confirmReturnAll(invoice : Invoice){
    this.invoiceService.returnAll(invoice);
    invoice.purchasedItems.forEach(item => {
      item.returnQ = item.purchaseQ;
      item.isReturned = true;
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

