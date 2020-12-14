import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { cartService } from '../cart/cart.service';
import { catalogService } from '../catalog/catalog.service';
import { Item } from '../shared/Item.model';
import { itemService } from './item.service';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css'],

})
export class ItemComponent implements OnInit {
  item: any;
  numbers: number[];

  constructor(
    private catalogService: catalogService, 
    private cartService: cartService, 
    private itemService: itemService,
    private activeRoute: ActivatedRoute, 
    private router: Router) {
    console.log(this.activeRoute.snapshot.queryParams.id);


   }

  ngOnInit(){
    const id = parseInt(this.activeRoute.snapshot.queryParams.id);
    this.numbers = Array(5).map((x,i)=>i);
    console.log(id);
    this.item = this.itemService.getItem(id).subscribe();
    console.log(this.item)

    this.activeRoute.queryParams
    .subscribe(
      (params: Params) => {
        console.log(params.id);
        // this.item = this.catalogService.getItem(parseInt(params.id));
        this.item = this.itemService.getItem(parseInt(params.id)).subscribe();
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
