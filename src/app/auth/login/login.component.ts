import { stringify } from '@angular/compiler/src/util';
import { Component, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { generalService } from 'src/app/service/general.service';
import { User } from '../../shared/user.model';
import { authService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],

})

export class LoginComponent implements OnInit, OnDestroy{
  option = 1;
  title = 'Login';
  email : string;
  password : string;
  confirmPassword : string;
  displayMessage = 0;
  userSub: Subscription;
  userIsAuthenticated: boolean = false;
  authListenerSubs: Subscription;
  accountCreatedListener: Subscription;


  constructor( private router: Router, private generalService : generalService, private authService: authService) { }
  ngOnInit(){
    this.displayMessage = 0;
    this.authListenerSubs = this.authService.getAuthStatusListener().subscribe((result) => {
      if(result == false){
        this.displayMessage = 4;
      }
      else
        this.displayMessage = 0;
    })

    this.accountCreatedListener = this.authService.getCreatedStatusListener().subscribe((result) => {
      if(!result)
        this.displayMessage = 2;
      else
        this.displayMessage = 1;
    })

    // this.authListenerSubs =  this.authService.getAuthStatusListener().subscribe(isAuthenticated => {
    //   console.log(this.userIsAuthenticated);
    //   this.userIsAuthenticated = isAuthenticated;
    //   console.log(this.userIsAuthenticated);
    // });
    // this.option = 1;
    // this.displayMessage = 0;
    // this.title = 'Login';

  }

  ngOnDestroy(){
    this.authListenerSubs.unsubscribe();;
  }

  ngOnChanges(changes: SimpleChanges){
    console.log(changes);

  }


  switchOption(i : number){
    if(i == 1){
      this.option = 1;
      this.title = 'Login'
    }
    else{
      this.option = 2;
      this.title = 'Register';
    }
  }


  // register(){
  //   if(this.password == this.confirmPassword){
  //     let user : User = this.generalService.register(this.email, this.password);
  //     if(user != null){
  //       this.displayMessage = 1;
  //       this.option = 1;
  //     } else{
  //       this.displayMessage = 2;
  //     }
  //   } else {
  //       this.displayMessage = 3;
  //   }
  // }

  register() {
    if(this.password == this.confirmPassword) {
      this.authService.createUser(this.email, this.password);
    } else this.displayMessage = 3;
  }

  login(){
    this.authService.login(this.email, this.password);

    // if(this.authService.getIsAuth() == false){
    //   this.displayMessage = 4;
    // }
    // else {
    //   this.router.navigate(['/menus/catalog']);
    // }
    // if(user != null)
    //   this.router.navigate(['/menus/catalog']);
    // else
    //   this.displayMessage = 4;
    // this.userSub = this.authService.getUserUpdateListener()
    //   .subscribe((user: {user}) => {
            // this.router.navigate(['/menus/catalog'])

        // this.cartItems = cartData.cartItems;
        // this.totalItems = cartData.ciCount;
        // this.isListEmpty();
        // this.getCartTotal();
        // console.log("cart component initialized");
      // })
  }

  clear(){
    this.email = '';
    this.password = ''
    this.confirmPassword = '';
  }


}
