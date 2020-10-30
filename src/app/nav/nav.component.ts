import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  @Output() featureSelected = new EventEmitter<String>();
  constructor() { }

  ngOnInit(): void {
  }

  changeBody(feature: string){
    this.featureSelected.emit(feature);
  }

}
