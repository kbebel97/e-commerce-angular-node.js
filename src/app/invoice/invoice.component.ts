import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { invoice } from '../shared/invoice.model';
import { purchasedItem } from '../shared/purchasedItem.model';
import { invoiceService } from './invoice.service';
import { returnService } from './return/return.service';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css']
})
export class InvoiceComponent implements OnInit {
  returnedall : boolean;
  invoiceHistory : invoice[];
  invoiceSelected: invoice;
  purchasedItemSelected: purchasedItem;
  constructor(private invoiceService: invoiceService, private returnService: returnService, private router: Router) {

  }

  ngOnInit(){
    this.invoiceHistory = this.invoiceService.getPurchaseHistory();

    this.invoiceSelected = this.invoiceService.getInvoiceSelected();
    this.purchasedItemSelected = this.invoiceService.getPurchasedItemSelected();

    if(this.invoiceSelected!=null){
      this.invoiceSelected.display = true;
    }
    if(this.purchasedItemSelected!=null){
      this.purchasedItemSelected.display = true;
    }

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

  returnItem(purchasedItem: purchasedItem, invoice: invoice){
    if(this.purchasedItemSelected!=null){
      this.purchasedItemSelected.display = true;
    }
    if(this.invoiceSelected!=null){
      this.invoiceSelected.display = true;
    }
    this.invoiceSelected = invoice;
    this.purchasedItemSelected = purchasedItem;
    this.purchasedItemSelected.display = false;
    this.invoiceService.setInvoiceSelected(invoice);
    this.invoiceService.setPurchasedItemSelected(purchasedItem);
    this.returnService.purchasedItemtoReturn(this.purchasedItemSelected, invoice);
  }





  returnAll(invoice: invoice){
    if(this.invoiceSelected!=null){
      this.invoiceSelected.display = true;
    }
    if(this.purchasedItemSelected!= null){
      this.purchasedItemSelected.display = true;
    }
    this.invoiceSelected = invoice;
    this.invoiceSelected.display = false;
    this.invoiceService.setInvoiceSelected(invoice);
    this.returnService.invoicetoReturn(invoice);
  };



}
