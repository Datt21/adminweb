import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CategoryIndexComponent } from './index/index.component';
import { CategoryCreateComponent } from './create/create.component';
import { ProductCreateComponent } from '../products/create/create.component';

import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { CategoryQuery } from './state/category.query';
import { CategoryService } from './state/category.service';
import { ProductService } from './state/product.service';
import { CategoryStore } from './state/category.store';
import { FormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ImageCropperModule } from 'ngx-image-cropper';
const routes: Routes = [
    { path: '', pathMatch: 'full', component: CategoryIndexComponent },
];

@NgModule({
    declarations: [
        CategoryIndexComponent,
        CategoryCreateComponent,
        ProductCreateComponent,
    ],
    imports: [
        CommonModule,
        SharedModule,
        RouterModule.forChild(routes),
        NgZorroAntdModule,
        FormsModule,
        DragDropModule,
        ImageCropperModule
    ],
    providers: [
        CategoryQuery,
        CategoryService,
        ProductService,
        CategoryStore
    ],
    exports: [RouterModule]
})
export class FastFoodModule {
}
