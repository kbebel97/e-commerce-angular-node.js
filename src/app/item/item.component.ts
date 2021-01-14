import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { cartService } from '../cart/cart.service';
import { catalogService } from '../catalog/catalog.service';
import { Item } from '../shared/Item.model';
import {Location} from '@angular/common';
import { itemService } from './item.service';
import { Subscription } from 'rxjs';
import { authService } from '../auth/auth.service';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css'],

})
export class ItemComponent implements OnInit {
  item: any;
  numbers: number[];  userIsAuthenticated : boolean;
  private authListenerSubs: Subscription;

  constructor(
    private catalogService: catalogService,
    private cartService: cartService,
    private itemService: itemService,
    private activeRoute: ActivatedRoute,
    private router: Router,
    private _location: Location,
    private authService: authService) {
    // console.log(this.activeRoute.snapshot.queryParams.id);


   }

  ngOnInit(){
    const id = parseInt(this.activeRoute.snapshot.queryParams.id);
    this.numbers = Array(5).map((x,i)=>i);
    console.log(id);
    this.itemService.getItem(id).subscribe(data => {
      console.log(data);
      this.item = data;
      }
    )
    console.log(this.item)

    this.itemService.getReviews(id).subscribe(data => {
      console.log(data);
      this.item.reviews = data;
    })

    this.activeRoute.queryParams
    .subscribe(
      (params: Params) => {
        console.log(params.id);
        // this.item = this.catalogService.getItem(parseInt(params.id));
        this.item = this.itemService.getItem(parseInt(params.id)).subscribe();
      }
    );

    this.authListenerSubs =  this.authService.getAuthStatusListener().subscribe(isAuthenticated => {
      console.log(isAuthenticated);
      this.userIsAuthenticated = isAuthenticated;
    });

  }

  onaddtoCart(item: Item){
    // this.cartService.pushtoCart(item);
  }

  onBackclick(){
    // this.router.navigate(['/menus/catalog']);
    this._location.back();

  }

}
