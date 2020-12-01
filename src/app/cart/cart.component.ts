import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// import { parse } from 'path';
import { invoiceService } from '../invoice/invoice.service';
import { cartItem } from '../shared/cartItem.model';
import { Item } from '../shared/Item.model';
import { cartService } from './cart.service';
@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']

})
export class CartComponent implements OnInit {
  @Input() cartTotal = 0;
  showlist: boolean;
  @Input() cartItems : cartItem[] = [];
  constructor(private cartService: cartService, private router: Router, private invoiceService: invoiceService) { }

  ngOnInit(){
    this.cartItems = this.cartService.getCartItems();
    this.cartTotal = parseFloat(this.cartService.getCartTotal().toFixed(2));
    if(this.cartItems.length == 0){
      this.showlist = false;
    }
    else this.showlist = true;
  }


  checkout(){
    this.cartTotal = 0;
    this.showlist = false;
    this.invoiceService.pushtoHistory(this.cartItems);
    this.cartService.clearCart();


  }

  clear(){
    this.cartTotal = 0;
    this.cartService.clearCart();
    this.showlist = false;
  }

  buyItem(cartItem: cartItem){
    let items : cartItem[] = new Array;
    items.push(cartItem);
    this.invoiceService.pushtoHistory(items);
    this.cartTotal = parseFloat((this.cartTotal - ((cartItem.indiviudalshippingFee + cartItem.individualTax + cartItem.individualPrice) * cartItem.qty)).toFixed(2));
    this.cartItems.splice(this.cartItems.indexOf(cartItem), 1);
    this.cartService.setCartTotal(this.cartTotal);
  }



  decreaseItemQuantity(item: cartItem){
    if(item.qty > 1){
      let singleItemShippingFee = parseFloat((item.shippingFee/item.qty).toFixed(2));
      let singleItemTax = parseFloat((item.tax/item.qty).toFixed(2));
      let singleItemTotal = parseFloat((item.total/item.qty).toFixed(2));
      item.shippingFee = parseFloat((item.shippingFee - singleItemShippingFee).toFixed(2));
      item.tax = parseFloat((item.tax - singleItemTax).toFixed(2));
      item.total = parseFloat((item.total - singleItemTotal).toFixed(2));
      item.qty = item.qty - 1;
      this.cartTotal = parseFloat((this.cartTotal - singleItemTotal).toFixed(2));
      this.cartService.setCartTotal(this.cartTotal);
    }
    else{
      this.cartTotal = parseFloat((this.cartTotal - item.total).toFixed(2));
      this.cartService.setCartTotal(this.cartTotal);
      this.cartItems.splice(this.cartItems.indexOf(item), 1);
      if(this.cartItems.length == 0){
        this.showlist = false;
      }
    }
  }

  increaseItemQuantity(item: cartItem){
    item.qty = item.qty + 1;
    item.tax = parseFloat((item.tax + item.individualTax).toFixed(2));
    item.shippingFee = parseFloat((item.shippingFee + item.indiviudalshippingFee).toFixed(2));
    item.total = parseFloat((item.total + item.individualPrice + item.individualTax + item.indiviudalshippingFee).toFixed(2));
    this.cartTotal = parseFloat((this.cartTotal + item.individualPrice + item.individualTax + item.indiviudalshippingFee).toFixed(2));
    this.cartService.setCartTotal(this.cartTotal);


  }


  showMore(item: Item){
    this.router.navigate(['/item', item.name], {queryParams: {id: item.id}});
  }



}
