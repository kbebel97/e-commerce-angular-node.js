import { cartItem } from '../shared/cartItem.model';
import { Item } from '../shared/Item.model';

export class cartService{
  private cartItems = [];
  private cartTotal = 0;

  pushtoCart(item: Item){
    let check: boolean = false;
    for( let a of this.cartItems){
      if(a.id === item.id){
        console.log(a);
        check = true;
        a.qty = a.qty + 1;
        console.log(a.qty);
        console.log(a.total);
        this.setCartTotal(parseFloat((this.cartTotal + a.total).toFixed(2)));

        console.log(this.cartTotal);
      }
    }
    if(check === false){
      item.total = parseFloat((item.amount * 1.2).toFixed(2));
      item.shippingFee = parseFloat((item.total - item.amount).toFixed(2));
      let cI = new cartItem(item.id, item.name, item.shippingFee, item.description, item.amount, item.total, 1, item.manufacturer);
      this.cartTotal += parseFloat(item.total.toFixed(2));
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
      if(a.id === item.id){
        this.cartItems.splice(this.cartItems.indexOf(a), 1);
        break;
      }
    }

  }


}
