import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { authService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],

})

export class LoginComponent implements OnInit, OnDestroy{
  isVisible: boolean;
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
  asAdmin: boolean;


  constructor( private authService: authService) { }
  ngOnInit(){
    this.displayMessage = 0;
    this.authListenerSubs = this.authService.getAuthStatusListener().subscribe((result) => {
      if(result == false){
        this.displayMessage = 4;
        this.isVisible = true;
        this.delay(3000).then(any=>{
          this.isVisible = false;
          this.displayMessage = 0;
      })} else{
        this.displayMessage = 0;
      }

    })

    this.authService.getisAdminListener().subscribe(result => {
      if(!result){
        this.isVisible = true;
        this.displayMessage = 8;
        this.delay(3000).then(any=>{
        this.isVisible = false;
        this.displayMessage = 0;
        })
      }
    })

    this.authService.getisAdminRegisteredListener().subscribe(result => {
      if(!result){
        this.isVisible = true;
        this.displayMessage = 9;
        this.delay(3000).then(any=>{
        this.isVisible = false;
        this.displayMessage = 0;
        })
      }
    })

    this.accountCreatedListener = this.authService.getCreatedStatusListener().subscribe((result) => {
      if(!result){
        this.isVisible = true;
        this.displayMessage = 2;
        this.delay(3000).then(any=>{
          this.isVisible = false;
          this.displayMessage = 0;
      })
      }
      else
        this.displayMessage = 1;
    })
  }

  async delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }


  ngOnDestroy(){
    this.authListenerSubs.unsubscribe();;
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

  register() {
    if(this.password && this.confirmPassword && this.email){
      if(this.password == this.confirmPassword && this.password.length >= 8 && this.password.length <= 15 && this.email.length > 3 && this.email.length < 320) {
        this.email = this.email.toLowerCase();
        if(!this.asAdmin)
          this.authService.createUser(this.email, this.password);
        else this.authService.createAdmin(this.email, this.password);
      } else if(this.password != this.confirmPassword && this.password.length > 8 && this.email.length > 3 && this.email.length < 320){
        this.displayMessage = 3;
        this.isVisible = true;
        this.delay(3000).then(any=>{
          this.isVisible = false;
          this.displayMessage = 0;
      })} else if(this.password == this.confirmPassword && this.password.length < 8 && this.email.length > 3 && this.email.length < 320){
        this.displayMessage = 5;
        this.isVisible = true;
        this.delay(3000).then(any=>{
          this.isVisible = false;
          this.displayMessage = 0;
      })} else if(this.password == this.confirmPassword && this.password.length < 8 && this.email.length < 3){
        this.displayMessage = 6;
        this.isVisible = true;
        this.delay(3000).then(any=>{
          this.isVisible = false;
          this.displayMessage = 0;
      })} else if(this.password == this.confirmPassword && this.password.length < 8 && this.email.length > 320){
        this.displayMessage = 7;
        this.isVisible = true;
        this.delay(3000).then(any=>{
          this.isVisible = false;
          this.displayMessage = 0;
      })} else if(this.password != this.confirmPassword){
        this.displayMessage = 3;
        this.isVisible = true;
        this.delay(3000).then(any=>{
          this.isVisible = false;
          this.displayMessage = 0;
      })} else if(this.password.length > 15){
        this.displayMessage = 5;
        this.isVisible = true;
        this.delay(3000).then(any=>{
          this.isVisible = false;
          this.displayMessage = 0;
      })}
    } else {
      this.displayMessage = 1;
      this.isVisible = true;
      this.delay(3000).then(any=>{
        this.isVisible = false;
        this.displayMessage = 0;
    })
    }
  }

  login(){
    if(!this.asAdmin)
      this.authService.login(this.email, this.password);
    else
      this.authService.loginasAdmin(this.email, this.password);
  }

  clear(){
    this.email = '';
    this.password = ''
    this.confirmPassword = '';
  }


}
