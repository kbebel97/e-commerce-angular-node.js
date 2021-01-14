import { ThrowStmt } from '@angular/compiler';
import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild, ɵConsole } from '@angular/core';
import { Form, FormControl, FormGroup, Validators } from '@angular/forms';
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

  addressHeight : number;
  billingHeight : number;
  editDefaultPaymentForm: FormGroup;
  addNewPaymentForm: FormGroup;
  selectPaymentForm: FormGroup;
  loginForm: FormGroup;
  newAddressForm: FormGroup;
  EditAddressForm: FormGroup;
  generalInfoForm: FormGroup;
  selectAddressForm: FormGroup;

  card2 : string;

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
  selectedValue : string;
  fileToUpload: File = null;
  userIsAuthenticated: boolean;
  authStatusSub: Subscription;
  settingsSub: Subscription;
  isLoading = false;
  disabled : boolean = true;


  profile: User = {
    Id: '',
    email: '',
    password: '',
    userName: '',
    firstName: '',
    lastName: '',
    paymentMethods: [],
    shippingAddresses: [],
    imagePath: ' '
  }

  imageSubscription: Subscription;

  primaryChargeCard: paymentMethod = {
    cardNumber: 0,
    expirationDate: '',
    securityCode: '',
    primaryMethod: true
  };

  primaryShippingAddress: shippingAddress = {
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zipcode: '',
    country: '',
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



    this.settingsService.getDefaultAddressEdited().subscribe((response) => {
      if(response)
        this.displayMessageAddress = 3
      else this.displayMessageAddress = 6;
    })

    this.settingsService.getAddressAddedListener().subscribe((response)=> {
      if(response)
        this.displayMessageAddress = 1;
      else this.displayMessagePayment = 4;
    })

    this.settingsService.getAddressSelectedListener().subscribe((response)=> {
      if(response)
        this.displayMessageAddress = 2;
      else this.displayMessageAddress = 5;
    })

    this.settingsService.getDefaultChargeCardEditedListener().subscribe((response) => {
      if(response)
        this.displayMessagePayment = 2;
      else this.displayMessagePayment = 5;
    })

    this.settingsService.getDefaultChargeCardSelectedListener().subscribe((response) => {
      if(response)
        this.displayMessagePayment = 3;
      else this.displayMessagePayment = 6;
    })

    this.settingsService.getGeneralDataUpdateListener().subscribe((responseData: {imagePath :string, isUpdated : boolean}) => {
      if(responseData.isUpdated){
        this.displayMessageGeneral = 1;
      } else this.displayMessageGeneral = 2;

    })

    this.settingsService.getLoginUpdateListener().subscribe((responseData : {boolean: boolean, hash: string}) => {
      if(!responseData.boolean){
        this.displayMessageLogin = 1;
      } else{
        this.displayMessageLogin = 2;
        this.profile.password = responseData.hash;
      }
    })

    this.loginForm = new FormGroup({
      email : new FormControl(null, {validators: [Validators.required, Validators.minLength(8), Validators.maxLength(25)]}),
      userName : new FormControl(null, {validators: [Validators.required, Validators.minLength(8), Validators.maxLength(15)]}),
      oldPassword : new FormControl(null, {validators: [Validators.required, Validators.minLength(8), Validators.maxLength(15)]}),
      confirmoldPassword : new FormControl(null, {validators: [Validators.required, Validators.minLength(8), Validators.maxLength(15)]}),
      newPassword : new FormControl(null, {validators: [Validators.required, Validators.minLength(8), Validators.maxLength(15)]}),
      confirmnewPassword : new FormControl(null, {validators: [Validators.required, Validators.minLength(8), Validators.maxLength(15)]})
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
      newcard : new FormControl(null, {validators: [Validators.required, Validators.minLength(16)]}),
      newexpirationDate : new FormControl(null, {validators: [Validators.required, Validators.minLength(4)]}),
      newsecurityCode : new FormControl(null, {validators: [Validators.required, Validators.minLength(3)]})
    });

    this.EditAddressForm = new FormGroup({
      addressLine1 : new FormControl(null, {validators: [Validators.required, Validators.maxLength(25)]}),
      addressLine2 : new FormControl(null,{validators: [Validators. maxLength(25)]}),
      city : new FormControl(null,{validators: [Validators.required, Validators. maxLength(25)]}),
      state : new FormControl(null,{validators: [Validators.required, Validators.maxLength(25)]}),
      zipCode : new FormControl(null,{validators: [Validators.required, Validators.maxLength(25)]}),
      country : new FormControl(null,{validators: [Validators.required, Validators.maxLength(25)]})
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

    this.generalInfoForm = new FormGroup({
      firstName :  new FormControl(null,{validators: [Validators.required, Validators. maxLength(25)]}),
      lastName :  new FormControl(null,{validators: [Validators.required, Validators. maxLength(25)]}),
      image : new FormControl(null, {validators: [Validators.required], asyncValidators: [mimeType]})
    });

    this.paymentSetting = 1;
    this.addressSetting = 1;
    this.isLoading = true;
    this.settingsService.getProfileMongo();
    this.loginForm.controls['email'].disable();
    this.settingsSub = this.settingsService.getProfileUpdateListener()
      .subscribe((user : {user: User}) => {
        this.isLoading = false;
        if(user.user.imagePath){
          this.imgPreview = user.user.imagePath;
          this.profile.imagePath = user.user.imagePath;
        }
        if(user.user.userName){
          this.profile.userName = user.user.userName;
        }

        if(user.user.shippingAddresses){
          if(user.user.shippingAddresses.length == 0){
            this.EditAddressForm.controls['addressLine1'].disable();
            this.EditAddressForm.controls['addressLine2'].disable();
            this.EditAddressForm.controls['city'].disable();
            this.EditAddressForm.controls['state'].disable();
            this.EditAddressForm.controls['zipCode'].disable();
            this.EditAddressForm.controls['country'].disable();
          } else{
            this.profile.shippingAddresses = user.user.shippingAddresses;
            // this.shippingAddresses = user.user.shippingAddresses;
            this.profile.shippingAddresses.forEach((shippingaddress) => {
              this.shippingAddresses.push(shippingaddress);
              if(shippingaddress.primaryShippingAddress){
                this.primaryShippingAddress = shippingaddress;
                this.EditAddressForm.setValue({
                  'addressLine1' : this.primaryShippingAddress.addressLine1,
                  'addressLine2' : this.primaryShippingAddress.addressLine2,
                  'city' : this.primaryShippingAddress.city,
                  'state' : this.primaryShippingAddress.state,
                  'zipCode' : this.primaryShippingAddress.zipcode,
                  'country' : this.primaryShippingAddress.country
                });
              }
            })
          }
        }
        if(user.user.paymentMethods){
          if(user.user.paymentMethods.length == 0){
            this.editDefaultPaymentForm.controls['card'].disable();
            this.editDefaultPaymentForm.controls['expirationDate'].disable();
            this.editDefaultPaymentForm.controls['securityCode'].disable();
          } else {
          this.profile.paymentMethods = user.user.paymentMethods;
          this.profile.paymentMethods.forEach((paymentMethod) => {
            if(paymentMethod.primaryMethod){
              this.primaryChargeCard = paymentMethod
              var hashChargedCardNumber = paymentMethod.cardNumber.toString().replace(/\d(?=\d{4})/g, "*");
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
              var hashChargedCardNumber = paymentMethod.cardNumber.toString().replace(/\d(?=\d{4})/g, "*");
              let hashedChargeCard : paymentMethod = {
                cardNumber: hashChargedCardNumber,
                expirationDate: paymentMethod.expirationDate,
                securityCode: paymentMethod.securityCode,
                primaryMethod: false
              }
              this.chargeCards.push(hashedChargeCard);
            }
          }) }
        }

        if(user.user.firstName){
          this.profile.firstName = user.user.firstName;
        }
        if(user.user.lastName){
          this.profile.lastName = user.user.lastName;
        }
        this.profile.email = user.user.email;
        this.profile.password = user.user.password;
        this.profile.Id = user.user.Id;

        this.addNewPaymentForm.setValue({
          'newcard' : '',
          'newexpirationDate' : '',
          'newsecurityCode' : ''
        })

        this.settingsService.getChargeCardAddedListener().subscribe((response) => {
          if(response){
            this.displayMessagePayment = 1;
            this.addNewPaymentForm.setValue({
              'newcard' : '',
              'newexpirationDate' : '',
              'newsecurityCode' : ''
            })
          }
          else this.displayMessagePayment = 4;
        })

        this.selectPaymentForm.setValue({
          'selectedCard' : this.isDataFetched(this.primaryChargeCard.cardNumber)
        });

        this.loginForm.setValue({
          'email' : this.profile.email,
          'userName' : this.profile.userName,
          'oldPassword' : '',
          'confirmoldPassword' : '',
          'newPassword' : '',
          'confirmnewPassword' : ''
        })

        this.newAddressForm.setValue({
          'addressLine1' : '',
          'addressLine2' : '',
          'city' : '',
          'state' : '',
          'zipCode' : '',
          'country' : ''
        })

        this.generalInfoForm.setValue({
          'firstName' :  this.profile.firstName,
          'lastName' :  this.profile.lastName,
          'image' : this.profile.imagePath
        })
    })

    this.userIsAuthenticated = this.authService.getIsAuth();
    if(this.userIsAuthenticated == false){
      this.isLoading = false;
      // this.displayMessage = "Create an account?"
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
    const file = (event.target as HTMLInputElement).files[0];
    this.generalInfoForm.patchValue({image: file});
    this.generalInfoForm.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imgPreview = reader.result as string;
    };
    if(file !=null){
      reader.readAsDataURL(file);
    }
  }

  saveGeneralData(){
    this.profile.firstName = this.generalInfoForm.value.firstName;
    this.profile.lastName = this.generalInfoForm.value.lastName;
      this.profile.imagePath = this.generalInfoForm.value.image;
      this.settingsService.saveGeneralData(this.profile, this.generalInfoForm.value.image);
      // this.imageSubscription = this.settingsService.getGeneralDataUpdateListener.subscribe((response : {imagePath :string, isUpdated : boolean}) => {
      //   if(response.imagePath){
      //     this.imgPreview = response.imagePath;
      //   }
      // })
      this.settingsService.getGeneralDataUpdateListener().subscribe((responseData: {imagePath :string, isUpdated : boolean}) => {
        if(responseData.isUpdated){
          this.displayMessageGeneral = 1;
          this.imgPreview = responseData.imagePath;
        } else this.displayMessageGeneral = 2;

      })
  }

  addNewChargeCard(){
    if(this.addNewPaymentForm.valid){
      let chargeCard : paymentMethod = {
        cardNumber: this.addNewPaymentForm.value.newcard,
        expirationDate: this.addNewPaymentForm.value.newexpirationDate,
        securityCode: this.addNewPaymentForm.value.newsecurityCode,
        primaryMethod: false
      }
      if(this.profile.paymentMethods.length == 0){
        this.editDefaultPaymentForm.controls['card'].enable();
        this.editDefaultPaymentForm.controls['expirationDate'].enable();
        this.editDefaultPaymentForm.controls['securityCode'].enable();
        chargeCard.primaryMethod = true;
        this.primaryChargeCard = chargeCard;
        this.profile.paymentMethods.push(chargeCard);
        let hashChargedCardNumber = chargeCard.cardNumber.toString().replace(/\d(?=\d{4})/g, "*");
        let hashedChargeCard : paymentMethod = {
          cardNumber: hashChargedCardNumber,
          expirationDate: this.addNewPaymentForm.value.newexpirationDate,
          securityCode: this.addNewPaymentForm.value.newsecurityCode,
          primaryMethod: true
        }
        this.chargeCards.push(hashedChargeCard);
        console.log(this.profile.paymentMethods);
        console.log(this.chargeCards);
        this.editDefaultPaymentForm.setValue({
          'card': this.isDataFetched(this.primaryChargeCard.cardNumber),
          'expirationDate': this.isDataFetched(this.primaryChargeCard.expirationDate),
          'securityCode' : this.isDataFetched(this.primaryChargeCard.securityCode)
        });
        this.settingsService.addNewChargeCard(this.profile);
      } else {
        this.profile.paymentMethods.push(chargeCard);
        console.log(this.profile.paymentMethods);
        let hashChargedCardNumber = chargeCard.cardNumber.toString().replace(/\d(?=\d{4})/g, "*");
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

  editDefaultChargeCard(){
    if(this.editDefaultPaymentForm.valid){
      let verified : boolean = true;
      for(let i = 0; i < this.editDefaultPaymentForm.value.card.length; i++){
        console.log(this.editDefaultPaymentForm.value.card.charAt(i));
        if(this.editDefaultPaymentForm.value.card.charAt(i)=='*')
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
        let hashPrimaryChargeCardNumber = this.primaryChargeCard.cardNumber.toString().replace(/\d(?=\d{4})/g, "*");
        let hashedChargeCard = {
          cardNumber: hashPrimaryChargeCardNumber,
          expirationDate: this.editDefaultPaymentForm.value.expirationDate,
          securityCode: this.editDefaultPaymentForm.value.securityCode,
          primaryMethod: true
        }
        this.chargeCards.push(hashedChargeCard);
        this.profile.paymentMethods.push(this.primaryChargeCard);
        this.settingsService.editDefaultChargeCard(this.profile);
      }
    }
  }

  saveDefaultChargeCard(){
    console.log(this.profile.paymentMethods);
    console.log(this.chargeCards);
    for(let i = 0; i < this.profile.paymentMethods.length; i++){
      if(this.profile.paymentMethods[i].primaryMethod == true){
        this.profile.paymentMethods[i].primaryMethod = false;
      }
    }
    for(let i = 0; i < this.chargeCards.length; i++){
      if(this.chargeCards[i].primaryMethod == true){
        this.chargeCards[i].primaryMethod = false;
      }
    }
    this.profile.paymentMethods[this.selectPaymentForm.value.selectedCard].primaryMethod = true;
    this.chargeCards[this.selectPaymentForm.value.selectedCard].primaryMethod = true;
    this.primaryChargeCard = this.profile.paymentMethods[this.selectPaymentForm.value.selectedCard];
    this.settingsService.selectdefaultChargeCard(this.profile);
    this.editDefaultPaymentForm.setValue({
      'card':   this.chargeCards[this.selectPaymentForm.value.selectedCard].cardNumber,
      'expirationDate': this.chargeCards[this.selectPaymentForm.value.selectedCard].expirationDate,
      'securityCode' :   this.chargeCards[this.selectPaymentForm.value.selectedCard].securityCode
    });
  }

  saveDefaultAddress(){
      for(let i = 0; i < this.profile.shippingAddresses.length; i++){
        if(this.profile.shippingAddresses[i].primaryShippingAddress == true){
          this.profile.shippingAddresses[i].primaryShippingAddress = false;
        }
      }
      for(let i = 0; i < this.shippingAddresses.length; i++){
        if(this.shippingAddresses[i].primaryShippingAddress == true){
          this.shippingAddresses[i].primaryShippingAddress = false;
        }
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
        this.EditAddressForm.controls['addressLine1'].enable();
        this.EditAddressForm.controls['addressLine2'].enable();
        this.EditAddressForm.controls['city'].enable();
        this.EditAddressForm.controls['state'].enable();
        this.EditAddressForm.controls['zipCode'].enable();
        this.EditAddressForm.controls['country'].enable();
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
        if(this.profile.shippingAddresses[i].addressLine1 == this.primaryShippingAddress.addressLine1
           &&
          this.profile.shippingAddresses[i].addressLine2 == this.primaryShippingAddress.addressLine2 &&
          this.profile.shippingAddresses[i].zipcode == this.primaryShippingAddress.zipcode &&
          this.profile.shippingAddresses[i].country == this.primaryShippingAddress.country &&
          this.profile.shippingAddresses[i].state == this.primaryShippingAddress.state &&
          this.profile.shippingAddresses[i].city == this.primaryShippingAddress.city
          ){
          index = i;
            console.log(this.profile.shippingAddresses[i]);
        }
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

  saveLoginData(){
    console.log(this.loginForm.value);
    if(this.loginForm.value.newPassword == this.loginForm.value.confirmnewPassword &&
       this.loginForm.value.oldPassword == this.loginForm.value.confirmoldPassword &&
       this.loginForm.valid){
        this.profile.userName = this.loginForm.value.userName;
        console.log(this.profile.userName);
        this.settingsService.saveLoginData(this.profile, this.loginForm.value.confirmnewPassword, this.loginForm.value.confirmoldPassword);
    } else if(this.loginForm.value.newPassword != this.loginForm.value.confirmnewPassword || this.loginForm.value.oldPassword != this.loginForm.value.confirmoldPassword){
      this.displayMessageLogin = 3;
    } else if(this.loginForm.invalid){
      this.displayMessageLogin = 4;
    }
  }




  goLogin(){
    this.router.navigate(['/login']);
  }


  ngAfterViewInit(){
    this.billingHeight = this.billing.nativeElement.offsetHeight;
    this.addressHeight = this.address.nativeElement.offsetHeight;
  }

}
