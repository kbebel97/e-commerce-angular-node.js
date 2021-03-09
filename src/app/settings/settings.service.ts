import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { paymentMethod } from "../shared/paymentMethod";
import { Subject } from "rxjs";
import { User } from "../shared/user.model";

@Injectable()
export class settingsService{

  paymentMethods : paymentMethod[];
  generalInfo : any
  user: User;

  private defaultAddressEdited = new Subject<boolean>();
  private addressAdded = new Subject<boolean>();
  private addressSelected = new Subject<boolean>();
  private defaultChargeCardSelected = new Subject<boolean>();
  private chargeCardadded = new Subject<boolean>();
  private defaultChargeCardEdited = new Subject<boolean>();
  private userUpdated = new Subject<{user: User}>();

  private userdetailsUpdated = new Subject<{isUpdated : boolean}>();
  private passwordUpdated = new Subject<{passwordUpdated: boolean, password: string}>();
  private usernameUpdated = new Subject<{usernameUpdated: boolean, username: string}>();

  constructor(private http: HttpClient){
  }
  getProfileMongo(){
    this.http
    .get<{message: string, user: any}>('http://localhost:3000/api/user')
    .subscribe((response) => {
      let transformedUser : User = {
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
      this.userUpdated.next({ user : transformedUser });
    });
  }

  getProfileUpdateListener(){
    return this.userUpdated.asObservable();
  }

  userdetailsUpdateListener(){
    return this.userdetailsUpdated.asObservable();
  }

  saveGeneralData(profile: User, image: any){
    const generalData = new FormData();
    if(image == null){
      generalData.append("Id", profile.Id);
      generalData.append("userName", profile.userName);
      generalData.append("firstName", profile.firstName);
      generalData.append("lastName", profile.lastName);
      generalData.append("password", profile.password);
    } else if(typeof(image) == "string"){
      generalData.append("Id", profile.Id);
      generalData.append("userName", profile.userName);
      generalData.append("image", image);
      generalData.append("firstName", profile.firstName);
      generalData.append("lastName", profile.lastName);
      generalData.append("password", profile.password);
    } else {
      generalData.append("Id", profile.Id);
      generalData.append("userName", profile.userName);
      generalData.append("image", image, profile.email + '/photo');
      generalData.append("firstName", profile.firstName);
      generalData.append("lastName", profile.lastName);
      generalData.append("password", profile.password);
    }
    this.http
    .put<{ message: string; imagePath : any}>(
      "http://localhost:3000/api/user/generaldata", generalData
    )
    .subscribe(response => {
        this.userdetailsUpdated.next({isUpdated : true})
    }, error => {
      this.userdetailsUpdated.next({isUpdated : false})
    })
  }

  editDefaultChargeCard(profile: User){
    this.http
    .put<{ message: string }>(
      "http://localhost:3000/api/user/updatepayment", profile
    )
    .subscribe(responseData => {
      console.log(responseData.message);
      this.defaultChargeCardEdited.next(true);
    }
    , error => {
      this.defaultChargeCardEdited.next(false)
    })
  }

  addNewChargeCard(profile: User){
    this.http
    .put<{ message: string }>(
      "http://localhost:3000/api/user/addpayment", profile
    )
    .subscribe(responseData => {
      console.log(responseData.message);
      this.chargeCardadded.next(true);
    }
    , error => {
      this.chargeCardadded.next(false)
    })
  }

  selectdefaultChargeCard(profile: User){
    this.http
    .put<{ message: string }>(
      "http://localhost:3000/api/user/selectpayment", profile
    )
    .subscribe(responseData => {
      console.log(responseData.message);
      this.defaultChargeCardSelected.next(true);
    }
    , error => {
      this.defaultChargeCardSelected.next(false)
    })
  }

  editdefaultAddress(profile: User){
    this.http
    .put<{ message: string }>(
      "http://localhost:3000/api/user/updateaddress", profile
    )
    .subscribe(responseData => {
      console.log(responseData.message);
      this.defaultAddressEdited.next(true);
    }
    , error => {
      this.defaultAddressEdited.next(false)
    })
  }

  selectdefaultAddress(profile: User){
    this.http
    .put<{ message: string }>(
      "http://localhost:3000/api/user/selectaddress", profile
    )
    .subscribe(responseData => {
      this.addressSelected.next(true);
    }
    , error => {
      this.addressSelected.next(false)
    })
  }

  addNewAddress(profile: User){
    this.http
    .put<{ message: string }>(
      "http://localhost:3000/api/user/addaddress", profile
    )
    .subscribe(responseData => {
      this.addressAdded.next(true);
    }
    , error => {
      this.addressAdded.next(false)
    })
  }

  updatePassword(profile: User, newpassword, oldpassword){
    let user = {
      email: profile.email,
      oldpassword : oldpassword,
      newpassword : newpassword,
      oldhashedpassword: profile.password,
      lastName: profile.lastName,
      firstName: profile.firstName,
      userName: profile.userName,
      Id: profile.Id
    }
    this.http
    .put<{ message: string, passwordUpdated: boolean, encryptedPassword: string }>(
      "http://localhost:3000/api/user/updatepassword", user
    )
    .subscribe(response => {
      this.passwordUpdated.next({passwordUpdated : true, password: response.encryptedPassword})}
    , error => {
      this.passwordUpdated.next({passwordUpdated: false, password: null})
    })
  }

  updateUserName(profile: User, unencryptedPassword: string){
    let user = {
      email: profile.email,
      password: profile.password,
      unencryptedPassword: unencryptedPassword,
      lastName: profile.lastName,
      firstName: profile.firstName,
      userName: profile.userName,
      Id: profile.Id
    }
    this.http
      .put<{ message: string, username: string}>(
        "http://localhost:3000/api/user/updateusername", user
      )
      .subscribe(response => {
        this.usernameUpdated.next({usernameUpdated: true, username: response.username})
      }, error => {
        this.usernameUpdated.next({usernameUpdated: false, username: null})
      })
  }

  getAddressSelected(){
    return this.addressSelected.asObservable();
  }

  getDefaultAddressEdited(){
    return this.defaultAddressEdited.asObservable();
  }

  getAddressSelectedListener(){
    return this.addressSelected.asObservable();
  }

  getAddressAddedListener(){
    return this.addressAdded.asObservable();
  }

  getDefaultChargeCardSelectedListener(){
    return this.defaultChargeCardSelected.asObservable();
  }

  getDefaultChargeCardEditedListener(){
    return this.defaultChargeCardEdited.asObservable();
  }

  getChargeCardAddedListener(){
    return this.chargeCardadded.asObservable();
  }

  passwordUpdatedListener(){
    return this.passwordUpdated.asObservable();
  }

  usernameUpdatedListener(){
    return this.usernameUpdated.asObservable();
  }

}
















