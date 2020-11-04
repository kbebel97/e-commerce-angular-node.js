import { EventEmitter } from '@angular/core';
import { Item } from '../shared/Item.model';
import { Review } from '../shared/review.model';


export class cartService{
  purchaseItem = new EventEmitter<Item>();
  addItemHistory = new EventEmitter<Item>();
  purchaseAll = new EventEmitter<Item[]>();
  removeItem = new EventEmitter<Item>();

  private items: Item[] = [


  ];

  addItem(item: Item){
    this.purchaseItem.emit(item);
    const index = this.items.indexOf(item, 0);
    if (index > -1) {
      this.items.splice(index, 1);
    }
  }

  addAll(){
    this.purchaseAll.emit(this.items);
    this.items =[];
  }

  // deleteItem(item: Item){
  //   const index = this.items.indexOf(item, 0);
  //   if (index > -1) {
  //     this.items.splice(index, 1);
  //   }
  // }

  clearItem(){
    this.items = [];
  }


  getItems(){
    return this.items;
  }
}
