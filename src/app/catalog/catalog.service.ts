import { Injectable } from '@angular/core';
import { Item } from '../shared/Item.model';
import { Review } from '../shared/review.model';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { cartService } from '../cart/cart.service';
@Injectable()
export class catalogService{
  private items: Item[];
  private rootURL = 'http://localhost:3080/api/products';

  private itemsUpdated = new Subject<{items: Item[], itemCount: number}>();

  constructor(private http: HttpClient, private cartService: cartService){

  }

  getItems(){
    return this.items.slice();
  }

  getItem(numb: number){
    for(let item of this.items){
      if(item.id === numb){
        return item;
      }
    }

  }

  //Crud Operations

  getCatalog(): Observable<any>{
    //Get entire catalog to display
    //for each item in catalog, use item ID to find all reviews attached to item.
    //Build each typescript item and place it in the typescript items[] array property attached to this component.
    return this.http.get(this.rootURL);
  }

  getCatalogMongo(itemsPerPage: number, currentPage: number){
    const queryParams = `?pagesize=${itemsPerPage}&page=${currentPage}`;
    this.http
    .get<{message: string, items: any, maxItems: number}>('http://localhost:3000/api/items' + queryParams)
    .pipe(map((itemData) => {
      return { items: itemData.items.map(item => {
        return{
          id: item._id,
          name: item.name,
          description: item.description,
          individualPrice: item.individualPrice,
          individualTax: item.individualTax,
          individualShipping : item.individualShipping,
          manufacturer: item.manufacturer,
          reviews: item.reviews,
          rating: item.rating
        };
      }), maxItems: itemData.maxItems};
    }))
    .subscribe((transformedItemData) => {
      console.log(transformedItemData)
      this.items = transformedItemData.items;
      this.itemsUpdated.next({
        items: [...this.items],
        itemCount: transformedItemData.maxItems
      });
    });
  }

  getItemUpdateListener(){
    return this.itemsUpdated.asObservable();
  }

  savetoCartMongo(item: Item){
    this.cartService.savetoCartMongo(item);
  }

  deleteItemMongo(itemId: string){
    return this.http
      .delete("http://localhost:3000/api/items/" + itemId);
  }


}
