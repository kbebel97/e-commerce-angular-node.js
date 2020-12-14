import { Injectable } from '@angular/core';
import { cartService } from '../cart/cart.service';
import { catalogService } from '../catalog/catalog.service';
import { invoiceService } from '../invoice/invoice.service';
import { User } from '../shared/user.model';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable()
export class generalService{

userLoggedin : User;
private rootURL = '/api/users';
httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

userObservable : Observable<any>;

constructor(
  private cartService : cartService, 
  private catalogService : catalogService, 
  private invoiceService : invoiceService,
  private http: HttpClient){

}

setUser(user : User){
  this.userLoggedin = user;
}

getUser(): Observable<any>{
  // return this.userLoggedin;
  return this.userObservable;
}

login(email : string, password : string) {
  // Make get request
  // returns user if successfully retrieved user email and password or null if unsuccessful.
  // 3rd parameter for user is called isAdmin. If true is selected, user is an admin, false if just regular user.

  let params = {
    "email": email,
    "password": password
  }

  this.userObservable = this.http.post(this.rootURL + '/login', params, this.httpOptions);
  console.log(this.userObservable);

  // return this.userObservable;

  // return new User(email, password, false);
}

register(email : string, password : string){
  // Verify email is not used already in database
  // If it isnt, Make post request to add new user. return new user if successful, else return null value.
  return new User(email, password, false);
}

observableToObject() {
  this.userObservable.subscribe(user => {
    this.userLoggedin = user;
  })
}

}
