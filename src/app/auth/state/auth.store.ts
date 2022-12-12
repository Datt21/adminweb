import {Injectable} from '@angular/core';
import {Store, StoreConfig, EntityStore} from '@datorama/akita';
import {User} from '../../core/models/user';

export interface AuthState {
  isSubmit: boolean;
  user: User;
  token: string;
}

export function createInitialState(): AuthState {
  return {
    isSubmit: false,
    user: null,
    token: null,
  };
}

@Injectable({providedIn: 'root'})
@StoreConfig({name: 'auth'})
export class AuthStore extends Store<AuthState> {

  constructor() {
    super(createInitialState());
  }

}

