import { Component, OnInit, ElementRef, AfterViewInit, ViewChildren, QueryList, OnChanges, Input} from '@angular/core';
import { Router } from '@angular/router';
import { invoice } from '../shared/invoice.model';
import { purchasedItem } from '../shared/purchasedItem.model';
import { invoiceService } from './invoice.service';


@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css']
})
export class InvoiceComponent implements OnInit, AfterViewInit, OnChanges{
  returnedall : boolean;
  invoiceHistory : invoice[];
  invoiceSelected: invoice;
  itemSelected: purchasedItem;
  pixelheight: number = 0;
  Quantity: number = 0;
  @ViewChildren('invoices') invoices: QueryList<ElementRef>;
  constructor(private invoiceService: invoiceService, private router: Router) {

  }

  ngOnChanges(): void {

  }


  ngOnInit(){
    this.pixelheight = 0;

    this.invoiceHistory = this.invoiceService.getPurchaseHistory();

    this.invoiceSelected = this.invoiceService.getInvoiceSelected();
    this.itemSelected = this.invoiceService.getPurchasedItemSelected();

    if(this.invoiceSelected!=null){
      this.invoiceSelected.display = true;
    }
    if(this.itemSelected!=null){
      this.itemSelected.display = true;
    }

  }

  ngAfterViewInit(){
    // for( let i = 0; i < this.invoiceHistory.length; i++){
    //   this.invoiceHistory[i].height = this.invoices.toArray()[i].nativeElement.offsetHeight;
    //   console.log(this.invoiceHistory[i].height);
    // }
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
    this.router.navigate(['/item', purchasedItem.name], {queryParams: {id: purchasedItem.id}});
  }



  returnItem(item: purchasedItem, invoice: invoice){
    this.reset();
    this.itemSelected = item;
    this.invoiceSelected = invoice;
    this.Quantity = item.purchaseQ - item.returnQ;
    this.itemSelected.display = false;
    // this.invoiceService.setInvoiceSelected(invoice);
    // this.invoiceService.setPurchasedItemSelected(purchasedItem);
    // this.returnService.setHeight(this.calculateElementHeight('item'));
    // this.returnService.setItem(this.itemSelected, this.invoiceSelected);
  }

  returnAll(invoice: invoice){
    this.reset();

    this.pixelheight = this.invoices.toArray()[this.invoiceHistory.indexOf(invoice)].nativeElement.offsetHeight;
    invoice.display = false;
    // this.isReturnable(invoice);
    // this.invoiceSelected = invoice;
    // this.invoiceSelected.display = false;
    // this.invoiceService.setInvoiceSelected(invoice);
    // this.returnService.setInvoice(invoice);
    // this.returnService.setHeight(this.calculateElementHeight('invoice'));
  };

  // calculateElementHeight(a : string){
  //   if(a === 'item'){
  //     let itemsArr = this.items.toArray();
  //     let height = itemsArr[this.invoiceSelected.purchasedItems.indexOf(this.itemSelected)];
  //     console.log(height.nativeElement.offsetHeight);

  //     if(height === undefined)
  //       return this.itemSelected.height;
  //     else {
  //       this.itemSelected.height = height.nativeElement.offsetHeight;
  //       return height.nativeElement.offsetHeight;
  //     }
  //   } else {
  //     let invoicesArr = this.invoices.toArray();
  //     let height = invoicesArr[this.invoiceHistory.indexOf(this.invoiceSelected)];
  //     console.log(height.nativeElement.offsetHeight);
  //     if(height === undefined)
  //       return this.invoiceSelected.height;
  //     else {
  //       this.invoiceSelected.height = height.nativeElement.offsetHeight;
  //       return height.nativeElement.offsetHeight;
  //     }
  //   }

  // }

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
  // returnItem(purchasedItem: purchasedItem, invoice: invoice){
  //   this.reset();
  //   let i = this.items.toArray();
  //   let pixelH = i[invoice.purchasedItems.indexOf(purchasedItem)];
  //   let height;
  //   // height = pixelH.nativeElement.offsetHeight;

  //      if(pixelH === undefined){
  //         height = purchasedItem.height;
  //       } else {
  //         height = pixelH.nativeElement.offsetHeight;
  //       }
  //   console.log(height);
  //   this.invoiceSelected = invoice;
  //   this.itemSelected = purchasedItem;
  //   this.itemSelected.display = false;
  //   this.returnService.setHeight(height);
  //   this.invoiceService.setInvoiceSelected(invoice);
  //   this.invoiceService.setPurchasedItemSelected(purchasedItem);
  //   this.returnService.setItem(this.itemSelected, invoice);
  // }

  // returnAll(invoice: invoice){
  //   this.reset();
  //   let i = this.invoices.toArray();
  //   let n : number = this.invoiceHistory.indexOf(invoice);
  //   let pixelH = i[n];
  //   console.log(pixelH);
  //   let height;
  //   // height = pixelH.nativeElement.offsetHeight;

  //   if(pixelH === undefined){
  //     height = invoice.height;
  //   } else {
  //     height = pixelH.nativeElement.offsetHeight;
  //   }
  //   // console.log(height);

  //   this.invoiceSelected = invoice;
  //   this.invoiceSelected.display = false;
  //   this.invoiceService.setInvoiceSelected(invoice);
  //   this.returnService.setInvoice(invoice);
  //   this.returnService.setHeight(height);
  // };

  reset(){
    if(this.itemSelected!=null){
      this.itemSelected.display = true;
    }
    if(this.invoiceSelected!=null){
      this.invoiceSelected.display = true;
    }

  }





}

