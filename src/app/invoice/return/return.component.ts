import { Component, OnInit } from '@angular/core';
import { invoice } from 'src/app/shared/invoice.model';
import { purchasedItem } from 'src/app/shared/purchasedItem.model';
import { returnService } from './return.service';

@Component({
  selector: 'app-return',
  templateUrl: './return.component.html',
  styleUrls: ['./return.component.css']
})
export class ReturnComponent implements OnInit {
   invoice : invoice;
   item : purchasedItem;
   returnInvoice : boolean = false;
   name: string;
   quantity : number;
   tax : number;
   shipping : number;
   price : number;
   total: number;

  constructor(private returnService: returnService) { }

  ngOnInit(): void {
    if(this.returnService.getInvoice()!=null && this.returnService.getPurchasedItem()!=null){
      this.invoice = this.returnService.getInvoice();
      this.item = this.returnService.getPurchasedItem();
      this.name = this.item.name;
      this.quantity = this.item.quantity;
      this.total = this.item.total;
      this.price = this.item.singleItemTotal * this.quantity;
      this.tax = this.item.singleItemTax * this.item.quantity;
      this.shipping = this.item.singleItemShippingFee * this.item.quantity;
      this.returnInvoice = false;

    } else{
      this.invoice = this.returnService.getInvoice();
      this.returnInvoice = true;
    }
   }

   increaseItemQuantity(){
     if(this.quantity < this.item.quantity){
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
    this.item.quantity = this.quantity;
    this.item.returned = true;
    this.item.total = this.total;
    this.item.display = true;

  }
  cancel(){
    this.item.display = true;
  }




}
