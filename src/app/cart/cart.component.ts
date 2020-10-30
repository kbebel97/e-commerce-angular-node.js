import { Component, OnInit } from '@angular/core';
import { cartService } from '../service/cart.service';
import { Item } from '../shared/Item.model';
@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
  providers: [cartService]
})
export class CartComponent implements OnInit {
  cartTotal: number = 0;
  cartItems = [];
  constructor(private service: cartService) { }

  ngOnInit(){
    this.cartItems = this.service.getItems();
    for (var item of this.cartItems) {
      this.cartTotal = this.cartTotal + item.amount;
    }
    // this.service.itemChange
    //   .subscribe(
    //     (items : Item[]) => {
    //       this.cartItems = items;
    //     }
    //   )
  }
  checkout(){
    this.service.addAll()
    this.cartItems = [];

  }

  clear(){
    this.cartItems = [];
  }

  addItem(item: Item){
    this.service.addItem(item);
    const index = this.cartItems.indexOf(item, 0);
    if (index > -1) {
      this.cartItems.splice(index, 1);
    }

  }

  removeItem(item: Item){
    const index = this.cartItems.indexOf(item, 0);
    if (index > -1) {
      this.cartItems.splice(index, 1);
    }
  }
}
