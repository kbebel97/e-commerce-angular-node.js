import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { generalService } from '../service/general.service';
import { Item } from '../shared/Item.model';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.css']
})
export class CatalogComponent implements OnInit {
  @Input() catalogItems = [];
  showCatalog: boolean;

  constructor(private service: generalService, private router: Router) { }

  ngOnInit(){
    this.catalogItems = this.service.getItems();
    // this.service.itemChange
    //   .subscribe(
    //     (items : Item[]) => {
    //       this.catalogItems = items;
    //     }
    //   )
  }

  onSelected(item: Item){
    // this.service.addtoCart.emit(item);
    // this.service.addtoCart.emit(item);
    this.service.pushtoCart(item);

  }

  onShowMore(item: Item){
    // this.service.inspectMore.emit(item);
    this.router.navigate(['/item', item.name], {queryParams: {id: item.id}});



  }


}
