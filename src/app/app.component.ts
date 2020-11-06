import { Component } from '@angular/core';
import { cartService } from './cart/cart.service';
import { catalogService } from './catalog/catalog.service';
import { itemService } from './item/item.service';
import { Item } from './shared/Item.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  cartTotal: number = 0;
  shippingFee: number;
  catalogItems = [];
  cartItems = [];
  purchasedItems = [];
  loadedFeature = 'catalog';
  loadedNav = 'true';
  loadedItem: Item = null;
  constructor(private catalogService: catalogService, private cartService: cartService, private itemService: itemService) { }



  ngOnInit(){}
    // this.catalogService.itemSelected
    //   .subscribe(
    //     (item : Item) => {

    //       this.shippingFee = item.amount * .02;
    //       this.cartItems.push(new cartItem(item.name, item.description, item.amount, this.shippingFee));
    //       let a = 0;
    //       for(let i=0; i<this.cartItems.length; i++){
    //         console.log(this.cartItems[i].amount);
    //         a += parseInt(this.cartItems[i].amount);
    //       }            console.log(a);
    //       this.cartTotal = a;



    //     }
    //   )


    // this.catalogService.inspectMore
    // .subscribe(
    //   (item: Item) => {
    //     this.loadedItem = item;
    //     this.loadedFeature = 'item'
    //   }
    // )

  //   this.cartService.removeItem
  //     .subscribe(
  //       (item: Item) => {
  //         const index = this.cartItems.indexOf(item, 0);
  //         if (index > -1) {
  //           this.cartTotal -= this.cartItems[index].amount;
  //           this.cartItems.splice(index, 1);
  //         }
  //       }
  //     )

  //   this.cartService.addItemHistory
  //     .subscribe((item: Item) => {
  //       this.purchasedItems.push(item);
  //       }
  //     )

  //   this.itemService.goBack
  //     .subscribe((loadedFeature: string)=> {
  //         this.loadedFeature = loadedFeature;
  //       }
  //     )

  //   this.itemService.addtoCart
  //     .subscribe(
  //     (item : Item) => {

  //       this.shippingFee = item.amount * .02;
  //       this.cartItems.push(new cartItem(item.name, item.description, item.amount, this.shippingFee));
  //       let a = 0;
  //       for(let i=0; i<this.cartItems.length; i++){
  //         console.log(this.cartItems[i].amount);
  //         a += parseInt(this.cartItems[i].amount);
  //       }            console.log(a);
  //       this.cartTotal = a;



  //     }
  //   )




  // }

  // inspectItem(){
  //   this.loadedFeature = null;
  //   return false;

  // }


  // onNavigate(feature: string){
  //   this.loadedFeature = feature;
  // }

  // addtoCart(item: Item){
  //   this.cartItems.push(item);

  // }

  // deletefromCart(item: Item){
  //   const index = this.cartItems.indexOf(item, 0);
  //   if (index > -1) {
  //     this.cartItems.splice(index, 1);
  //   }

  // }

}
