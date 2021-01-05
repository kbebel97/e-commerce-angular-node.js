import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { paymentMethod } from "../shared/paymentMethod";
import { Subject } from "rxjs";




@Injectable()
export class settingsService{

  paymentMethods : paymentMethod[];
  generalInfo : any

  private generalInfoUpdated = new Subject<any[]>();
  private paymentMethodsUpdated = new Subject<paymentMethod[]>();

  constructor(private http: HttpClient){
  }


  addPaymentMethod(paymentInfo){
    // console.log(paymentInfo);
    // const paymentData = new FormData();
    // paymentData.append("firstName", paymentInfo.firstName);
    // paymentData.append("lastName", paymentInfo.lastName);
    // paymentData.append("image", paymentInfo.image);
    // this.http
    //   .post<{ message: string; paymentId: string }>(
    //     "http://localhost:3000/api/paymentMethods",
    //     paymentData
    //   )
    //   .subscribe(responseData => {
    //     const paymentMethods:
    //   })


  }

  saveGeneralInfo(generalInfo){
    console.log(generalInfo);
    const generalInfoForm = new FormData();
    generalInfoForm.append("firstName", generalInfo.firstName);
    generalInfoForm.append("lastName", generalInfo.lastName);
    generalInfoForm.append("image", generalInfo.image);
    this.http
      .post<{ message: string; paymentInfo: any}>(
        "http://localhost:3000/api/paymentMethods",
        generalInfoForm
      )
      .subscribe(responseData => {
        const generalInfo = {
          id: responseData.paymentInfo._id,
          firstName: responseData.paymentInfo.firstname,
          firstLast: responseData.paymentInfo.lastname

        }
        this.generalInfo = generalInfo;
        this.generalInfoUpdated.next([generalInfo]);
        // this.paymentMethods.push(paymentMethod);
        // this.paymentMethodsUpdated.next([...this.paymentMethods]);

      })


  }

}
















