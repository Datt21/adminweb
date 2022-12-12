import {Injectable} from '@angular/core';
import {Query} from '@datorama/akita';
import {AuthState, AuthStore} from './auth.store';
import {Observable} from 'rxjs';

@Injectable({providedIn: 'root'})
export class AuthQuery extends Query<AuthState> {

  constructor(protected store: AuthStore) {
    super(store);
  }

  getToken(): Observable<string> {
    return this.select(state => state.token);
  }

}
