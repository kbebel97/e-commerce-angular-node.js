import { Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
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
  cartItems = [];
  selectedItem : cartItem;
  @ViewChildren('items', {read: ElementRef}) items: QueryList<ElementRef>;
  searchInput = '';
  searchResult: Array<any> = [];
  name;
  checkboxAddress: boolean;
  checkboxPayment: boolean;
  elementHeights : Array<any> = [];
  disabled : boolean = true;
  isLoading: boolean = false;
  itemsPerPage = 20;
  cartitemsSub: Subscription;
  totalItems : number;
  checkoutMenu : boolean = false;



  constructor(private cartService: cartService, private router: Router, private invoiceService: invoiceService) { }

  ngOnInit(){
    console.log("initializing cart component");
    this.isLoading = true;
    this.cartService.getCartMongo(this.itemsPerPage, 1);
    this.cartitemsSub = this.cartService.getItemUpdateListener()
      .subscribe((cartData: {cartItems : cartItem[], ciCount: number}) => {
        this.isLoading = false;
        this.cartItems = cartData.cartItems;
        this.totalItems = cartData.ciCount;
        this.isListEmpty();
        this.getCartTotal();
        console.log("cart component initialized");
      })
  }

  removeCartItem(cartItem: cartItem){
    this.cartService.deleteItem(cartItem);
    this.cartItems.splice(this.cartItems.indexOf(cartItem), 1);
  }

  getCartTotal(){
    this.cartTotal = 0;
    console.log(this.cartItems);
    for(let cartItem of this.cartItems){
      this.cartTotal += (cartItem.item.individualTax + cartItem.item.individualPrice + cartItem.item.individualShipping) * cartItem.qty;
    }
  }

  ngOnDestroy(){
    this.reset();
  }

  toggleCheckoutMenu(){
    this.checkoutMenu = !this.checkoutMenu;
    this.disabled = !this.disabled;
  }

  checkout(){
    this.checkoutMenu = !this.checkoutMenu;
    this.cartService
    // this.getCartTotal();
    // this.invoiceService.pushtoHistory(this.cartItems);
    // this.cartService.clearCart();
    // this.isListEmpty();
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
    this.pixelheight = this.items.toArray()[this.cartItems.indexOf(cartItem)].nativeElement.offsetHeight;
    this.selectedItem = cartItem;
    this.selectedItem.display = false;
  }

  confirmCheckout(){
    this.cartService.addInvoice(this.cartItems, this.totalItems);
  }



  confirmPurchase(cartItem : cartItem){
    // let items : cartItem[] = new Array;
    // items.push(cartItem);
    // this.invoiceService.pushtoHistory(items);
    // this.cartTotal -= ((cartItem.item.individualShipping + cartItem.item.individualTax + cartItem.item.individualPrice) * cartItem.qty);
    // this.cartItems.splice(this.cartItems.indexOf(cartItem), 1);
    // this.cartService.setCartTotal(this.cartTotal);
    // cartItem.display = true;
    // this.paymentmenu = false;
    // this.isListEmpty();
  }

  cancelPurchase(cartItem : cartItem){
    this.paymentmenu = false;
    cartItem.display = true;
  }

  decreaseItemQuantity(cartItem: cartItem){
    if(cartItem.qty > 1){
      cartItem.qty--;
      this.cartService.adjustQuantity(cartItem);
      this.cartTotal -= cartItem.item.individualTax + cartItem.item.individualShipping + cartItem.item.individualPrice;
    } else{
      cartItem.qty--;
      this.cartService.deleteItem(cartItem);
      // this.cartService.adjustQuantity(cartItem);
      this.cartTotal -= cartItem.item.individualTax + cartItem.item.individualShipping + cartItem.item.individualPrice;
      this.cartService.setCartTotal(this.cartTotal);
      this.cartItems.splice(this.cartItems.indexOf(cartItem), 1);
      if(this.cartItems.length == 0)
        this.showlist = false;
    }
    this.cartService.setCartTotal(this.cartTotal);
  }

  increaseItemQuantity(cartItem: cartItem){
    cartItem.qty++;
    this.cartService.adjustQuantity(cartItem);
    this.cartTotal += cartItem.item.individualTax + cartItem.item.individualShipping + cartItem.item.individualPrice;
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
