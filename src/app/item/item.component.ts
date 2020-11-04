import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { generalService } from '../service/general.service';
import { Item } from '../shared/Item.model';
import { Review } from '../shared/review.model';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css'],

})
export class ItemComponent implements OnInit {
  // @Input() item = new Item(1, 'Carrot','Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32. Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.', 4, 'sony', [new Review('Kacper', 6, 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...'), new Review('Julia', 8, 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...')], 6);
  item: Item;

  constructor(private generalService: generalService, private activeRoute: ActivatedRoute, private router: Router) {
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
    console.log(this.item);

    // console.log(this.item);
    // this.catalogService.inspectMore
    // .subscribe(
    //   (item : Item) => {
    //     this.item = item;
    //   }
    // )
  }
  onaddtoCart(item: Item){
    this.generalService.pushtoCart(item);
  }



  onBackclick(){
    this.router.navigate(['/']);


  }

  // onaddtoCart(item: Item){
  //   this.itemService.addtoCart.emit(item);

  // }

}
