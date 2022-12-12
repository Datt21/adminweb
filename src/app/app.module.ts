import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IconsProviderModule } from './icons-provider.module';
import { ja_JP, NgZorroAntdModule, NZ_I18N, NzConfig, NZ_CONFIG  } from 'ng-zorro-antd';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { registerLocaleData } from '@angular/common';
import ja from '@angular/common/locales/ja';
import { AkitaNgDevtools } from '@datorama/akita-ngdevtools';
import { environment } from '../environments/environment';
import { ServiceWorkerModule } from '@angular/service-worker';
import { LayoutComponent } from './layout/layout.component';
import { AuthModule } from './auth/auth.module';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { httpInterceptorProviders } from './core/interceptors';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { NzGridModule } from 'ng-zorro-antd/grid';

const ngZorroConfig: NzConfig = {
    notification: { nzDuration: 5000 }
};

registerLocaleData(ja);

@NgModule({
    declarations: [
        AppComponent,
        LayoutComponent,
        PageNotFoundComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        AuthModule,
        IconsProviderModule,
        NgZorroAntdModule,
        HttpClientModule,
        BrowserAnimationsModule,
        environment.production ? [] : AkitaNgDevtools.forRoot(),
        ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
        FormsModule,
        ReactiveFormsModule.withConfig({warnOnNgModelWithFormControl: 'never'}),
        NzGridModule
    ],
    providers: [
        { provide: NZ_I18N, useValue: ja_JP },
        { provide: NZ_CONFIG, useValue: ngZorroConfig },
        httpInterceptorProviders,
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
