import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { authService } from '../auth/auth.service';
import { cartService } from '../cart/cart.service';


@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})

export class MenuComponent implements OnInit {
  userIsAuthenticated : boolean;
  private authListenerSubs: Subscription;
  constructor(private activeRoute: ActivatedRoute, private authService: authService, private cartService: cartService) { }

  ngOnInit(): void {
    this.userIsAuthenticated = this.authService.getIsAuth();
  }

  onLogout(){
    this.userIsAuthenticated = false;
    this.authService.logout();
  }

}
