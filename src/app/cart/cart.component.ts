import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { purchasesService } from '../purchases/purchases.service';
import { generalService } from '../service/general.service';
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
  @Input() hello: string;
  @Input() cartItems : cartItem[] = [];
  constructor(private generalService : generalService, private cartService: cartService, private router: Router, private purchasesService: purchasesService) { }

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
    this.cartService.clearCart();
    this.showlist = false;
    for(let item of this.cartItems){
      this.purchasesService.pushtoHistory(item);
    }
  }

  clear(){
    this.cartTotal = 0;
    this.cartService.clearCart();
    this.showlist = false;
  }

  buyItem(item: cartItem){
    this.purchasesService.pushtoHistory(item);
    for( let a of this.cartItems){
      if(a.id === item.id){
        if(a.qty > 1){
          a.qty = a.qty - 1;
          this.cartTotal = parseFloat((this.cartTotal - item.total).toFixed(2));
          this.cartService.setCartTotal(this.cartTotal);
        }
        else{
          this.cartTotal = parseFloat((this.cartTotal - item.total).toFixed(2));
          this.cartService.setCartTotal(this.cartTotal);
          this.cartItems.splice(this.cartItems.indexOf(a), 1);
          this.showlist = false;
        }

      }
    }
  }

  removeItem(item: cartItem){
    for( let a of this.cartItems){
      if(a.id === item.id){
        console.log(a);
        if(a.qty > 1){
          a.qty = a.qty - 1;
          this.cartTotal = parseFloat((this.cartTotal - item.total).toFixed(2));
          this.cartService.setCartTotal(this.cartTotal);
        }
        else{
          this.cartTotal = parseFloat((this.cartTotal - item.total).toFixed(2));
          this.cartService.setCartTotal(this.cartTotal);
          this.cartItems.splice(this.cartItems.indexOf(a), 1);
        }


      }
    }
  }


  showMore(item: Item){
    this.router.navigate(['/item', item.name], {queryParams: {id: item.id}});
  }



}
