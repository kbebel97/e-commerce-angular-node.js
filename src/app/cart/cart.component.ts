import { ChangeDetectorRef, Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { invoiceService } from '../invoice/invoice.service';
import { cartItem } from '../shared/cartItem.model';
import { cartService } from './cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']

})
export class CartComponent implements OnInit, OnDestroy{
  cartTotal = 0;
  showlist: boolean;
  paymentmenu: boolean;
  pixelheight: number;
  cartItems : cartItem[] = [];
  selectedItem : cartItem;
  @ViewChildren('items', {read: ElementRef}) items: QueryList<ElementRef>;
  searchInput = '';
  searchResult: Array<any> = [];
  name;
  checkboxAddress: boolean;
  checkboxPayment: boolean;
  elementHeights : Array<any> = [];
  disabled : boolean = true;

  constructor(private cartService: cartService, private router: Router, private invoiceService: invoiceService, private cdr: ChangeDetectorRef) { }

  ngOnInit(){
    console.log("initializing cart component");
    this.reset();
    this.cartItems = this.cartService.getCartItems();
    this.cartTotal = this.cartService.getCartTotal();
    this.isListEmpty();
  }

  ngOnDestroy(){
    this.reset();
  }

  checkout(){
    this.cartTotal = this.cartService.getCartTotal();
    this.invoiceService.pushtoHistory(this.cartItems);
    this.cartService.clearCart();
    this.isListEmpty();
  }

  isListEmpty(){
    if(this.cartItems.length == 0){
       this.showlist = false
       this.disabled = true;

    }
    else{
      this.showlist = true;
      this.disabled = false;
    }
  }

  clear(){
    this.cartTotal = 0;
    this.cartService.clearCart();
    this.isListEmpty();
  }

  paymentMenu(cartItem: cartItem){
    this.reset();
    console.log(this.cartItems.indexOf(cartItem));
    this.pixelheight = this.items.toArray()[this.cartItems.indexOf(cartItem)].nativeElement.offsetHeight;
    console.log(this.pixelheight);
    this.selectedItem = cartItem;
    this.selectedItem.display = false;
  }



  confirmPurchase(cartItem : cartItem){
    let items : cartItem[] = new Array;
    items.push(cartItem);
    this.invoiceService.pushtoHistory(items);
    this.cartTotal -= ((cartItem.item.individualShipping + cartItem.item.individualTax + cartItem.item.indiviudalPrice) * cartItem.qty);
    this.cartItems.splice(this.cartItems.indexOf(cartItem), 1);
    this.cartService.setCartTotal(this.cartTotal);
    cartItem.display = true;
    this.paymentmenu = false;
    this.isListEmpty();
  }

  cancelPurchase(cartItem : cartItem){
    this.paymentmenu = false;
    cartItem.display = true;
  }

  decreaseItemQuantity(cartItem: cartItem){
    if(cartItem.qty > 1){
      cartItem.qty--;
      this.cartTotal -= cartItem.item.individualTax + cartItem.item.individualShipping + cartItem.item.indiviudalPrice;
    }
    else{
      this.cartTotal -= cartItem.item.individualTax + cartItem.item.individualShipping + cartItem.item.indiviudalPrice;
      this.cartService.setCartTotal(this.cartTotal);
      this.cartItems.splice(this.cartItems.indexOf(cartItem), 1);
      if(this.cartItems.length == 0)
        this.showlist = false;
    }
    this.cartService.setCartTotal(this.cartTotal);
  }

  increaseItemQuantity(cartItem: cartItem){
    cartItem.qty++;
    this.cartTotal += cartItem.item.individualTax + cartItem.item.individualShipping + cartItem.item.indiviudalPrice;
    this.cartService.setCartTotal(this.cartTotal);
  }

  showMore(cartItem: cartItem){
    this.router.navigate(['/item', cartItem.item.name], {queryParams: {id: cartItem.item.id}});
  }

  reset(){
    if(this.selectedItem!=null)
      this.selectedItem.display = true;
  }



}
