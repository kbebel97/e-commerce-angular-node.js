import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { cartService } from '../cart/cart.service';
import { generalService } from '../service/general.service';
import { Item } from '../shared/Item.model';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css'],

})
export class ItemComponent implements OnInit {
  item: Item;

  constructor(private generalService: generalService, private cartService: cartService, private activeRoute: ActivatedRoute, private router: Router) {
    console.log(this.activeRoute.snapshot.queryParams.id);


   }

  ngOnInit(){
    const id = parseInt(this.activeRoute.snapshot.queryParams.id);
    console.log(id);
    this.item = this.generalService.getItem(id);
    console.log(this.item)

    this.activeRoute.queryParams
    .subscribe(
      (params: Params) => {
        console.log(params.id);
        this.item = this.generalService.getItem(parseInt(params.id));
      }
    );

  }

  onaddtoCart(item: Item){
    this.cartService.pushtoCart(item);
  }

  onBackclick(){
    this.router.navigate(['/']);
  }

}
