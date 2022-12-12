import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Category } from '../models/category';
import { ID } from '@datorama/akita';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class CategoryAPI {
    private url = 'api/categories';  // URL to web api

    private httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    private s3UploadHttpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Bypass-Interceptor': 'not header token'
        })
    };

    constructor(private http: HttpClient) { }

    /** GET categories from the server */
    get(storeType: number): Observable<any> {
        return this.http.get<any>(environment.baseUrl + '/categories?storeType=' + storeType, this.httpOptions);
    }

    /** PUT: update the category on the server */
    update(id: ID, data: any): Observable<any> {
        return this.http.put(environment.baseUrl + '/categories/' + id, data, this.httpOptions);
    }

    /** POST: add a new category to the server */
    create(data: any): Observable<any> {
        return this.http.post<any>(environment.baseUrl + '/categories', data, this.httpOptions);
    }

    /** DELETE: delete the hero from the server */
    delete(id: ID): Observable<Category> {
        const url = `${this.url}/${id}`;
        return this.http.delete<any>(environment.baseUrl + '/categories/' + id, this.httpOptions);
    }

    /** upload */
    getUploadUrl(): Observable<any> {
        return this.http.get(environment.baseUrl + '/category-image/signedupload', this.httpOptions);
    }

    putUpload(url: string, formData: Blob): Observable<any> {
        return this.http.put(url, formData, this.s3UploadHttpOptions);
    }

    /** sort categories */
    sort(data: any): Observable<any> {
        return this.http.post(environment.baseUrl + '/categories/change-order', data, this.httpOptions);
    }
}
