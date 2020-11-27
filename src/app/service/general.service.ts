import { Injectable } from '@angular/core';
import { Item} from '../shared/Item.model';
import { Review } from '../shared/review.model';



@Injectable()
export class generalService{

  public cartTotal = 0;
  public cartitems = [];
  private temp = 0;
  public purchaseHistory = [];
  private items: Item[] = [
    new Item(1, 'Carrot','Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32. Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.', 4, 'sony', [new Review('Kacper', 6, 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...'), new Review('Julia', 8, 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...')], 6),
    new Item(2, 'Carrot','its orange', 4, 'sony', [new Review('Kacper', 6, 'great'), new Review('Kacper', 6, 'great'), new Review('Kacper', 6, 'great'), new Review('Kacper', 6, 'great'), new Review('Kacper', 6, 'great'), new Review('Kacper', 6, 'Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.'), new Review('Julia', 8, 'Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.')], 6),
    new Item(3, 'Carrot','its orange', 4, 'sony', [new Review('Kacper', 6, 'great'), new Review('Julia', 8, 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...')], 6),
    new Item(4, 'Carrot','its orange', 4, 'sony', [new Review('Kacper', 6, 'great'), new Review('Julia', 8, 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...')], 6)

  ];



  getItems(){
    return this.items;
  }



  getItem(id: number) {
    const server = this.items.find(
      (s) => {
        return s.id === id;
      }
    );
    return server;
  }


  // pushtoCart(item: Item){
  //   item.total = item.amount * 1.2;
  //   item.total = parseFloat(item.total.toFixed(2));
  //   this.temp = item.total - item.amount;
  //   item.shippingFee = parseFloat( this.temp.toFixed(2));
  //   console.log(item.total);
  //   this.cartTotal += parseFloat(item.total.toFixed(2));
  //   this.cartitems.push(item);

  // }

  pushtoPurchases(item: Item){
    this.purchaseHistory.push(item);
  }

  getcartItems(){
    return this.cartitems;
  }


}
