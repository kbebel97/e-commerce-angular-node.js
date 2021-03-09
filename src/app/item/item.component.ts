import { Component, ElementRef, OnInit, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Item } from '../shared/Item.model';
import { Location } from '@angular/common';
import { itemService } from './item.service';
import { Subscription } from 'rxjs';
import { authService } from '../auth/auth.service';
import { Review } from '../shared/review.model';
import { User } from '../shared/user.model';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})

export class ItemComponent implements OnInit {

  item: Item = {
    id: null,
    name: null,
    description: null,
    individualPrice: null,
    individualTax: null,
    individualShipping : null,
    manufacturer: null,
    rating: null,
    imagePaths: []
  };

  review : Review = {
    reviewId: null,
    itemId: null,
    creator: null,
    email: null,
    userName: null,
    rating: null,
    comment: null
  }

  user: User = {
    Id: null,
    email: null,
    password: null,
    userName: null,
    firstName: null,
    lastName: null,
    paymentMethods: [],
    shippingAddresses: [],
    imagePath: null,
    isAdmin: false
  }

  @ViewChild('headerheight') headerheight: ElementRef;
  @ViewChildren('stars') stars: QueryList<ElementRef>;

  displayMessage: number;
  isVisible: boolean = false;
  reviews : Review[] = [];

  myRating: number;
  myComment : string;

  numbers: number[];
  userIsAuthenticated : boolean;
  reviewsEmpty :  boolean = true;
  itemId : string;

  //post/edit button text
  buttontext : string;

  //Subscriptions
  private reviewsFetchedListenerSubs: Subscription;
  private reviewAddedListenerSubs: Subscription;
  private reviewUpdatedListenerSubs: Subscription;
  private itemFetchedListenerSubs : Subscription;
  private userFetchedListenerSubs : Subscription;
  private reviewFetchedListenerSubs: Subscription;
  private authListenerSubs: Subscription;

  constructor(
    private itemService: itemService,
    private activeRoute: ActivatedRoute,
    private _location: Location,
    private authService: authService,
    private renderer: Renderer2) {
  }

  ngOnInit(){
    this.activeRoute.queryParams.subscribe(
      (params: Params) => {
        this.itemId = params['itemId'];
        this.itemService.getReviews(this.itemId);
        this.itemService.getItem(this.itemId);
        this.itemService.getUser();
        this.itemService.findReview(this.itemId);
      }
    )

    this.itemFetchedListenerSubs = this.itemService.getItemFetchedListener().subscribe((isItemFetched : {message: string, item: Item}) => {
      if(isItemFetched.item){
        console.log(isItemFetched.message);
        this.item = isItemFetched.item;
      } else {
        console.log(isItemFetched.message);
      }
    })

    this.reviewFetchedListenerSubs = this.itemService.getReviewFetchedListener().subscribe((reviewFetched : {message: string, review : Review})=> {
      if(reviewFetched.review){

        console.log(reviewFetched.message);
        console.log(reviewFetched.review);
        this.review = reviewFetched.review;
        this.myComment = this.review.comment;
        this.myRating = this.review.rating;
        for(let i = 0; i < this.myRating; i++){
          this.renderer.setStyle(this.stars.toArray()[i].nativeElement, 'color', 'white');
        }
        this.buttontext = 'edit';
      } else {
        console.log(reviewFetched.message);
        this.buttontext = 'post';
      }
    })

    this.userFetchedListenerSubs =this.itemService.getUserFetchedListener().subscribe((userFetched: {message: string, user: User}) => {
      if(userFetched.user){
        console.log(userFetched.message);
        this.user = userFetched.user;
      } else {
        console.log(userFetched.message);
      }
    })

    this.reviewsFetchedListenerSubs = this.itemService.getReviewsFetchedListnener().subscribe((reviewsFetched: { message: string, reviews: Review[]}) => {
      if(reviewsFetched.reviews.length != 0){
        this.reviewsEmpty = false;
        this.reviews = reviewsFetched.reviews;
      } else {
        console.log(reviewsFetched.message);
        this.reviewsEmpty = true;
      }
    })

    this.reviewAddedListenerSubs = this.itemService.getReviewAddedListener().subscribe((isAdded: { message: string, isAdded: boolean, review: Review}) => {
      if(isAdded.isAdded){
        console.log(isAdded.message);
        this.review = isAdded.review;
        this.reviewsEmpty = false;
        this.displayMessage = 1;
        this.isVisible = true;
        this.buttontext = 'edit';
        this.delay(3000).then(any=>{
          this.isVisible = false;
          this.displayMessage = 0;;
     });
      } else {
        console.log(isAdded.message);
        this.displayMessage = 3;
        this.isVisible = true;
        this.delay(3000).then(any=>{
          this.isVisible = false;
          this.displayMessage = 0;;
     });
      }
    })

    this.reviewUpdatedListenerSubs = this.itemService.getReviewUpdatedListener().subscribe((isUpdated: {message: string, isUpdated: boolean}) => {
      if(isUpdated.isUpdated){
        console.log(isUpdated.message);
        this.displayMessage = 2;
        this.isVisible = true;
        this.delay(3000).then(any=>{
          this.isVisible = false;
          this.displayMessage = 0;;
     });
      } else {
        console.log(isUpdated.message);
        this.displayMessage = 4;
        this.isVisible = true;
        this.delay(3000).then(any=>{
          this.isVisible = false;
          this.displayMessage = 0;;
     });
      }
    })

    this.authListenerSubs =  this.authService.getAuthStatusListener().subscribe(isAuthenticated => {
      console.log(isAuthenticated);
      this.userIsAuthenticated = isAuthenticated;
    });
  }

  onRating(x : number){
    if(x == this.myRating - 1){
      for(let i = 0; i < 5; i++)
        this.renderer.setStyle(this.stars.toArray()[i].nativeElement, 'color', 'gray');
      this.myRating = null;
    } else {
      for(let i = 0; i < 5; i++){
        this.renderer.setStyle(this.stars.toArray()[i].nativeElement, 'color', 'gray');
      }
      for(let i = 0; i <= x; i++){
        this.renderer.setStyle(this.stars.toArray()[i].nativeElement, 'color', '#FFFFFF')
      }
      this.myRating = x + 1;
    }
  }

  onPost(){
    if(this.myRating && this.review.reviewId==''){
      let review : Review = {
        creator: this.user.Id,
        itemId: this.item.id,
        reviewId: null,
        email : this.user.email,
        userName : this.user.userName,
        rating : this.myRating,
        comment : this.myComment
      }
      this.itemService.postReview(review);
    } else if(this.myRating && this.review.reviewId!=''){
      this.review.comment = this.myComment;
      this.review.rating = this.myRating;
      this.itemService.editReview(this.review);
      for(let i = 0; i < this.reviews.length; i++){
        if(this.reviews[i].reviewId == this.review.reviewId){
          this.reviews[i] = this.review;
        }
      }
    } else {
      this.isVisible = true;
      this.displayMessage = 5;
      this.delay(3000).then(any=>{
        this.isVisible = false;
        this.displayMessage = 0;;
   });
    }
  }

  clear(){
    for(let i = 0; i < 5; i++){
      this.renderer.setStyle(this.stars.toArray()[i].nativeElement, 'color', 'gray');
    };
    this.myComment = '';
    this.myRating = 0;
  }

   async delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

  onaddtoCart(){
    this.itemService.onaddtoCart(this.item.id);
  }

  onBackclick(){
    this._location.back();
  }
}
