import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { AuthGuard } from './core/guards/auth.guard';
import { RedirectIfAuthenticatedGuard } from './core/guards/redirect-if-authenticated.guard';
import { LoginComponent } from './auth/login/login.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

const routes: Routes = [
  {
    path: 'admin',
    component: LayoutComponent,
    canActivateChild: [AuthGuard],
    canActivate: [AuthGuard],
    children: [
      { path: 'categories/shops/:id', loadChildren: () => import('./categories/categories.module').then(m => m.FastFoodModule) },
      { path: 'shops/index', loadChildren: () => import('./shops/shop.module').then(m => m.StoreModule) },
      { path: '', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) },
    ],
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivateChild: [RedirectIfAuthenticatedGuard],
    canActivate: [RedirectIfAuthenticatedGuard],
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/login'
  },
  {
    path: '**',
    component: PageNotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    preloadingStrategy: PreloadAllModules
  })],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
