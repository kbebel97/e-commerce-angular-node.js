import { Injectable } from '@angular/core';
import { cartItem } from '../shared/cartItem.model';
import { Item } from '../shared/Item.model';

@Injectable()
export class cartService{
  private cartItems : cartItem[] = [];
  private cartTotal = 0;


  pushtoCart(item: Item){
    let check: boolean = false;
    for( let cartItem of this.cartItems){
      if(cartItem.item.id === item.id){
        cartItem.qty++;
        check = true;
        this.cartTotal += cartItem.item.indiviudalPrice + cartItem.item.individualTax + cartItem.item.individualShipping;
      }
    }
    if(check === false){
      let cI = new cartItem(this.cartItems.length + 1, 1, true, item);
      this.cartTotal += item.indiviudalPrice + item.individualTax + item.individualShipping;
      this.cartItems.push(cI);
    }
  }

  setCartTotal(total: number){
    this.cartTotal = total;

  }

  getCartItems(){
    return this.cartItems;
  }

  getCartTotal(){
    this.cartTotal = 0;
    for(let cartItem of this.cartItems){
      this.cartTotal += (cartItem.item.individualTax + cartItem.item.indiviudalPrice + cartItem.item.individualShipping) * cartItem.qty;
    }
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

  //Crud Operations

    // pushtoCart(item : Item){
    //   check if item already exists in cart table by searching by userId and itemId
    //   , if it does, increase item qty
    //   else add new entry to cart table.
    // }

    // FetchCart(){
    // on component initializiation, fetch cart data
    // Get all cart items by userId. Add these cart items to cartItem
    // }

    // deletefromCart(item : Item){
    //   check quantity of cart item, if above 1, decrease qty field in entry,
    //   otherwise remove item from cart entirely
    // }

    // clearCart(){
    //  remove all cartItems from cart table based on userId and ItemId
    //}







}
