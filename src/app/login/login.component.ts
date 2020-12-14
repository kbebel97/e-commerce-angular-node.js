import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { generalService } from '../service/general.service';
import { User } from '../shared/user.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],

})

export class LoginComponent implements OnInit{
  option: number;
  title: string;
  email : string;
  password : string;
  confirmPassword : string;
  displayMessage : number;

  constructor( private router: Router, private generalService : generalService) { }
  ngOnInit(){
    this.option = 1;
    this.displayMessage = 0;
    this.title = 'Login';
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
      this.generalService.register(this.email, this.password);
    }
  }

  login(){
    let user = this.generalService.login(this.email, this.password);
    if(user !=null)
      this.router.navigate(['/menus/catalog']);
    else
      this.displayMessage = 4;
  }

  clear(){
    this.email = '';
    this.password = ''
    this.confirmPassword = '';
  }


}
