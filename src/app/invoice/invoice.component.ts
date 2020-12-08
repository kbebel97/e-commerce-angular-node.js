// import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, ViewChildren, QueryList} from '@angular/core';
// import { Router } from '@angular/router';
// import { invoice } from '../shared/invoice.model';
// import { purchasedItem } from '../shared/purchasedItem.model';
// import { invoiceService } from './invoice.service';
// import { returnService } from './return/return.service';


// @Component({
//   selector: 'app-invoice',
//   templateUrl: './invoice.component.html',
//   styleUrls: ['./invoice.component.css']
// })
// export class InvoiceComponent implements OnInit, AfterViewInit{
//   returnedall : boolean;
//   invoiceHistory : invoice[];
//   invoiceSelected: invoice;
//   purchasedItemSelected: purchasedItem;
//   pixelheight: number = 0;
//   @ViewChildren('invoices') invoices: QueryList<ElementRef>;
//   @ViewChildren('items') items: QueryList<ElementRef>;
//   constructor(private invoiceService: invoiceService,
//               private returnService: returnService,
//               private router: Router) {

//   }

//   ngOnInit(){
//     this.pixelheight = 0;

//     this.invoiceHistory = this.invoiceService.getPurchaseHistory();

//     this.invoiceSelected = this.invoiceService.getInvoiceSelected();
//     this.purchasedItemSelected = this.invoiceService.getPurchasedItemSelected();

//     if(this.invoiceSelected!=null){
//       this.invoiceSelected.display = true;
//     }
//     if(this.purchasedItemSelected!=null){
//       this.purchasedItemSelected.display = true;
//     }

//   }

//   ngAfterViewInit(){
//     this.invoices.toArray().forEach(item => console.log(item.nativeElement.offsetHeight));
//   }

//   isReturned(invoice){
//     let returned : boolean = false;
//       invoice.purchasedItems.forEach(item => {
//         if(item.returnQ != item.purchaseQ){
//           returned = true;
//         }
//       });
//       return returned;

//   }
//   calculateheight(element){
//     this.pixelheight += element.nativeElement.offsetHeight;
//     console.log(this.pixelheight);

//   }

//   onShowMore(purchasedItem: purchasedItem){
//     this.router.navigate(['/item', purchasedItem.name], {queryParams: {id: purchasedItem.id}});
//   }

//   returnItem(purchasedItem: purchasedItem, invoice: invoice){
//     this.reset();
//     // let n : number = this.invoiceHistory.indexOf(invoice);
//     let i = this.items.toArray();
//     let pixelH = i[invoice.purchasedItems.indexOf(purchasedItem)];
//     let H = pixelH.nativeElement.offsetHeight;
//     console.log(H);
//     this.invoiceSelected = invoice;
//     this.purchasedItemSelected = purchasedItem;
//     this.purchasedItemSelected.display = false;
//     this.returnService.setHeight(H);
//     this.invoiceService.setInvoiceSelected(invoice);
//     this.invoiceService.setPurchasedItemSelected(purchasedItem);
//     this.returnService.setItem(this.purchasedItemSelected, invoice);
//   }

//   returnAll(invoice: invoice){
//     this.reset();
//     let n : number = this.invoiceHistory.indexOf(invoice);
//     let i = this.invoices.toArray();
//     let pixelH = i[n];
//     console.log(pixelH);
//     let H = pixelH.nativeElement.offsetHeight;
//     console.log(H);

//     this.invoiceSelected = invoice;
//     this.invoiceSelected.display = false;
//     this.invoiceService.setInvoiceSelected(invoice);
//     this.returnService.setInvoice(invoice);
//     this.returnService.setHeight(H);
//   };

//   reset(){
//     if(this.purchasedItemSelected!=null){
//       this.purchasedItemSelected.display = true;
//     }
//     if(this.invoiceSelected!=null){
//       this.invoiceSelected.display = true;
//     }
//   }





// }
