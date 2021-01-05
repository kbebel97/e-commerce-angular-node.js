import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { cartService } from '../cart/cart.service';
import { Item } from '../shared/Item.model';
import { catalogService } from './catalog.service';
import { User } from '../shared/user.model';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator'


@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.css']
})
export class CatalogComponent implements OnInit {
  catalogItems : Item[] = [];
  itemsSub: Subscription;
  isLoading = false;
  showCatalog: boolean;
  userLoggedIn: User;
  totalItems = 150;
  itemsPerPage = 20;
  currentPage =1;
  constructor(
    private catalogService: catalogService,
    private cartService: cartService,
    private router: Router,
    private activeRoute: ActivatedRoute) { }

  ngOnInit(){
    // this.catalogService.getCatalog().subscribe(catalog => {
    //   this.catalogItems = catalog;
    // });
    this.isLoading = true;
    this.catalogService.getCatalogMongo(this.itemsPerPage, 1);
    this.itemsSub = this.catalogService.getItemUpdateListener()
      .subscribe((itemData: {items: Item[], itemCount: number}) => {
        this.isLoading = false;
        this.catalogItems = itemData.items;
        this.totalItems = itemData.itemCount;
      })
    // this.catalogService.getCatalog().subscribe(catalog => {
    //   this.catalogItems = catalog;
    // });
    // this.catalogItems = this.catalogService.getItems();
    const id = parseInt(this.activeRoute.snapshot.queryParams.id);


    this.activeRoute.queryParams
    .subscribe(
      (params: Params) => {
        // console.log(params.id);
        // this.item = this.catalogService.getItem(parseInt(params.id));
      }
    );
  }

  onChangedPage(pageData: PageEvent){
    console.log(pageData);
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.catalogService.getCatalogMongo(this.itemsPerPage, this.currentPage);

  }

  onSelected(item: Item){
    // this.cartService.pushtoCart(item);
    this.catalogService.savetoCartMongo(item);
  }

  onShowMore(item: Item){
    this.router.navigate(['/item', item.name], {queryParams: {id: item.id}});
  }

  onDelete(itemId: string){
    this.isLoading = true;
    this.catalogService.deleteItemMongo(itemId).subscribe(() => {
      this.catalogService.getCatalogMongo(this.itemsPerPage, this.currentPage);
      // const updatedItems = this.items.filter(item => item.id !== itemId);
      // this.items = updatedItems;
      // this.itemsUpdated.next([...this.items]);
    })
  }




}

