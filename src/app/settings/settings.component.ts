import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit, AfterViewInit {
  @ViewChild('billing') billing: ElementRef;
  billingHeight : number;
  card2 : string;
  cards = [];
  url;
  msg = "";
  value : string;
  paymentSetting : number;
  addressSetting : number;
  selectedValue : string;
  fileToUpload: File = null;


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

  ngAfterViewInit(){
    this.billingHeight = this.billing.nativeElement.offsetHeight;
  }

}
