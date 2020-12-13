import { EventEmitter, Injectable } from '@angular/core';
import { Item } from '../shared/Item.model';
import { Review } from '../shared/review.model';

@Injectable()
export class catalogService{
  //Dummy Date
   a = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.";
  private items: Item[] = [
    new Item(2, 'help','its orange', 4, 1, .50, 'sony',
      [new Review('Kacper', 6, 'great'),
      new Review('Kacper', 6, 'great'),
      new Review('Kacper', 6, 'great'),
      new Review('Kacper', 6, 'great'),
      new Review('Kacper', 6, this.a),
      new Review('Samslem', 6, this.a),
      new Review('Kacper', 6, this.a),
      new Review('Kacper', 6, this.a),
      new Review('Kacper', 6, this.a)],6),

    new Item(3, 'Carrot', this.a , 10000, 2000, 900,'sony',
      [new Review('Kacper', 6, 'great. I can believe how good it was'),
      new Review('Julia', 8, 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...')], 6),

    new Item(4, 'Carrot','its orange, its delicious. Bugs bunny recommends it', 54, 8, 3,'sony',
      [new Review('Kacper', 6, 'great. I can believe how good it was'),
      new Review('Julia', 8, 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...')], 6),

    new Item(5, 'Carrot','its orange, its delicious. Bugs bunny recommends it', 87, 7.99, 2.35,'sony',
      [new Review('Kacper', 6, 'great. I can believe how good it was'),
      new Review('Julia', 8, 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...')], 6),

    new Item(6, 'Carrot','its orange, its delicious. Bugs bunny recommends it', 92.99,6.85, 3.25 ,'sony',
      [new Review('Kacper', 6, 'great. I can believe how good it was'),
      new Review('Julia', 8, 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...')], 6),

    new Item(7, 'Carrot','its orange, its delicious. Bugs bunny recommends it', 92.99,6.85, 3.25,'sony',
      [new Review('Kacper', 6, 'great. I can believe how good it was'),
      new Review('Julia', 8, 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...')], 6)
  ];

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

  getCatalog(){
    //Get entire catalog to display
    //for each item in catalog, use item ID to find all reviews attached to item.
    //Build each typescript item and place it in the typescript items[] array property attached to this component.
  }


}
