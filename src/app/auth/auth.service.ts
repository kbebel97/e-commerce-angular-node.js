import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthData } from './auth-data.model'


@Injectable({providedIn: 'root'})
export class authService{
  constructor(private http: HttpClient){}

  createUser(email: string, password: string){
    const authData: AuthData = {email: email, password: password};
    this.http.post("http://localhost:3000/api/user/signup", authData)
      .subscribe( response => {
        console.log(response);
      })


  }

  // *Crud Operation Here*

  // login(email : string, password : string){
  //   // Make get request
  //   // returns user if successfully retrieved user email and password or null if unsuccessful.
  //   // 3rd parameter for user is called isAdmin. If true is selected, user is an admin, false if just regular user.
  //   return new User(email, password, false);
  // }

  // register(email : string, password : string){
  //   // Verify email is not used already in database
  //   // If it isnt, Make post request to add new user. return new user if successful.
  //   return new User(email, password, false);


  // }





}
