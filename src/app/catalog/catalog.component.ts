import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { cartService } from '../cart/cart.service';
import { Item } from '../shared/Item.model';
import { catalogService } from './catalog.service';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.css']
})
export class CatalogComponent implements OnInit {
  @Input() catalogItems = [];
  showCatalog: boolean;

  constructor(private catalogService: catalogService, private cartService: cartService, private router: Router) { }

  ngOnInit(){
    this.catalogItems = this.catalogService.getItems();
  }

  onSelected(item: Item){
    this.cartService.pushtoCart(item);
  }

  onShowMore(item: Item){
    this.router.navigate(['/item', item.name], {queryParams: {id: item.id}});
  }


}
