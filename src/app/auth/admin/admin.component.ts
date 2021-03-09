import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { catalogService } from 'src/app/catalog/catalog.service';
import { Item } from 'src/app/shared/Item.model';
import { User } from 'src/app/shared/user.model';
import { authService } from '../auth.service';
import { adminService } from './admin.service';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  constructor(private authService: authService, private router: Router, private catalogService: catalogService, private adminService: adminService) { }

  itemForm: FormGroup;
  imagePath: string;
  imagePaths : string[] = [];

  user: User;
  menu: number = 1;
  itemsPerPage : number = 20;
  usersPerPage : number = 20;
  itemsSub: Subscription;
  usersSub: Subscription;

  areUsersLoaded: Boolean;
  isCatalogLoaded: Boolean;

  users: User[] = [];
  catalogItems : Item[] = [];

  totalItems : number = 0;
  totalUsers : number = 0;

  currentItemsPage = 1;
  currentUsersPage = 1;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit(): void {

    this.areUsersLoaded = false;
    this.isCatalogLoaded = false;

    this.adminService.getUsers(this.usersPerPage, 1);
    this.catalogService.getCatalogMongo(this.itemsPerPage, 1);

    this.usersSub = this.adminService.getUsersListener().subscribe(( fetchedUsers: { message: string, userCount: number, users: any})=> {
      this.areUsersLoaded = true;
      this.totalUsers = fetchedUsers.userCount;
      this.users = fetchedUsers.users;
    });

    this.itemsSub = this.catalogService.getItemUpdateListener()
    .subscribe((itemData: {items: Item[], itemCount: number}) => {
      this.isCatalogLoaded = true;
      this.catalogItems = itemData.items;
      this.totalItems = itemData.itemCount;
    })

    this.itemForm = new FormGroup({
      name : new FormControl(null, {validators: [Validators.required, Validators.minLength(1)]}),
      description : new FormControl(null, {validators: [Validators.required]}),
      price : new FormControl(null, {validators: [Validators.required]}),
      tax : new FormControl(null, {validators: [Validators.required]}),
      shipping : new FormControl(null, {validators: [Validators.required]}),
      manufacturer : new FormControl(null, {validators: [Validators.required]})
    });
  }

  onChangedItemsPage(pageData: PageEvent){
    this.currentItemsPage = pageData.pageIndex + 1;
    this.catalogService.getCatalogMongo(this.itemsPerPage, this.currentItemsPage);
  }

  onChangedUsersPage(pageData: PageEvent){
    this.currentUsersPage = pageData.pageIndex + 1;
    this.adminService.getUsers(this.usersPerPage, this.currentUsersPage);
  }

  onLogout(){
    this.authService.logout();
  }
  changeMenu(i : number){
    this.menu = i;
    this.clear();
  }

  clear(){
    this.imagePaths = [];
    this.itemForm.setValue({
      'name' : null,
      'price' : null,
      'tax' : null,
      'shipping' : null,
      'description' : null,
      'manufacturer' : null
    })
  }

  onSwitchToUser(){
    this.router.navigate(['/menus/catalog']);
  }

  addItem(){
    let item : Item = {
      id: null,
      name: this.itemForm.value.name,
      description: this.itemForm.value.description,
      individualPrice: this.itemForm.value.price,
      individualTax: this.itemForm.value.tax,
      individualShipping: this.itemForm.value.shipping,
      manufacturer: this.itemForm.value.manufacturer,
      rating: 0,
      imagePaths: this.imagePaths
    }
    this.catalogService.saveCatalogItem(item);
    this.catalogService.getCatalogMongo(this.itemsPerPage, this.currentItemsPage);
  }

  addImagePath(){
    this.imagePaths.push(this.imagePath);
    this.imagePath = null;
  }

  deleteUser(user: User){
    this.users.splice(this.users.indexOf(user), 1);
    this.adminService.deleteUser(user);
    this.totalUsers--;
  }

  deleteItem(item: Item){
    this.catalogItems.splice(this.catalogItems.indexOf(item), 1);
    this.catalogService.deleteItemMongo(item.id);
    this.totalItems--;
  }
}


