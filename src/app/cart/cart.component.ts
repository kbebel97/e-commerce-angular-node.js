import { AfterViewInit, Component, ElementRef, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
// import { parse } from 'path';
import { invoiceService } from '../invoice/invoice.service';
import { cartItem } from '../shared/cartItem.model';
import { Item } from '../shared/Item.model';
import { cartService } from './cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']

})
export class CartComponent implements OnInit, AfterViewInit{
  @Input() cartTotal = 0;
  showlist: boolean;
  mainmenu: boolean;
  paymentmenu: boolean;
  pixelheight: number;
  @Input() cartItems : cartItem[] = [];
  @ViewChildren('items') items: QueryList<ElementRef>;
  searchInput = '';
  searchResult: Array<any> = [];
  @Input() name;
  checkboxAddress: boolean;
  checkboxPayment: boolean;


  public seriesList: Array<any> = [
    {
         "name": "Prison Break",
         "description": "Structural Engineer Michael Scofield turns himself into the Fox River Penitentiary in order to break out his brother Lincoln Burrows, who is on death row for the murder of the Vice President's brother. But Lincoln was set up by some of the Company (an agency formed by corrupt government officials) guys, headed by General Jonathan Krantz. Michael breaks out from Fox River with his brother Lincoln and other convicts.",
         "genres": "Action, Crime, Drama, Mystery, Thriller",
         "releaseDate": "29 August 2005 (USA)"
     },
     {
      "name": "Vikings",
      "description": "The adventures of Ragnar Lothbrok: the greatest hero of his age. The series tells the saga of Ragnar's band of Viking brothers and his family as he rises to become King of the Viking tribes. As well as being a fearless warrior, Ragnar embodies the Norse traditions of devotion to the gods: legend has it that he was a direct descendant of Odin, the god of war and warriors.",
      "genres": "Action, Drama, History, War",
      "releaseDate": "3 March 2013 (USA)"
      },
      {
      "name": "Person of Interest",
      "description": "A billionaire software-genius named Harold Finch creates a Machine for the government that is designed to detect acts of terror before they can happen, by monitoring the entire world through every cell-phone, email and surveillance camera. Finch discovered that the machine sees everything, potential terrorist acts and violent crimes that involve ordinary people.",
      "genres": "Action, Drama, Mystery, Sci-Fi, Thriller",
      "releaseDate": "22 September 2011 (USA)"
      }

   ]

  constructor(private cartService: cartService, private router: Router, private invoiceService: invoiceService) { }

  ngOnInit(){
    this.mainmenu = true;
    this.paymentmenu = false;

    this.cartItems = this.cartService.getCartItems();
    this.cartTotal = parseFloat(this.cartService.getCartTotal().toFixed(2));
    if(this.cartItems.length == 0){
      this.showlist = false;
    }
    else this.showlist = true;
  }

  ngAfterViewInit(){
    // for( let i = 0; i < this.cartItems.length; i++){
    //   this.cartItems[i].height = this.invoices.toArray()[i].nativeElement.offsetHeight;
    //   console.log(this.invoiceHistory[i].height);
    // }
  }

  fetchSeries(event: any) {
    if (event.target.value === '') {
      return this.searchResult = [];
    }
    this.searchResult = this.seriesList.filter((series) => {
      return series.name.toLowerCase().startsWith(event.target.value.toLowerCase());
    })
  }


  checkout(){
    this.cartTotal = 0;
    this.showlist = false;
    this.invoiceService.pushtoHistory(this.cartItems);
    this.cartService.clearCart();
  }

  clear(){
    this.cartTotal = 0;
    this.cartService.clearCart();
    this.showlist = false;
  }

  buyItem(cartItem: cartItem){
    // let items : cartItem[] = new Array;
    // items.push(cartItem);
    // this.invoiceService.pushtoHistory(items);
    // this.cartTotal = parseFloat((this.cartTotal - ((cartItem.indiviudalshippingFee + cartItem.individualTax + cartItem.individualPrice) * cartItem.qty)).toFixed(2));
    // this.cartItems.splice(this.cartItems.indexOf(cartItem), 1);
    // this.cartService.setCartTotal(this.cartTotal);
    cartItem.display = false;
    this.paymentmenu = true;
    this.pixelheight = this.items.toArray()[this.cartItems.indexOf(cartItem)].nativeElement.offsetHeight;

  }



  decreaseItemQuantity(item: cartItem){
    if(item.qty > 1){
      let singleItemShippingFee = parseFloat((item.shippingFee/item.qty).toFixed(2));
      let singleItemTax = parseFloat((item.tax/item.qty).toFixed(2));
      let singleItemTotal = parseFloat((item.total/item.qty).toFixed(2));
      item.shippingFee = parseFloat((item.shippingFee - singleItemShippingFee).toFixed(2));
      item.tax = parseFloat((item.tax - singleItemTax).toFixed(2));
      item.total = parseFloat((item.total - singleItemTotal).toFixed(2));
      item.qty = item.qty - 1;
      this.cartTotal = parseFloat((this.cartTotal - singleItemTotal).toFixed(2));
      this.cartService.setCartTotal(this.cartTotal);
    }
    else{
      this.cartTotal = parseFloat((this.cartTotal - item.total).toFixed(2));
      this.cartService.setCartTotal(this.cartTotal);
      this.cartItems.splice(this.cartItems.indexOf(item), 1);
      if(this.cartItems.length == 0){
        this.showlist = false;
      }
    }
  }

  increaseItemQuantity(item: cartItem){
    item.qty = item.qty + 1;
    item.tax = parseFloat((item.tax + item.individualTax).toFixed(2));
    item.shippingFee = parseFloat((item.shippingFee + item.indiviudalshippingFee).toFixed(2));
    item.total = parseFloat((item.total + item.individualPrice + item.individualTax + item.indiviudalshippingFee).toFixed(2));
    this.cartTotal = parseFloat((this.cartTotal + item.individualPrice + item.individualTax + item.indiviudalshippingFee).toFixed(2));
    this.cartService.setCartTotal(this.cartTotal);


  }


  showMore(item: Item){
    this.router.navigate(['/item', item.name], {queryParams: {id: item.id}});
  }



}
