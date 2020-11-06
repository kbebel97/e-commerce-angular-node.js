import { cartItem } from '../shared/cartItem.model';
import { Item } from '../shared/Item.model';
import { purchasedItem } from '../shared/purchasedItem.model';


export class purchasesService{
  private purchaseHistory = [];

  pushtoHistory(item: cartItem){
    let purchase = new purchasedItem(item.id, item.name, item.description, item.amount, item.manuFacturer, new Date());
    console.log(purchase);
    this.purchaseHistory.push(item);

  }

  getPurchaseHistory(){
    return this.purchaseHistory;
  }




}
