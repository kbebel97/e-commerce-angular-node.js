import { Injectable } from '@angular/core';
import { cartService } from '../cart/cart.service';
import { catalogService } from '../catalog/catalog.service';
import { invoiceService } from '../invoice/invoice.service';
import { User } from '../shared/user.model';


@Injectable()
export class generalService{

userLoggedin : User;

constructor(private cartService : cartService, private catalogService : catalogService, private invoiceService : invoiceService){

}

setUser(user : User){
  this.userLoggedin = user;
}

getUser(){
  return this.userLoggedin;
}

login(email : string, password : string){
  // Make get request
  // returns user if successfully retrieved user email and password or null if unsuccessful.
  // 3rd parameter for user is called isAdmin. If true is selected, user is an admin, false if just regular user.
  return new User(email, password, false);
}

register(email : string, password : string){
  // Verify email is not used already in database
  // If it isnt, Make post request to add new user. return new user if successful, else return null value.
  return new User(email, password, false);
}

}
