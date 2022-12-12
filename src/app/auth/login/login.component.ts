import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../state/auth.service';
import { AuthQuery } from '../state/auth.query';
import { Observable } from 'rxjs';
import { validateMail } from 'src/app/shared/validators/html-validation.directive';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  validateForm: FormGroup;
  isSpinning: Observable<boolean>;
  constructor(private fb: FormBuilder, public router: Router, private authService: AuthService, private authQuery: AuthQuery) { }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      email: [null, [Validators.required, Validators.maxLength(255), validateMail(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/)]],
      password: [null, [Validators.required, Validators.maxLength(16), Validators.minLength(8)]],
    });
  }

  submitForm() {
    // validate error
    for (const i in this.validateForm.controls) {
      if (this.validateForm.controls[i]) {
        this.validateForm.controls[i].markAsDirty();
        this.validateForm.controls[i].updateValueAndValidity();
      }
    }
    // trim space
    if (this.validateForm.get('email').value) {
      this.trimSpace();
    }
    if (this.validateForm.valid) {
      this.isSpinning = this.authQuery.select(state => state.isSubmit);
      this.authService.login(this.validateForm.value.email, this.validateForm.value.password);
      this.isSpinning = this.authQuery.select(state => state.isSubmit);
    }
  }
  /** trimSpace */
  trimSpace(): void {
    this.validateForm.patchValue({
      email: this.validateForm.value.email.trim(),
    });
  }
}
