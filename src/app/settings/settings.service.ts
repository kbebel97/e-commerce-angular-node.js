import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { paymentMethod } from "../shared/paymentMethod";
import { Subject } from "rxjs";
import { User } from "../shared/user.model";
import { map } from "rxjs/operators";




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
  private generalDataUpdated = new Subject<{imagePath : string, isUpdated : boolean}>();
  private loginUpdated = new Subject<{boolean: boolean, hash: string}>();

  constructor(private http: HttpClient){
  }


  addPaymentMethod(paymentInfo){
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
        imagePath: response.user.imagePath
      }
      this.userUpdated.next({ user : transformedUser });
    });
  }

  getProfileUpdateListener(){
    return this.userUpdated.asObservable();
  }

  getGeneralDataUpdateListener(){
    return this.generalDataUpdated.asObservable();
  }

  getImageUpdateListener(){
    return this.generalDataUpdated.asObservable();
  }

  saveGeneralData(profile: User, image: any){
    const generalData = new FormData();
    if(image == null || typeof(image) == "string"){
      generalData.append("Id", profile.Id);
      generalData.append("userName", profile.userName);
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
    .subscribe(responseData => {
      if(responseData.imagePath){
      this.generalDataUpdated.next({imagePath: responseData.imagePath, isUpdated : true})}
      else console.log({message: responseData.imagePath})
  }, err => {
      this.generalDataUpdated.next({imagePath: null, isUpdated : false})
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


  saveLoginData(profile: User, newpassword, oldpassword){
    const loginData = new FormData();
    loginData.append("Id", profile.Id);
    loginData.append("userName", profile.userName);
    loginData.append("firstName", profile.firstName);
    loginData.append("lastName", profile.lastName);
    loginData.append("oldhashedpassword", profile.password);
    loginData.append("newpassword", newpassword);
    loginData.append("oldpassword", oldpassword);
    console.log(profile.userName);
    let a = {
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
    .put<{ message: string, hash: string }>(
      "http://localhost:3000/api/user/logindata", a
    )
    .subscribe(responseData => {
        this.loginUpdated.next({boolean : true, hash: responseData.hash})}
    , error => {
      this.loginUpdated.next({boolean: false, hash: null})
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

  getLoginUpdateListener(){
    return this.loginUpdated.asObservable();
  }

}
















