import { Injectable } from '@angular/core';
import { cartItem } from '../shared/cartItem.model';
import { Item } from '../shared/Item.model';

@Injectable()
export class cartService{
  private cartItems = [];
  private cartTotal = 0;

  pushtoCart(item: Item){
    let check: boolean = false;
    // If cartItem quantity is greater than 1
    // add to existing cart Item by adding one to quantity and adjusting shipping, tax and cartItemTotal
    for( let cartItem of this.cartItems){
      if(cartItem.itemId === item.id){
        check = true;
        let qty = cartItem.qty + 1;
        let shippingFee = parseFloat((cartItem.shippingFee + (item.total * 1.2 - item.total)).toFixed(2));
        let tax = parseFloat((cartItem.tax + (item.total * 1.1 - item.total)).toFixed(2));
        let cartItemTotal = parseFloat((cartItem.total +  item.total + (item.total * 1.1 - item.total) + (item.total * 1.2 - item.total)).toFixed(2));
        cartItem.qty = qty;
        cartItem.shippingFee = shippingFee;
        cartItem.tax = tax;
        cartItem.total = cartItemTotal;
        this.cartTotal += (item.total + (item.total * 1.2 - item.total) + (item.total * 1.1 - item.total));
        console.log(cartItem);
      }
    }

    // If cartItem quantity is 0
    // create a new cartItem to display and add it to cartItems array
    if(check === false){
      let tax = parseFloat((item.total * 1.1 - item.total).toFixed(2));
      let shipping = parseFloat((item.total * 1.2 - item.total).toFixed(2));
      let cartItemTotal = parseFloat((item.total + tax + shipping).toFixed(2));
      let cI = new cartItem(Date.now() * item.id,
                            item.id,
                            item.name,
                            item.description,
                            1,
                            item.manufacturer,
                            parseFloat((item.total * 1.1 - item.total).toFixed(2)),
                            parseFloat((item.total * 1.2 - item.total).toFixed(2)),
                            item.total,
                            tax,
                            shipping,
                            cartItemTotal,
                            true);
      this.cartTotal += parseFloat(cartItemTotal.toFixed(2));
      this.cartItems.push(cI);
    }
    console.log(this.cartItems);


  }

  setCartTotal(total: number){
    this.cartTotal = total;

  }

  getCartItems(){
    return this.cartItems;
  }

  getCartTotal(){
    return this.cartTotal;
  }

  clearCart(){
    this.cartItems.splice(0, this.cartItems.length);
    this.cartTotal = 0;
  }

  deleteItem(item: cartItem){
    for( let a of this.cartItems){
      if(a.cartId === item.cartId){
        this.cartItems.splice(this.cartItems.indexOf(a), 1);
        break;
      }
    }

  }


}
