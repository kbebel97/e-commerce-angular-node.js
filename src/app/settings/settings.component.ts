import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { authService } from '../auth/auth.service';
import { paymentMethod } from '../shared/paymentMethod';
import { shippingAddress } from '../shared/shippingAddress.model';
import { User } from '../shared/user.model';
import { mimeType } from './mime-type.validator';
import { settingsService } from './settings.service';


@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit, AfterViewInit {
  @ViewChild('billing') billing: ElementRef;
  @ViewChild('address') address: ElementRef;
  @ViewChild('login') login: ElementRef;
  @ViewChild('ccNumber') ccNumberField: ElementRef;


  addressHeight : number;
  billingHeight : number;
  loginHeight: number;

  editDefaultPaymentForm: FormGroup;
  addNewPaymentForm: FormGroup;
  selectPaymentForm: FormGroup;

  passwordForm: FormGroup;
  usernameForm: FormGroup;

  newAddressForm: FormGroup;
  EditAddressForm: FormGroup;
  userDetailsForm: FormGroup;
  selectAddressForm: FormGroup;

  shippingAddresses : shippingAddress[] = [];
  chargeCards : paymentMethod[] = [];
  url;

  imgPreview: string;

  msg = "";
  value : string;

  displayMessageLogin: number;
  displayMessagePayment: number;
  displayMessageAddress: number;
  displayMessageGeneral: number;

  paymentSetting : number;
  addressSetting : number;
  loginSetting: number;
  selectedValue : string;
  fileToUpload: File = null;
  userIsAuthenticated: boolean;
  authStatusSub: Subscription;
  settingsSub: Subscription;
  isLoading = false;
  disabled : boolean = true;


  profile: User = {
    Id: null,
    email: null,
    password: null,
    userName: null,
    firstName: null,
    lastName: null,
    paymentMethods: [],
    shippingAddresses: [],
    imagePath: 'https://st4.depositphotos.com/17828278/24401/v/600/depositphotos_244011872-stock-illustration-image-vector-symbol-missing-available.jpg',
    isAdmin: false
  }

  imageSubscription: Subscription;

  primaryChargeCard: paymentMethod = {
    cardNumber: null,
    expirationDate: null,
    securityCode: null,
    primaryMethod: true
  };

  primaryShippingAddress: shippingAddress = {
    addressLine1: null,
    addressLine2: null,
    city: null,
    state: null,
    zipcode: null,
    country: null,
    primaryShippingAddress: true
  }


  constructor(private settingsService: settingsService, private authService: authService, private router: Router){}

	selectFile(event) {
		if(!event.target.files[0] || event.target.files[0].length == 0) {
			this.msg = 'You must select an image';
			return;
		}

		var mimeType = event.target.files[0].type;

		if (mimeType.match(/image\/*/) == null) {
			this.msg = "Only images are supported";
			return;
		}

		var reader = new FileReader();
		reader.readAsDataURL(event.target.files[0]);

		reader.onload = (_event) => {
			this.msg = "";
			this.url = reader.result;
		}
  }


  handleFileInput(files: FileList) {
    var reader = new FileReader();

    this.fileToUpload = files.item(0);
    reader.readAsDataURL(files[0]);

		reader.onload = (_event) => {
			this.msg = "";
			this.url = reader.result;
		}
}

  ngOnInit(): void {
    this.paymentSetting = 1;
    this.addressSetting = 1;
    this.loginSetting = 1;

    this.settingsService.getDefaultAddressEdited().subscribe((response) => {
      if(response){
        this.displayMessageAddress = 3;
        this.delay(3000).then(any=>{
          this.displayMessageAddress = 0;
        })
      }
      else {
        this.displayMessageAddress = 6;
        this.delay(3000).then(any=>{
        this.displayMessageAddress = 0;
        })
      };
    })

    this.settingsService.getAddressSelectedListener().subscribe((response)=> {
      if(response){
        this.displayMessageAddress = 2;
        this.delay(3000).then(any=>{
          this.displayMessageAddress = 0;
        })
      } else {
        this.displayMessageAddress = 5;
        this.delay(3000).then(any=>{
        this.displayMessageAddress = 0;
        })
      };
    })

    this.settingsService.getDefaultChargeCardEditedListener().subscribe((response) => {
      if(response){
        this.displayMessagePayment = 2;
        this.delay(3000).then(any=>{
          this.displayMessagePayment = 0;
        })
      }
      else {
        this.displayMessagePayment = 5;
        this.delay(3000).then(any=>{
        this.displayMessagePayment = 0;
        })
      };
    })

    this.settingsService.getDefaultChargeCardSelectedListener().subscribe((response) => {
      if(response){
        this.displayMessagePayment = 3;
        this.delay(3000).then(any=>{
          this.displayMessagePayment = 0;
        })
      }
      else {
        this.displayMessagePayment = 6;
        this.delay(3000).then(any=>{
          this.displayMessagePayment = 0;
        })
      }
    })

    // this.settingsService.getGeneralDataUpdateListener().subscribe((responseData: {imagePath :string, isUpdated : boolean}) => {
    //   if(responseData.isUpdated){
    //     // this.imgPreview = responseData.imagePath;
    //     this.displayMessageGeneral = 1;
    //     this.delay(3000).then(any=>{
    //       this.displayMessageGeneral = 0;
    //     })
    //   } else {this.displayMessageGeneral = 2;
    //     this.delay(3000).then(any=>{
    //       this.displayMessageGeneral = 0;
    //     })
    //   }
    // })

    this.settingsService.getAddressAddedListener().subscribe((response)=> {
      if(response){
        this.displayMessageAddress = 1;
        this.newAddressForm.setValue({
          'addressLine1' : null,
          'addressLine2' : null,
          'city' : null,
          'state' : null,
          'zipCode' : null,
          'country' : null
        });
        this.delay(3000).then(any=>{
          this.displayMessageAddress = 0;
        })
      }
      else {
        this.displayMessageAddress = 4;
        this.delay(3000).then(any=>{
        this.displayMessageAddress = 0;
        })
      };
    })

    this.settingsService.passwordUpdatedListener().subscribe((response : {passwordUpdated: boolean, password: string}) => {
      if(!response.passwordUpdated){
        this.displayMessageLogin = 1;
        this.delay(3000).then(any=>{
          this.displayMessageLogin = 0;
        })
      } else{
        this.displayMessageLogin = 6;
        this.profile.password = response.password;
        this.passwordForm.setValue({
          'email' : this.profile.email,
          'oldPassword' : null,
          'confirmoldPassword' : null,
          'newPassword' : null,
          'confirmnewPassword' : null
      })
      this.delay(3000).then(any=>{
        this.displayMessageLogin = 0;
        })
      }
    })

    this.settingsService.usernameUpdatedListener().subscribe((response: {usernameUpdated: boolean, username: string}) => {
      if(!response.usernameUpdated){
        this.displayMessageLogin = 1;
        this.delay(3000).then(any => {
          this.displayMessageLogin = 0;
        })
      } else{
        this.displayMessageLogin = 7;
        this.profile.userName = response.username;
        this.usernameForm.setValue({
          'email' : this.profile.email,
          'username' : this.isDataFetched(this.profile.userName),
          'password': null,
          'confirmpassword': null
        })
        this.delay(3000).then(any=>{
          this.displayMessageLogin = 0;
          })
      }
    })

    this.settingsService.userdetailsUpdateListener().subscribe((response: {isUpdated : boolean}) => {
      if(response.isUpdated){
        this.displayMessageGeneral = 1;
        this.delay(3000).then(any=>{
          this.displayMessageGeneral = 0;
        })
      } else {
          this.displayMessageGeneral = 2;
          this.delay(3000).then(any=>{
            this.displayMessageGeneral = 0;
          })
        }
    })

    this.passwordForm = new FormGroup({
      email : new FormControl(null, {validators: [Validators.required, Validators.minLength(8), Validators.maxLength(25)]}),
      oldPassword : new FormControl(null, {validators: [Validators.required, Validators.minLength(8), Validators.maxLength(15)]}),
      confirmoldPassword : new FormControl(null, {validators: [Validators.required, Validators.minLength(8), Validators.maxLength(15)]}),
      newPassword : new FormControl(null, {validators: [Validators.required, Validators.minLength(8), Validators.maxLength(15)]}),
      confirmnewPassword : new FormControl(null, {validators: [Validators.required, Validators.minLength(8), Validators.maxLength(15)]})
    });

    this.usernameForm = new FormGroup({
      email : new FormControl(null, {validators: [Validators.required, Validators.minLength(8), Validators.maxLength(25)]}),
      username: new FormControl(null, {validators: [Validators.required, Validators.minLength(8), Validators.maxLength(15)]}),
      password : new FormControl(null, {validators: [Validators.required, Validators.minLength(8), Validators.maxLength(15)]}),
      confirmpassword : new FormControl(null, {validators: [Validators.required, Validators.minLength(8), Validators.maxLength(15)]}),
    });

    this.editDefaultPaymentForm = new FormGroup({
      card : new FormControl(null, {validators: [Validators.required, Validators.minLength(16), Validators.maxLength(16)]}),
      expirationDate : new FormControl(null, {validators: [Validators.required, Validators.minLength(4), Validators.maxLength(5)]}),
      securityCode : new FormControl(null, {validators: [Validators.required, Validators.minLength(3), Validators.maxLength(4)]})
    });

    this.selectPaymentForm = new FormGroup({
      selectedCard : new FormControl(null, {validators: [Validators.required, Validators.minLength(16)]})
    });

    this.addNewPaymentForm = new FormGroup({
      card : new FormControl(null, {validators: [Validators.required, Validators.minLength(16)]}),
      expirationDate : new FormControl(null, {validators: [Validators.required, Validators.minLength(4)]}),
      securityCode : new FormControl(null, {validators: [Validators.required, Validators.minLength(3)]})
    });

    this.EditAddressForm = new FormGroup({
      addressLine1 : new FormControl(null),
      addressLine2 : new FormControl(null),
      city : new FormControl(null),
      state : new FormControl(null),
      zipCode : new FormControl(null),
      country : new FormControl(null)
    });

    this.newAddressForm = new FormGroup({
      addressLine1 : new FormControl(null, {validators: [Validators.required, Validators.maxLength(25)]}),
      addressLine2 : new FormControl(null,{validators: [Validators. maxLength(25)]}),
      city : new FormControl(null,{validators: [Validators.required, Validators. maxLength(25)]}),
      state : new FormControl(null,{validators: [Validators.required, Validators.maxLength(25)]}),
      zipCode : new FormControl(null,{validators: [Validators.required, Validators.maxLength(25)]}),
      country : new FormControl(null,{validators: [Validators.required, Validators.maxLength(25)]})
    });

    this.selectAddressForm = new FormGroup({
      selectedAddress : new FormControl(null, {validators: [Validators.required, Validators.maxLength(50)]}),
    });

    this.userDetailsForm = new FormGroup({
      firstName :  new FormControl(),
      lastName :  new FormControl(),
      image : new FormControl(null, {validators: [Validators.required], asyncValidators: [mimeType]})
    });

    this.settingsService.getProfileMongo();
    this.passwordForm.controls['email'].disable();
    this.usernameForm.controls['email'].disable();
    this.settingsSub = this.settingsService.getProfileUpdateListener()
      .subscribe((user : {user: User}) => {
        if(user.user)
          this.profile = user.user;

        if(user.user.imagePath){
          this.imgPreview = this.profile.imagePath
        } else this.imgPreview = "https://st4.depositphotos.com/17828278/24401/v/600/depositphotos_244011872-stock-illustration-image-vector-symbol-missing-available.jpg"

        this.userDetailsForm.setValue({
          'firstName' : this.isDataFetched(this.profile.firstName),
          'lastName' : this.isDataFetched(this.profile.lastName),
          'image' : this.isDataFetched(this.profile.imagePath)
        })

        this.usernameForm.setValue({
          'email' : this.profile.email,
          'username' : this.isDataFetched(this.profile.userName),
          'password': null,
          'confirmpassword': null
        })

        if(this.profile.shippingAddresses && this.profile.shippingAddresses.length > 0){
          this.profile.shippingAddresses.forEach((shippingaddress) => {
            if(shippingaddress.primaryShippingAddress){
              this.primaryShippingAddress = shippingaddress;
              this.EditAddressForm.setValue({
                'addressLine1' : this.primaryShippingAddress.addressLine1,
                'addressLine2' : this.primaryShippingAddress.addressLine2,
                'city' : this.primaryShippingAddress.city,
                'state' : this.primaryShippingAddress.state,
                'zipCode' : this.primaryShippingAddress.zipcode,
                'country' : this.primaryShippingAddress.country
              })
            }
          })
        } else {
          this.EditAddressForm.disable();
        }

        if(this.profile.paymentMethods && this.profile.paymentMethods.length > 0){
          this.profile.paymentMethods.forEach((paymentMethod) => {
            if(paymentMethod.primaryMethod){
              this.primaryChargeCard = paymentMethod
              var hashChargedCardNumber = paymentMethod.cardNumber.toString().replace(/\d(?=\d{4})/g, "#");
              let hashedChargeCard : paymentMethod = {
                cardNumber: hashChargedCardNumber,
                expirationDate: paymentMethod.expirationDate,
                securityCode: paymentMethod.securityCode,
                primaryMethod: true
              }
              this.editDefaultPaymentForm.setValue({
                'card': hashedChargeCard.cardNumber,
                'expirationDate': hashedChargeCard.expirationDate,
                'securityCode' : hashedChargeCard.securityCode
              });
              this.chargeCards.push(hashedChargeCard);
            } else {
              var hashChargedCardNumber = paymentMethod.cardNumber.toString().replace(/\d(?=\d{4})/g, "#");
              let hashedChargeCard : paymentMethod = {
                cardNumber: hashChargedCardNumber,
                expirationDate: paymentMethod.expirationDate,
                securityCode: paymentMethod.securityCode,
                primaryMethod: false
              }
              this.chargeCards.push(hashedChargeCard);
            }
          })} else {
            this.editDefaultPaymentForm.disable();
          }

        this.settingsService.getChargeCardAddedListener().subscribe((response) => {
          if(response){
            this.displayMessagePayment = 1;
            this.addNewPaymentForm.setValue({
              'card' : null,
              'expirationDate' : null,
              'securityCode' : null
            })
            this.delay(3000).then(any=>{
              this.displayMessagePayment = 0;
            })
          }
          else {this.displayMessagePayment = 4;
            this.delay(3000).then(any=>{
              this.displayMessagePayment = 0;
            })
          }
        })

        this.selectPaymentForm.setValue({
          'selectedCard' : this.isDataFetched(this.primaryChargeCard.cardNumber)
        });

        this.passwordForm.setValue({
          'email' : this.profile.email,
          'oldPassword' : null,
          'confirmoldPassword' : null,
          'newPassword' : null,
          'confirmnewPassword' : null
        })

        this.addNewPaymentForm.setValue({
          'card' : null,
          'expirationDate' : null,
          'securityCode' : null
        })
    })

    this.userIsAuthenticated = this.authService.getIsAuth();
    if(!this.userIsAuthenticated){
      this.isLoading = false;
    }
    this.authStatusSub = this.authService
    .getAuthStatusListener()
    .subscribe( isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
    })
  }

  isDataFetched(data){
    if(data && data!==undefined){
      return data;
    } else return ''
  }

  onImagePicked(event: Event){
    //event.target as HTMLInputElement to ensure typescript knows HTML
    const file = (event.target as HTMLInputElement).files[0];
    //Stores file object in userDetailsForm
    this.userDetailsForm.patchValue({image: file});
    //Update value and validity tells angular you have changed the value and evaluates it
    this.userDetailsForm.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imgPreview = reader.result as string;
    };
    if(file !=null){
      reader.readAsDataURL(file);
    }
  }

  saveUserDetails(){
    this.profile.firstName = this.userDetailsForm.value.firstName;
    this.profile.lastName = this.userDetailsForm.value.lastName;
    if(this.userDetailsForm.get('image').valid){
      console.log(this.userDetailsForm.get('image').value);
      this.settingsService.saveGeneralData(this.profile, this.userDetailsForm.value.image);
    } else this.settingsService.saveGeneralData(this.profile, null);
  }

  clearUserDetails(){
    this.userDetailsForm.setValue({
      'firstName' :  '',
      'lastName' :  '',
      'image' : ''
    });
    this.profile.firstName = null;
    this.profile.lastName = null;
    this.profile.imagePath = null;
  }

  clearEditAddressForm(){
    this.EditAddressForm.setValue({
      'addressLine1' : '',
      'addressLine2' : '',
      'zipCode' : '',
      'city' : '',
      'state' : '',
      'country' : ''
    })
  }

  clearNewAddressForm(){
    this.newAddressForm.setValue({
      'addressLine1' : '',
      'addressLine2' : '',
      'zipCode' : '',
      'city' : '',
      'state' : '',
      'country' : ''
    })
  }

  clearPasswordForm(){
    this.passwordForm.setValue({
      'email' : this.profile.email,
      'newPassword' : '',
      'confirmnewPassword' : '',
      'oldPassword' : '',
      'confirmoldPassword' : ''
    })
  }

    clearUserNameForm(){
    this.usernameForm.setValue({
      'email' : this.profile.email,
      'username' : '',
      'password' : '',
      'confirmpassword' : ''
    })
  }

  clearCard(){
    this.editDefaultPaymentForm.setValue({
      'card' : '',
      'expirationDate' : '',
      'securityCode' : ''
    })
  }

  clearnewCard(){
    this.editDefaultPaymentForm.setValue({
      'card' : '',
      'expirationDate' : '',
      'securityCode' : ''
    })
  }


  addCard(){
    if(this.addNewPaymentForm.valid){
      let chargeCard : paymentMethod = {
        cardNumber: this.addNewPaymentForm.value.card,
        expirationDate: this.addNewPaymentForm.value.expirationDate,
        securityCode: this.addNewPaymentForm.value.securityCode,
        primaryMethod: false
      }
      if(this.profile.paymentMethods.length == 0){
        this.editDefaultPaymentForm.enable();
        chargeCard.primaryMethod = true;
        this.primaryChargeCard = chargeCard;
        this.profile.paymentMethods.push(chargeCard);
        let hashChargedCardNumber = chargeCard.cardNumber.toString().replace(/\d(?=\d{4})/g, "#");
        let hashedChargeCard : paymentMethod = {
          cardNumber: hashChargedCardNumber,
          expirationDate: this.addNewPaymentForm.value.newexpirationDate,
          securityCode: this.addNewPaymentForm.value.newsecurityCode,
          primaryMethod: true
        }
        this.chargeCards.push(hashedChargeCard);
        this.editDefaultPaymentForm.setValue({
          'card': this.isDataFetched(this.primaryChargeCard.cardNumber),
          'expirationDate': this.isDataFetched(this.primaryChargeCard.expirationDate),
          'securityCode' : this.isDataFetched(this.primaryChargeCard.securityCode)
        });
        this.settingsService.addNewChargeCard(this.profile);
      } else {
        this.profile.paymentMethods.push(chargeCard);
        console.log(this.profile.paymentMethods);
        let hashChargedCardNumber = chargeCard.cardNumber.toString().replace(/\d(?=\d{4})/g, "#");
        let hashedChargeCard : paymentMethod = {
          cardNumber: hashChargedCardNumber,
          expirationDate: this.addNewPaymentForm.value.newexpirationDate,
          securityCode: this.addNewPaymentForm.value.newsecurityCode,
          primaryMethod: false
        }
        this.chargeCards.push(hashedChargeCard);
        this.settingsService.addNewChargeCard(this.profile);
      }
    }
  }

  editCard(){
    if(this.editDefaultPaymentForm.valid){
      let verified : boolean = true;
      for(let i = 0; i < this.editDefaultPaymentForm.value.card.length; i++){
        if(this.editDefaultPaymentForm.value.card.charAt(i)=='#')
          verified = false;
      }
      if(verified){
        let index;
        for(let i = 0; i < this.profile.paymentMethods.length; i++){
          if(this.profile.paymentMethods[i].cardNumber == this.primaryChargeCard.cardNumber)
            index = i;
        }
        this.chargeCards.splice(index, 1);
        this.profile.paymentMethods.splice(index, 1);
        this.primaryChargeCard.securityCode = this.editDefaultPaymentForm.value.securityCode;
        this.primaryChargeCard.cardNumber = this.editDefaultPaymentForm.value.card;
        this.primaryChargeCard.expirationDate = this.editDefaultPaymentForm.value.expirationDate;
        let hashPrimaryChargeCardNumber = this.primaryChargeCard.cardNumber.toString().replace(/\d(?=\d{4})/g, "#");
        let hashedChargeCard = {
          cardNumber: hashPrimaryChargeCardNumber,
          expirationDate: this.editDefaultPaymentForm.value.expirationDate,
          securityCode: this.editDefaultPaymentForm.value.securityCode,
          primaryMethod: true
        }
        this.chargeCards.push(hashedChargeCard);
        this.profile.paymentMethods.push(this.primaryChargeCard);
        this.settingsService.editDefaultChargeCard(this.profile);
      } else{
          this.displayMessagePayment = 7;
          this.delay(3000).then(any=>{
            this.displayMessagePayment = 0;
            })

      }
    }
  }

  saveCard(){
    for(let i = 0; i < this.profile.paymentMethods.length; i++){
      if(this.profile.paymentMethods[i].primaryMethod)
        this.profile.paymentMethods[i].primaryMethod = false;
    }
    for(let i = 0; i < this.chargeCards.length; i++){
      if(this.chargeCards[i].primaryMethod)
        this.chargeCards[i].primaryMethod = false;
    }
    this.profile.paymentMethods[this.selectPaymentForm.value.selectedCard].primaryMethod = true;
    this.chargeCards[this.selectPaymentForm.value.selectedCard].primaryMethod = true;
    this.primaryChargeCard = this.profile.paymentMethods[this.selectPaymentForm.value.selectedCard];
    this.settingsService.selectdefaultChargeCard(this.profile);
    this.editDefaultPaymentForm.setValue({
      'card': this.chargeCards[this.selectPaymentForm.value.selectedCard].cardNumber,
      'expirationDate': this.chargeCards[this.selectPaymentForm.value.selectedCard].expirationDate,
      'securityCode' : this.chargeCards[this.selectPaymentForm.value.selectedCard].securityCode
    });
  }

  saveDefaultAddress(){
      for(let i = 0; i < this.profile.shippingAddresses.length; i++){
        if(this.profile.shippingAddresses[i].primaryShippingAddress)
          this.profile.shippingAddresses[i].primaryShippingAddress = false;
      }
      for(let i = 0; i < this.shippingAddresses.length; i++){
        if(this.shippingAddresses[i].primaryShippingAddress)
          this.shippingAddresses[i].primaryShippingAddress = false;
      }
      this.profile.shippingAddresses[this.selectAddressForm.value.selectedAddress].primaryShippingAddress = true;
      this.settingsService.selectdefaultAddress(this.profile);
      this.primaryShippingAddress = this.profile.shippingAddresses[this.selectAddressForm.value.selectedAddress];
      this.EditAddressForm.setValue({
        'addressLine1' : this.primaryShippingAddress.addressLine1,
        'addressLine2' : this.primaryShippingAddress.addressLine2,
        'city' : this.primaryShippingAddress.city,
        'state' : this.primaryShippingAddress.state,
        'zipCode' : this.primaryShippingAddress.zipcode,
        'country' : this.primaryShippingAddress.country
      });
  }

  saveNewAddress(){
    if(this.newAddressForm.valid){
      let newAddress : shippingAddress = {
        addressLine1: this.newAddressForm.value.addressLine1,
        addressLine2: this.newAddressForm.value.addressLine2,
        city: this.newAddressForm.value.city,
        state: this.newAddressForm.value.state,
        zipcode: this.newAddressForm.value.zipCode,
        country: this.newAddressForm.value.country,
        primaryShippingAddress: false,
      }
      if(this.profile.shippingAddresses.length == 0){
        this.EditAddressForm.enable();
        newAddress.primaryShippingAddress = true;
        this.profile.shippingAddresses.push(newAddress);
        this.shippingAddresses.push(newAddress);
        this.primaryShippingAddress = newAddress;
        this.EditAddressForm.setValue({
          'addressLine1' : this.primaryShippingAddress.addressLine1,
          'addressLine2' : this.primaryShippingAddress.addressLine2,
          'city' : this.primaryShippingAddress.city,
          'state' : this.primaryShippingAddress.state,
          'zipCode' : this.primaryShippingAddress.zipcode,
          'country' : this.primaryShippingAddress.country
        });
        this.settingsService.addNewAddress(this.profile);
      } else{
        this.profile.shippingAddresses.push(newAddress);
        this.primaryShippingAddress = newAddress;
        this.settingsService.addNewAddress(this.profile);
      }

    }
  }

  editDefaultAddress(){
    if(this.EditAddressForm.valid){
      let index;
      for(let i = 0; i < this.profile.shippingAddresses.length; i++){
        if(this.profile.shippingAddresses[i] == this.primaryShippingAddress)
          index = i;
      }
      this.shippingAddresses.splice(index, 1);
      this.profile.shippingAddresses.splice(index, 1);
      this.primaryShippingAddress.addressLine1 = this.EditAddressForm.value.addressLine1;
      this.primaryShippingAddress.addressLine2 = this.EditAddressForm.value.addressLine2;
      this.primaryShippingAddress.city = this.EditAddressForm.value.city;
      this.primaryShippingAddress.zipcode = this.EditAddressForm.value.zipCode;
      this.primaryShippingAddress.state = this.EditAddressForm.value.state;
      this.primaryShippingAddress.country = this.EditAddressForm.value.country;
      this.profile.shippingAddresses.push(this.primaryShippingAddress);
      this.shippingAddresses.push(this.primaryShippingAddress);
      this.settingsService.editdefaultAddress(this.profile);
    }
  }

  savePassword(){
    if(this.passwordForm.value.newPassword == this.passwordForm.value.confirmnewPassword && this.passwordForm.value.oldPassword == this.passwordForm.value.confirmoldPassword && this.passwordForm.valid){
      this.settingsService.updatePassword(this.profile, this.passwordForm.value.confirmnewPassword, this.passwordForm.value.confirmoldPassword);
    } else if(this.passwordForm.value.newPassword != this.passwordForm.value.confirmnewPassword || this.passwordForm.value.oldPassword != this.passwordForm.value.confirmoldPassword){
      this.displayMessageLogin = 2;
      this.delay(3000).then(any=>{
      this.displayMessageLogin = 0;
      })
    } else if(this.passwordForm.invalid){
     this.displayMessageLogin = 3;
     this.delay(3000).then(any=>{
      this.displayMessageLogin = 0;
      })
    }
  }

  saveUserName(){
    if(this.usernameForm.value.password == this.usernameForm.value.confirmpassword && this.usernameForm.valid){
      this.profile.userName = this.usernameForm.value.username;
      this.settingsService.updateUserName(this.profile, this.usernameForm.value.confirmpassword);
    } else if(this.usernameForm.value.password != this.usernameForm.value.confirmpassword){
        this.displayMessageLogin = 2;
        this.delay(3000).then(any=>{
        this.displayMessageLogin = 0;
        })
    } else if(this.usernameForm.value.password == null || this.usernameForm.value.password == '' || this.usernameForm.value.confirmpassword == null || this.usernameForm.value.confirmpassword == ''){
        this.displayMessageLogin = 5;
        this.delay(3000).then(any=>{
        this.displayMessageLogin = 0;
        })
    } else if(this.usernameForm.invalid){
        this.displayMessageLogin = 4;
        this.delay(3000).then(any=>{
        this.displayMessageLogin = 0;
        })
    }
  }

  goLogin(){
    this.router.navigate(['/login']);
  }

  ngAfterViewInit(){
    this.billingHeight = this.billing.nativeElement.offsetHeight;
    this.addressHeight = this.address.nativeElement.offsetHeight;
    this.loginHeight = this.login.nativeElement.offsetHeight;

  }

  async delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

}
