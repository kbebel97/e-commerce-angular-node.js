import { Injectable } from '@angular/core';
import { Item } from '../shared/Item.model';
import { HttpClient } from '@angular/common/http';
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
          rating: item.rating,
          imagePaths: item.imagePaths
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

  saveCatalogItem(item: Item){
    this.http
      .post<{message: string, item: any}>('http://localhost:3000/api/items', item).subscribe((response)=> {
        // let transformedItem: Item = {
        //   id: response.item._id,
        //   name: response.item.name,
        //   description: response.item.description,
        //   individualPrice: response.item.individualPrice,
        //   individualTax: response.item.individualTax,
        //   individualShipping: response.item.individualShipping,
        //   manufacturer: response.item.manufacturer,
        //   rating: response.item.rating,
        //   imagePaths: response.item.imagePaths
        // }
        // return transformedItem;
        // console.log(response.message);
      });
  }

  getItemUpdateListener(){
    return this.itemsUpdated.asObservable();
  }

  savetoCartMongo(item: Item){
    this.cartService.savetoCartMongo(item);
  }

  deleteItemMongo(itemId: string){
    console.log(itemId);
    this.http
      .delete("http://localhost:3000/api/items/" + itemId).subscribe((result)=> {
        console.log(result);
      });
  }


}
