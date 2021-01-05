import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Form, FormControl, FormGroup, Validators } from '@angular/forms';
import {mimeType} from "./mime-type.validator";
import { settingsService } from './settings.service';
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit, AfterViewInit {
  @ViewChild('billing') billing: ElementRef;
  billingHeight : number;
  //FormGroups
  editDefaultPaymentForm: FormGroup;
  addNewPaymentForm: FormGroup;
  selectPaymentForm: FormGroup;
  loginForm: FormGroup;
  newAddressForm: FormGroup;
  EditAddressForm: FormGroup;
  generalInfoForm: FormGroup;

  card2 : string;
  cards = [];
  url;
  imgPreview: string;
  msg = "";
  value : string;
  paymentSetting : number;
  addressSetting : number;
  selectedValue : string;
  fileToUpload: File = null;

  constructor(private settingsService: settingsService){

  }


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
    this.editDefaultPaymentForm = new FormGroup({
      'card#' : new FormControl(null, {validators: [Validators.required, Validators.minLength(16)]}),
      'expirationDate' : new FormControl(null, {validators: [Validators.required, Validators.minLength(4)]}),
      'securityCode' : new FormControl(null, {validators: [Validators.required, Validators.minLength(3)]})
    });

    this.addNewPaymentForm = new FormGroup({
      'newcard#' : new FormControl(null, {validators: [Validators.required, Validators.minLength(16)]}),
      'newexpirationDate' : new FormControl(null, {validators: [Validators.required, Validators.minLength(4)]}),
      'newsecurityCode' : new FormControl(null, {validators: [Validators.required, Validators.minLength(3)]})
    });

    this.selectPaymentForm = new FormGroup({
      'selectedCard#' : new FormControl(null, {validators: [Validators.required, Validators.minLength(16)]})
    });

    this.loginForm = new FormGroup({
      'loginPassword' : new FormControl(null, {validators: [Validators.required, Validators.minLength(8), Validators.maxLength(15)]}),
      'loginUsername' : new FormControl(null, {validators: [Validators.required, Validators.minLength(8), Validators.maxLength(15)]}),
      'confirmloginPassword' : new FormControl(null, {validators: [Validators.required, Validators.minLength(8), Validators.maxLength(15)]})
    });

    this.editDefaultPaymentForm.setValue({
      'card#': 'hello',
      'expirationDate': '23224',
      'securityCode' : 1234
    });

    this.EditAddressForm = new FormGroup({
      'addressLine1' : new FormControl(null, {validators: [Validators.required, Validators.maxLength(25)]}),
      'addressLine2' : new FormControl(null,{validators: [Validators.required, Validators. maxLength(25)]}),
      'city' : new FormControl(null,{validators: [Validators.required, Validators. maxLength(25)]}),
      'state' : new FormControl(null,{validators: [Validators.required, Validators.maxLength(25)]}),
      'zipCode' : new FormControl(null,{validators: [Validators.required, Validators.maxLength(25)]}),
      'country' : new FormControl(null,{validators: [Validators.required, Validators.maxLength(25)]})
    });

    this.newAddressForm = new FormGroup({
      'addressLine1' : new FormControl(null, {validators: [Validators.required, Validators.maxLength(25)]}),
      'addressLine2' : new FormControl(null,{validators: [Validators.required, Validators. maxLength(25)]}),
      'city' : new FormControl(null,{validators: [Validators.required, Validators. maxLength(25)]}),
      'state' : new FormControl(null,{validators: [Validators.required, Validators.maxLength(25)]}),
      'zipCode' : new FormControl(null,{validators: [Validators.required, Validators.maxLength(25)]}),
      'country' : new FormControl(null,{validators: [Validators.required, Validators.maxLength(25)]})
    });

    this.generalInfoForm = new FormGroup({
      'firstName' :  new FormControl(null,{validators: [Validators.required, Validators. maxLength(25)]}),
      'lastName' :  new FormControl(null,{validators: [Validators.required, Validators. maxLength(25)]}),
      'image' : new FormControl(null, {validators: [Validators.required], asyncValidators: [mimeType]})
    })



    this.paymentSetting = 1;
    this.addressSetting = 1;
    // this.cards.push('1234567');
    this.cards.push('hello');
    this.cards.push('this');
    this.cards.push('is');
    this.cards.push('test');
    this.cards.push('hello');
    this.cards.push('this');
    this.cards.push('is');
    this.cards.push('test');

  }

  onImagePicked(event: Event){
    const file = (event.target as HTMLInputElement).files[0];
    this.generalInfoForm.patchValue({image: file});
    this.generalInfoForm.get('image');
    console.log(file);
    console.log(this.generalInfoForm);
    const reader = new FileReader();
    reader.onload = () => {
      this.imgPreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  onSubmit(paymentInfo){
    this.settingsService.addPaymentMethod(paymentInfo);


  }

  onsaveGeneralInfo(){
    this.settingsService.saveGeneralInfo(this.generalInfoForm);

  }

  ngAfterViewInit(){
    this.billingHeight = this.billing.nativeElement.offsetHeight;
  }

}
