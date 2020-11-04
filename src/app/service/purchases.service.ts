import { EventEmitter } from '@angular/core';
import { Item } from '../shared/Item.model';


export class purchasesService{
  returnItem = new EventEmitter<Item>();

  private items: Item[] = [
    // new Item('Carrot','its orange', 4),
    // new Item('PS5', 'great console', 500),
    // new Item('PS5', 'great console', 500),
    // new Item('PS5', 'great console', 500)
  ];

  addItem(item: Item){
    this.returnItem.emit(item);
    const index = this.items.indexOf(item, 0);
    if (index > -1) {
      this.items.splice(index, 1);
    }
  }

  return(item: Item){
    const index = this.items.indexOf(item, 0);
    if (index > -1) {
      this.items.splice(index, 1);
    }
  }

  getItems(){
    return this.items;
  }

}
