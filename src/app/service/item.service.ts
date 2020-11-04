import { EventEmitter, Injectable } from '@angular/core';
import { Item } from '../shared/Item.model';
import { Review } from '../shared/review.model';

@Injectable()
export class itemService{
  goBack = new EventEmitter<string>();
  addtoCart = new EventEmitter<Item>();


}
