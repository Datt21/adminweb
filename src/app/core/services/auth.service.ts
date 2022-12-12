import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AuthAPI {
    constructor(private http: HttpClient) { }

    login(email: string, password: string): Observable<any> {
        return this.http.post<any>(environment.baseUrlAuth + '/login', {
            email, password
        });
    }
    changePass(data: any): Observable<any> {
        return this.http.post<any>(environment.baseUrlAuth + '/change-password', data);
    }
}
