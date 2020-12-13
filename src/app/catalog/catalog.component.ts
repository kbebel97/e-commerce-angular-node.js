import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { cartService } from '../cart/cart.service';
import { Item } from '../shared/Item.model';
import { catalogService } from './catalog.service';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.css']
})
export class CatalogComponent implements OnInit {
  @Input() catalogItems : Item[] = [];
  showCatalog: boolean;

  constructor(private catalogService: catalogService, private cartService: cartService, private router: Router, private activeRoute: ActivatedRoute) { }

  ngOnInit(){
    // this.catalogItems = this.catalogService.getCatalog();
    this.catalogItems = this.catalogService.getItems();
    const id = parseInt(this.activeRoute.snapshot.queryParams.id);


    this.activeRoute.queryParams
    .subscribe(
      (params: Params) => {
        // console.log(params.id);
        // this.item = this.catalogService.getItem(parseInt(params.id));
      }
    );
  }

  onSelected(item: Item){
    this.cartService.pushtoCart(item);
  }

  onShowMore(item: Item){
    this.router.navigate(['/item', item.name], {queryParams: {id: item.id}});
  }


}
