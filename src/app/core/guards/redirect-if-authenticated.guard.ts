import { Injectable } from '@angular/core';
import {
  CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthQuery } from 'src/app/auth/state/auth.query';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RedirectIfAuthenticatedGuard implements CanActivate {
  constructor(
    private authQuery: AuthQuery,
    private router: Router) {

  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    return this.authQuery.getToken().pipe(map(token => {
      if (token) {
        this.router.navigate(['/admin/home']);
        return false;
      }
      return true;
    }));
  }
}
