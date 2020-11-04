import { Component, Input, OnInit } from '@angular/core';
import { purchasesService } from '../service/purchases.service';
import { Item } from '../shared/Item.model';

@Component({
  selector: 'app-purchases',
  templateUrl: './purchases.component.html',
  styleUrls: ['./purchases.component.css'],
  providers: [purchasesService]
})
export class PurchasesComponent implements OnInit {
  @Input() purchasedItems = [];
  constructor(private service: purchasesService) { }

  ngOnInit(){
    console.log(this.purchasedItems);
    // this.purchasedItems = this.service.getItems();
    for (var item of this.purchasedItems) {
    }
    // this.service.itemChange
    //   .subscribe(
    //     (items : Item[]) => {
    //       this.cartItems = items;
    //     }
    //   )
  }

  returnItem(item: Item){
    const index = this.purchasedItems.indexOf(item, 0);
    if (index > -1) {
      this.purchasedItems.splice(index, 1);
    }
  }
}
