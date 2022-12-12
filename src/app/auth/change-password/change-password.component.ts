import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { validateCharNum, password } from 'src/app/shared/validators/html-validation.directive';
import { Observable } from 'rxjs';
import { AuthQuery } from '../state/auth.query';
import { AuthService } from '../state/auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-change-password',
    templateUrl: './change-password.component.html',
    styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

    validateForm: FormGroup;
    isShowNewPass: boolean;
    isShowOldPass: boolean;
    isShowConfirmPass: boolean;
    keyValues: string;
    zenKakuKeyValue: string;
    hanKakuKeyValue: string;
    zenKakuMessage: string;
    hanKakuMessage: string;
    isSubmit$: Observable<boolean>;
    isSpinning: Observable<boolean>;
    token: string;
    constructor(
        private fb: FormBuilder,
        private authQuery: AuthQuery,
        public authService: AuthService, public router: Router
    ) { }

    ngOnInit() {
        this.authQuery.select(state => state.token).subscribe((data) => {
            this.token = data;
        });
        if (!this.token) {
            this.router.navigate(['/login']);
        }
        this.isShowNewPass = false;
        this.isShowOldPass = false;
        this.isShowConfirmPass = false;
        this.isSubmit$ = this.authQuery.select(state => state.isSubmit);
        this.validateForm = this.fb.group({
            old_password: [null, [Validators.required, Validators.minLength(8), Validators.maxLength(16),
            validateCharNum(/(?=.*\d)(?=.*[A-Za-z]).{8,16}/)]],
            new_password: [null, [Validators.required, this.confirmationOldPassValidator, password()]],
            confirm_password: [null, [Validators.required, this.confirmationValidator, password()]],
        });
    }

    // confirm new pass
    confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
        if (!control.value) {
            return { required: true };
        } else if (control.value !== this.validateForm.controls.new_password.value) {
            return { confirm: true, error: true };
        }
        return {};
    }

    updateConfirmValidator(): void {
        /** wait for refresh value */
        Promise.resolve().then(() => this.validateForm.controls.confirm_password.updateValueAndValidity());
    }

    // use old pass
    confirmationOldPassValidator = (control: FormControl): { [s: string]: boolean } => {
        if (!control.value) {
            return { required: true };
        } else if (control.value === this.validateForm.controls.old_password.value) {
            return { confirmNew: true, error: true };
        }
        return {};
    }

    halfSizeValidator = (control: FormControl): { [s: string]: boolean } => {
        if (!control.value) {
            return { required: true };
        } else if (control.value === this.validateForm.controls.old_password.value) {
            return { confirmNew: true, error: true };
        }
        return {};
    }

    updateConfirmNewPassValidator(): void {
        /** wait for refresh value */
        Promise.resolve().then(() => this.validateForm.controls.new_password.updateValueAndValidity());
    }


    submitForm(): void {
        const oldPass = this.validateForm.get('old_password').value;
        const newPass = this.validateForm.get('new_password').value;
        const confirmNewPass = this.validateForm.get('confirm_password').value;
        // console.log(oldPass + ' and ' + newPass + ' and ' + confirmNewPass);
        for (const i in this.validateForm.controls) {
            if (this.validateForm.controls[i]) {
                this.validateForm.controls[i].markAsDirty();
                this.validateForm.controls[i].updateValueAndValidity();
            }
        }
        if (this.validateForm.valid) {
            this.isSpinning = this.authQuery.select(state => state.isSubmit);
            this.authService.changePass(oldPass, newPass, confirmNewPass);
            this.isSpinning = this.authQuery.select(state => state.isSubmit);
        }
    }

    changeShowPass(content: string) {
        if (content === 'old') {
            this.isShowOldPass = !this.isShowOldPass;
        }
        if (content === 'new') {
            this.isShowNewPass = !this.isShowNewPass;
        }
        if (content === 'confirm') {
            this.isShowConfirmPass = !this.isShowConfirmPass;
        }
    }
}
