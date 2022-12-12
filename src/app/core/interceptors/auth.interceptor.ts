import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Router} from '@angular/router';
import {Observable, throwError} from 'rxjs';
import {catchError, map, switchMap, take, tap} from 'rxjs/operators';
import {AuthQuery} from '../../auth/state/auth.query';
import { AuthStore } from 'src/app/auth/state/auth.store';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private router: Router,
              private authQuery: AuthQuery,
              protected authStore: AuthStore) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.authQuery.getToken().pipe(
      take(1),
      map(x => {
        if (!x && this.router.url !== '/login') {
          this.authStore.update({ token: null });
          this.router.navigate(['/login']);
        } else if (!req.headers.get('Bypass-Interceptor')) {
          return req.clone({
            headers: req.headers.append('Authorization', `Bearer ${x}`)
          });
        } else {
          return req;
        }
      }),
      switchMap(authReq => {
        return next.handle(authReq).pipe(
          catchError(err => {
            if (err instanceof HttpErrorResponse && err.status === 401) {
              this.authStore.update({ token: null });
              this.router.navigate(['/login']);
            }
            return throwError(err);
          })
        );
      })
    );
  }
}
