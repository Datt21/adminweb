import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthStore } from './auth.store';
import { AuthAPI } from 'src/app/core/services/auth.service';
import { NzModalService } from 'ng-zorro-antd';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {

  constructor(private authStore: AuthStore,
              private authAPI: AuthAPI,
              private notification: NzModalService,
              public router: Router,
              private http: HttpClient) {
  }

  login(email: string, pass: string): void {
    this.authStore.update({ isSubmit: true });
    this.authAPI.login(email, pass).subscribe((data) => {
      this.authStore.update({user: data.data.user, token: data.data.token});
      this.authStore.update({ isSubmit: false });
      this.router.navigate([environment.redirectAfterLogin]);
    }, error => {
      this.authStore.update({ isSubmit: false });
    });
  }

  changePass(pass: string, newPass: string, newPassConfirm: string) {
    // tslint:disable-next-line:prefer-const
    let req: any;
    req = {};
    req.password = pass;
    req.newPassword = newPass;
    req.newPasswordConfirm = newPassConfirm;
    this.authStore.update({ isSubmit: true });
    this.authAPI.changePass(req).subscribe((data) => {
      this.authStore.update({ isSubmit: false });
      this.notification.confirm({
        nzTitle: '<span>パスワード変更に成功しました。</span>',
        nzContent: '<span>新しいパスワードでログイン状態を保持しますか。よろしいです。</span>',
        nzCancelText: 'キャンセル',
        nzIconType: 'info-circle',
        nzOnCancel: () => this.logOut(),
        nzWidth: '416px',
      });
    }, error => {
      this.authStore.update({ isSubmit: false });
    });
  }

  logOut() {
    this.authStore.update({token: null, user: null});
    this.router.navigate(['/login']);
  }
}
