import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../models/category';
import { ID } from '@datorama/akita';
import { environment } from '../../../environments/environment';
@Injectable({
    providedIn: 'root'
})

export class ProductAPI {
    private url = 'api/products';  // URL to web api

    httpOptions = {
        headers: new HttpHeaders({'Content-Type': 'application/json'})
    };
    private s3UploadHttpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Bypass-Interceptor': 'not header token'
        })
    };
    constructor(private http: HttpClient) { }

    /** GET products from the server */
    get(category: Category): Observable<any> {
        return this.http.get<any>(environment.baseUrl + '/fast-foods?categoryId=' + category.id);
    }

    /** PUT: update the product on the server */
    update(id: ID, data: any): Observable<any> {
        return this.http.put(environment.baseUrl + '/fast-foods/' + id, data, this.httpOptions);
    }

    /** POST: add a new product to the server */
    create(data: any): Observable<any> {
        return this.http.post<any>(environment.baseUrl + '/fast-foods', data, this.httpOptions);
    }

    /** DELETE: delete the product from the server */
    delete(id: ID): Observable<any> {
        return this.http.delete<any>(environment.baseUrl + '/fast-foods/' + id, this.httpOptions);
    }

    /** SEARCH: search price for fast-food */
    searchPrice(productId: string): Observable<any> {
        return this.http.get<any>(environment.baseUrl + '/products/' + productId);
    }

    /** upload */
    getUploadUrl(): Observable<any> {
        return this.http.get(environment.baseUrl + '/fast-food-image/signedupload');
    }


    putUpload(url: string, formData: Blob): Observable<any> {
        return this.http.put(url, formData, this.s3UploadHttpOptions);
    }

    find(id: ID): Observable<any> {
        return this.http.get<any>(environment.baseUrl + '/fast-foods/' + id);
    }

    /** sort products */
    sort(data: any): Observable<any> {
        return this.http.post(environment.baseUrl + '/fast-foods/change-order', data);
    }
}

