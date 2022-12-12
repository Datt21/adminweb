import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ID } from '@datorama/akita';
import { Shop } from '../models/shop';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ShopAPI {
    private url = 'api/shops';  // URL to web api
    private prefix = '/search-store'; // prefix api
    httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json'})
    };

    constructor(private http: HttpClient) { }

    /** GET shops from the server */
    search(input: any): Observable<any> {
        const req = {...input};
        req.storeTypes =  input.storeTypes.filter(x => {
            if (x.checked) { return x; }
        })
        .map(x => {
            return x.id;
        });
        return this.http.post(environment.baseUrl + this.prefix, req, this.httpOptions);
    }

    /** PUT: update the shop on the server */
    update(hashCode: string, data: any): Observable<any> {
        return this.http.post(environment.baseUrl + '/stores/' + hashCode + '/config', data, this.httpOptions);
    }

    /** POST: add a new shop to the server */
    create(data: any): Observable<any> {
        return this.http.post<Shop>(this.url, data, this.httpOptions);
    }

    /** DELETE: delete the shop from the server */
    delete(id: ID): Observable<any> {
        const url = `${this.url}/${id}`;
        return this.http.delete<Shop>(url, this.httpOptions);
    }

    /* POST: update all type the shop from search */
    updateStoresType(data: any): Observable<any> {
        const req = data;
        const url = environment.baseUrl + '/stores/mass-config';
        return this.http.post(url, req, this.httpOptions);
    }
}
