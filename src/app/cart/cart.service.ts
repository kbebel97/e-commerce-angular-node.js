import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { cartItem } from '../shared/cartItem.model';
import { Item } from '../shared/Item.model';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { invoiceService } from '../invoice/invoice.service';

@Injectable()
export class cartService{
  private cartItems : cartItem[] = [];
  private cartTotal = 0;
  private showList: boolean;

  constructor(private http: HttpClient, private invoiceService: invoiceService){
  }

  private cartUpdated = new Subject<{cartItems : cartItem[], ciCount: number}>();

  updateShowList(showList){
    this.showList = showList;
  }

  setCartTotal(total: number){
    this.cartTotal = total;
  }

  getCartItems(){
    return this.cartItems;
  }

  clearCart(){
    this.cartItems.splice(0, this.cartItems.length);
    this.cartTotal = 0;
  }

  findOne(itemId : number){
    return this.http.get<{ item: any }>(
      "http://localhost:3000/api/cartitems/" + itemId
    )
  }

  savetoCartMongo(item: Item){
    this.http
      .post<{message: string, cartItem : any, count : number}>('http://localhost:3000/api/cartitems', item)
      .subscribe(responseData => {
        if(responseData.cartItem!=null){
          const id = responseData.cartItem._id;
          let cartItem = {
            cartItemId : id,
            qty : responseData.cartItem.qty,
            display : true,
            item: item,
            creator: responseData.cartItem.creator
          }
          this.cartItems.push(cartItem);
          this.cartUpdated.next({ cartItems: [...this.cartItems], ciCount: responseData.count});
        }
      });
  }

  addInvoice(cartItems: cartItem[], totalItems: number){
    this.invoiceService.addInvoice(cartItems, totalItems);
  }

  addSingleItemInvoice(cartItem: cartItem, totalItems: number){
    let cartItems : cartItem[] = [];
    console.log(cartItems);
    cartItems.push(cartItem);
    this.invoiceService.addInvoice(cartItems, 1);
  }

  getCartMongo(itemsPerPage: number, currentPage: number){
    const queryParams = `?pagesize=${itemsPerPage}&page=${currentPage}`;
    this.http
    .get<{message: string, cartitems: any, ciCount: number}>('http://localhost:3000/api/cartitems' + queryParams)
    .pipe(map((cartitemData) => {
      return {cItems: cartitemData.cartitems.map(item => {
        return{
          cartItemId: item._id,
          qty: item.qty,
          display: true,
          item: item.item,
          creator: item.creator
        };
      }), ciCount: cartitemData.ciCount
    }
      ;
    }))
    .subscribe((transformedItems) => {
      console.log(transformedItems);
      this.cartItems = transformedItems.cItems;
      this.cartUpdated.next({cartItems: [...this.cartItems], ciCount: transformedItems.ciCount });
    });
  }

  deleteItem(cartItem: cartItem){
    console.log(cartItem.cartItemId)
    this.http
    .delete<{message: string}>('http://localhost:3000/api/cartitems/' + cartItem.cartItemId).subscribe((result)=>{
      console.log(result);
    });
  }

  deleteAll(){
    this.http
    .delete<{message: string}>('http://localhost:3000/api/cartitems').subscribe((result)=>{
      console.log(result);
    });
  }

  adjustQuantity(cartItem: cartItem){
    this.http
    .put<{message: string}>('http://localhost:3000/api/cartitems', cartItem).subscribe((i)=>{
      console.log(i.message);
    });
  }

  getItemUpdateListener(){
    return this.cartUpdated.asObservable();
  }
}
