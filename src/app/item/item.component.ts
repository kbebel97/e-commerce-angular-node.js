import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { cartService } from '../cart/cart.service';
import { catalogService } from '../catalog/catalog.service';
import { Item } from '../shared/Item.model';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css'],

})
export class ItemComponent implements OnInit {
  item: Item;
  numbers: number[];

  constructor(private catalogService: catalogService, private cartService: cartService, private activeRoute: ActivatedRoute, private router: Router) {
    console.log(this.activeRoute.snapshot.queryParams.id);


   }

  ngOnInit(){
    const id = parseInt(this.activeRoute.snapshot.queryParams.id);
    this.numbers = Array(5).map((x,i)=>i);
    console.log(this.numbers);
    console.log(id);
    this.item = this.catalogService.getItem(id);
    console.log(this.item)

    this.activeRoute.queryParams
    .subscribe(
      (params: Params) => {
        console.log(params.id);
        this.item = this.catalogService.getItem(parseInt(params.id));
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
