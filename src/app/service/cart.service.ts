import { EventEmitter } from '@angular/core';
import { Item } from '../shared/Item.model';


export class cartService{
  purchaseItem = new EventEmitter<Item>();
  purchaseAll = new EventEmitter<Item[]>();

  private items: Item[] = [
    new Item('Carrot','its orange', 4),
    new Item('PS5', 'great console', 500),
    new Item('PS5', 'great console', 500),
    new Item('PS5', 'great console', 500)
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
