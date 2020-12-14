import { Injectable } from '@angular/core';
import { Item } from '../shared/Item.model';
import { Review } from '../shared/review.model';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class itemService{

    private rootURL = 'http://localhost:3080/api/products';

    constructor(private http: HttpClient){}

    getItem(id: number): Observable<any>{
        return this.http.get(this.rootURL + '/' + id);
    }

    getReviews(id: number): Observable<any> {
        return this.http.get(this.rootURL + '/' + id + "/reviews");
    }
}