import { Injectable } from '@angular/core';
import { Review } from '../shared/review.model';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { cartService } from '../cart/cart.service';
import { Item } from '../shared/Item.model';
import { User } from '../shared/user.model';

@Injectable()
export class itemService{

  private itemFetched = new Subject<{message: string, item: Item}>();
  private reviewAdded = new Subject<{message: string, isAdded: boolean, review: Review}>();
  private reviewsFetched = new Subject<{message: string, reviews : Review[]}>();
  private reviewUpdated = new Subject<{message: string, isUpdated: boolean}>();
  private userFetched = new Subject<{message: string, user: User}>();
  private reviewFetched = new Subject<{message: string, review: Review}>();
  private reviews : Review[] = [];

  constructor(private http: HttpClient, private cartService : cartService){}

  getItemFetchedListener(){
    return this.itemFetched.asObservable();
  }

  getUserFetchedListener(){
    return this.userFetched.asObservable();
  }

  getReviewsFetchedListnener(){
    return this.reviewsFetched.asObservable();
  }

  getReviewAddedListener(){
    return this.reviewAdded.asObservable();
  }

  getReviewUpdatedListener(){
    return this.reviewUpdated.asObservable();
  }

  getReviewFetchedListener(){
    return this.reviewFetched.asObservable();
  }

  postReview(review : Review){
    return this.http
      .post<{ message: string, review: any }>("http://localhost:3000/api/reviews/", review)
      .subscribe((response) => {
          let review : Review = {
            itemId: response.review.itemId,
            reviewId: response.review._id,
            creator: response.review.creator,
            email: response.review.email,
            userName: response.review.userName,
            rating: response.review.rating,
            comment: response.review.comment
          }
          this.reviews.push(review);
          this.reviewsFetched.next({message: response.message, reviews: [...this.reviews]})
          this.reviewAdded.next({message: response.message, isAdded: true, review: review});
        }, err => {
          this.reviewAdded.next({message: 'review failed to post', isAdded: false, review: null})
    })
  }

  getUser(){
    return this.http
      .get<{ message: string, user: any}>("http://localhost:3000/api/user")
      .subscribe((response)=> {
        let user = {
          Id: response.user._id,
          email: response.user.email,
          password: response.user.password,
          userName: response.user.userName,
          firstName: response.user.firstName,
          lastName: response.user.lastName,
          paymentMethods: response.user.paymentMethods,
          shippingAddresses: response.user.shippingAddresses,
          imagePath: response.user.imagePath,
          isAdmin: response.user.isAdmin
        }
        this.userFetched.next({message: response.message, user: user});
      }, err => {
        this.userFetched.next({message: 'User was not fetched', user: null})
      })
  }

  getReviews(itemId : string){
    return this.http
      .get<{ message: string, reviews: any}>("http://localhost:3000/api/reviews/" + itemId)
      .pipe(map((result)=> {
        return { reviews : result.reviews.map((review)=> {
          return {
            reviewId: review._id,
            creator: review.creator,
            email: review.email,
            userName: review.userName,
            rating: review.rating,
            comment: review.comment
          }
        }), message : result.message
        }
      }))
      .subscribe((transformedReviews) => {
        this.reviews = transformedReviews.reviews;
        this.reviewsFetched.next({message: transformedReviews.message, reviews: [...this.reviews]})
      }, err => {
        this.reviewsFetched.next({message: 'Reviews failed to be retrieved', reviews: null})
      })
  }

  findReview(itemId: string){
    return this.http
      .get<{message: string, review: any}>("http://localhost:3000/api/reviews/myreview/" + itemId)
      .subscribe((result) => {
        if(result.review){
          let review : Review = {
            reviewId: result.review._id,
            itemId: result.review.itemId,
            creator: result.review.creator,
            email: result.review.email,
            userName: result.review.userName,
            rating: result.review.rating,
            comment: result.review.comment
          }
          this.reviewFetched.next({message: result.message, review : review})
        }
      }, err => {
        this.reviewFetched.next({message: 'Review not placed yet', review: null})
      })

  }

  editReview(review : Review){
    return this.http
      .put<{ message: string }>("http://localhost:3000/api/reviews", review)
      .subscribe((result) => {
        this.reviewUpdated.next({message: result.message, isUpdated: true})
      }, err => {
        this.reviewUpdated.next({message: 'Review failed to updated!', isUpdated: false})
      })
  }

  getItem(itemId){
    return this.http
      .get<{message: string, item : any}>("http://localhost:3000/api/items/" + itemId)
      .subscribe((result) => {
        let transformedItem = {
          id: result.item._id,
          name: result.item.name,
          description: result.item.description,
          individualPrice: result.item.individualPrice,
          individualTax: result.item.individualTax,
          individualShipping : result.item.individualShipping,
          manufacturer: result.item.manufacturer,
          rating: result.item.rating,
          imagePaths: result.item.imagePaths
        }
        this.itemFetched.next({message: result.message, item : transformedItem})
      })
  }

  onaddtoCart(itemId: string){
    console.log(itemId);
    this.cartService.savetoCartWithItemId(itemId);
  }

}
