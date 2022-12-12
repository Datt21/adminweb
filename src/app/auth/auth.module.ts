import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { SharedModule } from '../shared/shared.module';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { FormsModule } from '@angular/forms';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
const routes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'change-password', component: ChangePasswordComponent },
    { path: '', pathMatch: 'full', redirectTo: '/admin/' },
];

@NgModule({
    declarations: [ChangePasswordComponent, HomeComponent, LoginComponent],
    imports: [
        CommonModule,
        SharedModule,
        RouterModule.forChild(routes),
        NgZorroAntdModule,
        FormsModule
    ],
    exports: [RouterModule]
})
export class AuthModule {
}
