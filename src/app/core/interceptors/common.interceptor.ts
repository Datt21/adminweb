import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NzNotificationService, NzModalService } from 'ng-zorro-antd';
import {ValidateError} from '../models/validate-error';

@Injectable()
export class CommonInterceptor implements HttpInterceptor {

  constructor(private notificationService: NzModalService) {
  }

  showError(content: string) {
    this.notificationService.error({
      nzTitle: 'エラー',
      nzContent: content,
      nzWidth: '416px',
    });
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(catchError(err => {
      if (err instanceof HttpErrorResponse && err.status === 0) {
        this.showError('インターネット接続がありません。');
      }
      if (err instanceof HttpErrorResponse && err.status !== 0) {
        if (err.status === 401) {
          this.showError('ログインの有効期限が切れました。再度ログインを実施してください。');
        } else {
          if (err.error.errors) {
            const errorMessage = (err.error as ValidateError).errors.reduce((acc, curr) => {
              for (const item in curr.constraints) {
                if (curr.constraints.hasOwnProperty(item)) {
                  acc += curr.constraints[item] + '\n';
                }
              }
              return acc;
            }, '');
            this.showError(errorMessage);
          } else {
            this.showError(err.error.message);
          }
        }
      }
      return throwError(err);
    }));
  }
}
