import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { authService } from './auth/auth.service';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private authService: authService){

  }

  ngOnInit(){
    this.authService.autoAuthUser();
  }
  // option: number;
  // title: string;
  // email : string;
  // password : string;
  // confirmPassword : string;

  // constructor( private router: Router) { }



  // ngOnInit(){
  //   this.option = 1;
  //   this.title = 'Login';
  // }

  // onSuccessfulLogin(){
  //   this.router.navigate(['/menus', this.email], {queryParams: {id: this.email}});
  // }

  // switchOption(i : number){
  //   if(i == 1){
  //     this.option = 1;
  //     this.title = 'Login'
  //   }
  //   else{
  //     this.option = 2;
  //     this.title = 'Register';
  //   }
  // }
  // register(){

  // }

  // login(){
  //   this.email = "hello"
  //   this.onSuccessfulLogin();

  // }

  // clear(){

  // }


}
