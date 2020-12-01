import { Component, OnInit } from '@angular/core';
import { invoice } from 'src/app/shared/invoice.model';
import { purchasedItem } from 'src/app/shared/purchasedItem.model';
import { invoiceService } from '../invoice.service';
import { returnService } from './return.service';

@Component({
  selector: 'app-return',
  templateUrl: './return.component.html',
  styleUrls: ['./return.component.css']
})
export class ReturnComponent implements OnInit {
  // Objects
   invoice : invoice;
   item : purchasedItem;
  //  componentSelected : string;

   // Primitives
   seller : string;
   returnInvoice : boolean;
   name: string;
   quantity : number;
   tax : number;
   shipping : number;
   price : number;
   total: number;

  constructor(private returnService: returnService, private invoiceService: invoiceService) { }

  ngOnInit(): void {
    // this.componentSelected = this.returnService.getComponentSelected();
    if(this.returnService.getInvoice()!=null && this.returnService.getPurchasedItem()!=null){
      this.invoice = this.returnService.getInvoice();
      this.item = this.returnService.getPurchasedItem();
      if(this.item.returnQ == 0){
        this.quantity = this.item.purchaseQ;
      } else {
        this.quantity = this.item.purchaseQ - this.item.returnQ;
      }
      this.name = this.item.name;
      this.seller = this.item.manufacturer;
      this.price = this.item.singleItemTotal * this.quantity;
      this.tax = this.item.singleItemTax * this.quantity;
      this.shipping = this.item.singleItemShippingFee * this.quantity;
      this.total = (this.item.singleItemTotal + this.item.singleItemTax + this.item.singleItemShippingFee) * this.quantity;
      this.returnInvoice = false;
    } else{
      this.invoice = this.returnService.getInvoice();
      this.returnInvoice = true;
    }
   }


   increaseItemQuantity(){
     if(this.quantity < (this.item.purchaseQ - this.item.returnQ)){
       this.quantity = this.quantity + 1;
       this.tax= this.item.singleItemTax * this.quantity;
       this.shipping = this.item.singleItemShippingFee * this.quantity;
       this.total = (this.item.singleItemShippingFee + this.item.singleItemTax + this.item.singleItemTotal) * this.quantity;
       this.price = this.item.singleItemTotal * this.quantity;
     }
   }

   decreaseItemQuantity(){
     if(this.quantity > 1){
       this.quantity = this.quantity - 1;
       this.tax= this.item.singleItemTax * this.quantity;
       this.shipping = this.item.singleItemShippingFee * this.quantity;
       this.total = (this.item.singleItemShippingFee + this.item.singleItemTax + this.item.singleItemTotal) * this.quantity;
       this.price = this.item.singleItemTotal * this.quantity;
     }

   }


  confirm(){
      // this.item.quantity = this.item.quantity - this.quantity;
      // if(this.item.quantity == 0){
      //   this.invoice.purchasedItems.splice(this.invoice.purchasedItems.indexOf(this.item), 1);
      //   if(this.invoice.purchasedItems.length == 0){
      //     this.invoiceService.deletefromInvoiceHistory(this.invoice);
      //   }
      // } else{
      //   this.item.total = this.item.total - ((this.item.singleItemShippingFee + this.item.singleItemTax + this.item.singleItemTotal) * this.quantity);
      //   this.item.display = true;
      // }
      // this.invoice.total = this.invoice.total - (this.item.singleItemShippingFee + this.item.singleItemTax + this.item.singleItemTotal) * this.quantity;
      // this.invoice.tax = this.invoice.tax - (this.item.singleItemTax * this.quantity);
      // this.invoice.shipping = this.invoice.shipping - (this.item.singleItemShippingFee * this.quantity);
      this.item.returnQ = this.item.returnQ + this.quantity;
      this.item.display = true;
      // this.invoiceService.isReturned();



  }
  cancel(){
    this.item.display = true;

  }

  cancel2(){
    this.invoice.display = true;
    // this.componentSelected = '';
  }


  confirm2(){
    this.invoice.purchasedItems.forEach(function(item){
      item.returnQ = item.purchaseQ;
    })
    this.invoice.display = true;
  }



}
