import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Item } from '../shared/Item.model';
import { catalogService } from './catalog.service';
import { User } from '../shared/user.model';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';


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
  currentPage = 1;
  constructor( private catalogService: catalogService, private router: Router) { }

  ngOnInit(){
    this.isLoading = true;
    this.catalogService.getCatalogMongo(this.itemsPerPage, 1);
    this.itemsSub = this.catalogService.getItemUpdateListener()
      .subscribe((itemData: {items: Item[], itemCount: number}) => {
        this.isLoading = false;
        this.catalogItems = itemData.items;
        this.totalItems = itemData.itemCount;
      })
  }

  onChangedPage(pageData: PageEvent){
    console.log(pageData);
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.catalogService.getCatalogMongo(this.itemsPerPage, this.currentPage);
  }

  onSelected(item: Item){
    this.catalogService.savetoCartMongo(item);
  }

  onShowMore(item: Item){
    this.router.navigate(['/menus/item']);
  }

  onDelete(itemId: string){
    this.isLoading = true;
    this.catalogService.deleteItemMongo(itemId).subscribe(() => {
      this.catalogService.getCatalogMongo(this.itemsPerPage, this.currentPage);
    })
  }
}

