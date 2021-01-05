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

  constructor(private http: HttpClient, private invoiceService: invoiceService){
  }

  private cartUpdated = new Subject<{cartItems : cartItem[], ciCount: number}>();

  pushtoCart(item: Item){
    let check: boolean = false;
    for( let cartItem of this.cartItems){
      if(cartItem.item.id === item.id){
        cartItem.qty++;
        check = true;
        this.cartTotal += cartItem.item.individualPrice + cartItem.item.individualTax + cartItem.item.individualShipping;
      }
    }
    if(check === false){
      // let cI = new cartItem(this.cartItems.length + 1, 1, true, item);
      // this.cartTotal += item.individualPrice + item.individualTax + item.individualShipping;
      // this.cartItems.push(cI);
    }
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

  // deleteItem(item: cartItem){
  //   for( let a of this.cartItems){
  //     if(a.cartId === item.cartId){
  //       this.cartItems.splice(this.cartItems.indexOf(a), 1);
  //       break;
  //     }
  //   }
  // }

  findOne(itemId : number){
    // let item;
    return this.http.get<{ item: any }>(
      "http://localhost:3000/api/cartitems/" + itemId
    )
    // .subscribe(responsedata => {

    // })
    // .subscribe((cartItem) => {
    //   return {
    //     cartId: cartItem._id,
    //     itemId: cartItem.itemId,
    //     qty: cartItem.qty
    //   }
    // })
  }

  savetoCartMongo(item: Item){
    this.http
      .post<{message: string, cartItem : any, count : number}>('http://localhost:3000/api/cartitems', item)
      .subscribe(responseData => {
        if(responseData.cartItem!=null){
          const id = responseData.cartItem._id;
          let cartItem = {
            cartItemId : id,
            itemId : item.id,
            qty : responseData.cartItem.qty,
            display : true,
            item: item
          }
          this.cartItems.push(cartItem);
          this.cartUpdated.next({ cartItems: [...this.cartItems], ciCount: responseData.count});
        }
      });
  }

  addInvoice(cartItems: cartItem[], totalItems: number){
    this.invoiceService.addInvoice(cartItems, totalItems);
  }

  getCartMongo(itemsPerPage: number, currentPage: number){
    const queryParams = `?pagesize=${itemsPerPage}&page=${currentPage}`;
    this.http
    .get<{message: string, cartitems: any, ciCount: number}>('http://localhost:3000/api/cartitems' + queryParams)
    .pipe(map((cartitemData) => {
      return {cItems: cartitemData.cartitems.map(item => {
        return{
          cartItemId: item._id,
          itemId: item.itemId,
          qty: item.qty,
          display: true,
          item: item.item
        };
      }), ciCount: cartitemData.ciCount
    }
      ;
    }))
    .subscribe((transformedItems) => {
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


  adjustQuantity(cartItem: cartItem){
    this.http
    .put<{message: string}>('http://localhost:3000/api/cartitems', cartItem).subscribe((i)=>{
      console.log(i.message);
    });
  }



  getItemUpdateListener(){
    return this.cartUpdated.asObservable();
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
