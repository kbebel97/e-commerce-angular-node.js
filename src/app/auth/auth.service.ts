import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { User } from '../shared/user.model';
import { AuthData } from './auth-data.model'



@Injectable({providedIn: 'root'})
export class authService{
  constructor(private http: HttpClient, private router: Router){}

  private userUpdated = new Subject<boolean>();
  private isAuthenticated = false;
  private authStatusListener = new Subject<boolean>();
  private accountCreatedStatusListener = new Subject<boolean>();
  private isAdminListener = new Subject<boolean>();
  private isAdminRegisteredListener = new Subject<boolean>();
  private token : string;
  private tokenTimer: NodeJS.Timer;
  private adminEmails = ['kacperbebel97@gmail.com'];
  // private expiresInDuration: number;

  createUser(email: string, password: string){
    const authData: AuthData = {email: email, password: password};
    this.http.post("http://localhost:3000/api/user/signup", authData)
      .subscribe( response => {
        console.log(response);
        // this.accountCreatedStatusListener.next(true);
        this.http.post<{token: string, fetchedUser: any, expiresIn: number}>("http://localhost:3000/api/user/login", authData)
        .subscribe( response => {
          if(response.fetchedUser){
            const token = response.token;
            this.token = token;
            if(token){
              // Timer that is set beginning at the generation of a new key
              const expiresInDuration = response.expiresIn;
              this.setAuthTimer(expiresInDuration);
              this.isAuthenticated = true;
              const now = new Date();
              // Create expiration date to logout in hour
              const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
              console.log(expirationDate);
              this.saveAuthData(token, expirationDate);
              this.router.navigate(['/menus/catalog']);
            }
          }
        }, error => {
          this.authStatusListener.next(false);
          this.accountCreatedStatusListener.next(false);
        })

      }, error => {
        this.accountCreatedStatusListener.next(false);
      }
      )
  }

  createAdmin(email: string, password: string){
    let adminCreated : boolean = false;
    for(let i = 0; i < this.adminEmails.length; i++ ){
      if(this.adminEmails[i]==email){
        adminCreated = true;
        const authData: AuthData = {email: email, password: password};
        this.http.post("http://localhost:3000/api/user/adminsignup", authData)
          .subscribe( response => {

            // this.accountCreatedStatusListener.next(true);
            this.http.post<{token: string, fetchedUser: any, expiresIn: number}>("http://localhost:3000/api/user/login", authData)
            .subscribe( response => {
              if(response.fetchedUser){
                const token = response.token;
                this.token = token;
                if(token){
                  // Timer that is set beginning at the generation of a new key
                  const expiresInDuration = response.expiresIn;
                  this.setAuthTimer(expiresInDuration);
                  this.isAuthenticated = true;
                  const now = new Date();
                  // Create expiration date to logout in hour
                  const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
                  console.log(expirationDate);
                  this.saveAuthData(token, expirationDate);
                  this.router.navigate(['/admin']);
                }
              }
            }, error => {
              this.authStatusListener.next(false);
              this.accountCreatedStatusListener.next(false);
            })

          }, error => {
            this.accountCreatedStatusListener.next(false);
          }
        );
      }
    }
    if(!adminCreated){
      this.isAdminRegisteredListener.next(false);
    }
  }

  getisAdminListener(){
    return this.isAdminListener.asObservable();
  }

  getisAdminRegisteredListener(){
    return this.isAdminRegisteredListener.asObservable();
  }


  getCreatedStatusListener(){
    return this.accountCreatedStatusListener.asObservable();
  }

  getIsAuth(){
    return this.isAuthenticated;
  }

  getToken() {
    return this.token;
  }

  getAuthStatusListener(){
    return this.authStatusListener.asObservable();
  }

  loginasAdmin(email: string, password: string){
    for(let i = 0; i < this.adminEmails.length; i++){
      if(email == this.adminEmails[i]){
        const authData: AuthData = {email: email, password: password};
        this.http.post<{token: string, fetchedUser: any, expiresIn: number}>("http://localhost:3000/api/user/login", authData)
          .subscribe( response => {
            if(response.fetchedUser){
              const token = response.token;
              this.token = token;
              if(token){
                // Timer that is set beginning at the generation of a new key
                const expiresInDuration = response.expiresIn;
                this.setAuthTimer(expiresInDuration);
                this.isAuthenticated = true;
                const now = new Date();
                // Create expiration date to logout in hour
                const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
                console.log(expirationDate);
                this.saveAuthData(token, expirationDate);
                this.router.navigate(['/admin']);
              }
            }
          }, error => {
            this.authStatusListener.next(false);
          })
          return;
      }
    } this.isAdminListener.next(false);
  }

  login(email: string, password: string) {
    const authData: AuthData = {email: email, password: password};
    this.http.post<{token: string, fetchedUser: any, expiresIn: number}>("http://localhost:3000/api/user/login", authData)
      .subscribe( response => {
        if(response.fetchedUser){
          const token = response.token;
          this.token = token;
          if(token){
            // Timer that is set beginning at the generation of a new key
            const expiresInDuration = response.expiresIn;
            this.setAuthTimer(expiresInDuration);
            this.isAuthenticated = true;
            const now = new Date();
            // Create expiration date to logout in hour
            const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
            console.log(expirationDate);
            this.saveAuthData(token, expirationDate);
            this.router.navigate(['/menus/catalog']);
          }
        }
      }, error => {
        this.authStatusListener.next(false);
      })
  }

  autoAuthUser(){
    const authInformation = this.getAuthData();
    if(!authInformation){
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    console.log(authInformation, expiresIn);
    if( expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  private setAuthTimer(duration: number){
    console.log("Setting timer: " + duration)
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000)
  }

  logout(){
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    // On logout, reset the timer so that you dont use the same timer once you login again
    clearTimeout(this.tokenTimer);
    // clear data in local storage
    this.clearAuthData();
    this.router.navigate(['/login']);
  }

  //save data into local storage so that refreshing a page doesnt sign you out
  private saveAuthData(token: string, expirationDate: Date){
    localStorage.setItem('token', token);
    // Call toISOString to order to serialize and retrieve string
    localStorage.setItem('expiration', expirationDate.toISOString());
  }

  private clearAuthData(){
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
  }

  getUserUpdateListener(){
    console.log(this.userUpdated.asObservable());
    return this.userUpdated.asObservable();
  }

  private getAuthData(){
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expiration");
    if(!token || !expirationDate){
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate)
    }
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
