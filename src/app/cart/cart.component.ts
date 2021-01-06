import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
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
export class CartComponent implements OnInit{
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
  cartitemsSub: Subscription;
  checkoutMenu : boolean = false;
  totalItems = 150;
  itemsPerPage = 20;
  currentPage = 1;



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
    this.isListEmpty();
  }

  getCartTotal(){
    this.cartTotal = 0;
    console.log(this.cartItems);
    for(let cartItem of this.cartItems){
      this.cartTotal += (cartItem.item.individualTax + cartItem.item.individualPrice + cartItem.item.individualShipping) * cartItem.qty;
    }
  }

  onChangedPage(pageData: PageEvent){
    console.log(pageData);
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.cartService.getCartMongo(this.itemsPerPage, this.currentPage);
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

  toggleCheckoutMenu(){
    this.checkoutMenu = !this.checkoutMenu;
    this.disabled = !this.disabled;
  }

  confirmCheckout(){
    this.cartService.addInvoice(this.cartItems, this.totalItems);
    this.cartService.deleteAll();
    this.checkoutMenu = !this.checkoutMenu;
    this.cartItems.splice(0, this.cartItems.length);
    this.isListEmpty();
  }



  confirmPurchase(cartItem : cartItem){
    this.cartService.addOne(cartItem);
    this.cartItems.splice(this.cartItems.indexOf(cartItem), 1);
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
    this.isListEmpty();
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
