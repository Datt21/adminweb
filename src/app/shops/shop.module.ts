import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShopIndexComponent } from './index/index.component';
import { ShopSearchComponent } from './search/search.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { ShopQuery } from './state/shop.query';
import { ShopService } from './state/shop.service';
import { ShopStore } from './state/shop.store';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
    { path: '', pathMatch: 'full', component: ShopIndexComponent }
];

@NgModule({
    declarations: [
        ShopIndexComponent,
        ShopSearchComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        RouterModule.forChild(routes),
        NgZorroAntdModule,
        FormsModule,
        ReactiveFormsModule.withConfig({warnOnNgModelWithFormControl: 'never'})
    ],
    providers: [
        ShopQuery,
        ShopService,
        ShopStore
    ],
    exports: [RouterModule]
})
export class StoreModule {
}
