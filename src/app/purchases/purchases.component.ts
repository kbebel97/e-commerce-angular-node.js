import { Component, Input, OnInit } from '@angular/core';
import { generalService } from '../service/general.service';
import { purchasesService } from './purchases.service';
import { Item } from '../shared/Item.model';

@Component({
  selector: 'app-purchases',
  templateUrl: './purchases.component.html',
  styleUrls: ['./purchases.component.css']
})
export class PurchasesComponent implements OnInit {
  @Input() purchasedItems = [];
  showPurchases: boolean;
  constructor(private generalService: generalService, private purchasesService: purchasesService) { }

  ngOnInit(){
    this.purchasedItems = this.purchasesService.getPurchaseHistory();
    // this.showPurchases = false;
    if(this.purchasedItems.length == 0){
      this.showPurchases = false;
    }
    else this.showPurchases = true;
  }

  returnItem(item: Item){
    const index = this.purchasedItems.indexOf(item, 0);
    if (index > -1) {
      this.purchasedItems.splice(index, 1);
    }
  }
}
