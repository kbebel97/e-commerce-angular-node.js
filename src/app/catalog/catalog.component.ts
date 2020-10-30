import { Component, OnInit } from '@angular/core';
import { catalogService } from '../service/catalog.service';
import { Item } from '../shared/Item.model';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.css'],
  providers: [catalogService]
})
export class CatalogComponent implements OnInit {
  catalogItems = [];
  constructor(private service: catalogService) { }

  ngOnInit(){
    this.catalogItems = this.service.getItems();
    this.service.itemChange
      .subscribe(
        (items : Item[]) => {
          this.catalogItems = items;
        }
      )
  }
}
