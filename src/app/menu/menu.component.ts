import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import {Router} from '@angular/router';


@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
// @NgModule({
//   imports: [
//     CommonModule,
//     RouterModule
//   ],
//   // declarations: [MyTemplatesComponent]
// })
export class MenuComponent implements OnInit {

  constructor(private activeRoute: ActivatedRoute) { }

  ngOnInit(): void {
    const id = parseInt(this.activeRoute.snapshot.queryParams.id);


    this.activeRoute.queryParams
    .subscribe(
      (params: Params) => {
        console.log(params.id);
        // this.item = this.catalogService.getItem(parseInt(params.id));
      }
    );
  }

}
