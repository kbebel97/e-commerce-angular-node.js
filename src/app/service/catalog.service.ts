import { EventEmitter } from '@angular/core';
import { Item } from '../shared/Item.model';


export class catalogService{
  itemChange = new EventEmitter<Item[]>();

  private items: Item[] = [
    new Item('Carrot','its orange', 4),
    new Item('PS5', 'great console', 500),
    new Item('PS5', 'great console', 500),
    new Item('PS5', 'great console', 500)


  ];

   addItem(item: Item){
    this.items.push(item);
    this.itemChange.emit(this.items.slice());
  }

  getItems(){
    return this.items.slice();
  }
}
