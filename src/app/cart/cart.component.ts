import { Component, Input, OnInit } from '@angular/core';
import { cartService } from '../service/cart.service';
import { generalService } from '../service/general.service';
import { Item } from '../shared/Item.model';
@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']

})
export class CartComponent implements OnInit {
  @Input() cartTotal = 0;
  showlist: boolean;
  @Input() hello: string;
  @Input() cartItems = [];
  // @Output() deletefromCar = new EventEmitter<Item>();
  constructor(private generalService : generalService, private cartService: cartService) { }

  ngOnInit(){
    this.cartItems = this.generalService.getcartItems();
    this.cartTotal += this.generalService.getCartTotal();
    console.log(this.cartItems);
    // this.generalService.addtoCart.subscribe(
    //   (item: Item) => {
    //     console.log(item);
    //     this.cartItems.push(item);
    //   }
    // )
    if(this.cartItems.length == 0){
      this.showlist = false;
    }
    else this.showlist = true;
  }


  checkout(){
    // this.cartService.purchaseAll.emit(this.cartItems)
    this.cartItems = [];

  }

  clear(){
    this.cartItems = [];
  }

  addItem(item: Item){
    this.cartItems.push(item);

  }



  buyItem(item: Item){
    this.cartService.addItemHistory.emit(item);
    this.cartService.removeItem.emit(item);


  }

  removeItem(item: Item){
    this.cartService.removeItem.emit(item);
  }
}
