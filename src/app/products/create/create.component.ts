
import { Component, OnInit } from '@angular/core';
import { CategoryQuery } from '../../categories/state/category.query';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Product } from 'src/app/core/models/product';
import { ProductService } from 'src/app/categories/state/product.service';
import { Category } from 'src/app/core/models/category';
import { Type } from 'src/app/core/models/type';
import { ProductAPI } from 'src/app/core/services/product.service';
import { CategoryStore } from 'src/app/categories/state/category.store';
import { NzModalService } from 'ng-zorro-antd';
import { switchMap, tap, finalize } from 'rxjs/operators';
import { htmlValidator } from 'src/app/shared/validators/html-validation.directive';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-product-create',
    templateUrl: './create.component.html',
    styleUrls: ['./create.component.scss']
})
export class ProductCreateComponent implements OnInit {
    isVisible: boolean;
    isSubmit$: Observable<boolean>;
    isSearchPrice$: Observable<boolean>;
    category: Category;
    validateForm: FormGroup;
    product: Product;
    type: Type;
    isConfirm: boolean;
    isUploading: boolean;
    isExceed = false;
    placeholder: string;
    aspectRatio = environment.aspectRatio;
    resizeToWidth = environment.resizeToWidth;
    // crop image
    imageChangedEvent: Event;
    croppedImage: Blob;
    widthHeightCrop: any;
    isResetCropImage: boolean;
    cacheOldImage: string;

    constructor(
        private fb: FormBuilder,
        private categoryQuery: CategoryQuery,
        public productService: ProductService,
        public productApi: ProductAPI,
        private categoryStore: CategoryStore,
        private modalService: NzModalService
    ) {
        this.validateForm = this.fb.group({
            name: [null, [Validators.required, htmlValidator(/<\/?[a-z][\s\S]*>/i)]],
            productId: [null, [Validators.required, htmlValidator(/<\/?[a-z][\s\S]*>/i)]],
            image: [null, [Validators.required]],
            description: [null, [Validators.required, htmlValidator(/<\/?[a-z][\s\S]*>/i)]],
            fastFoodCategoryId: [null, [Validators.required]]
        });
    }

    ngOnInit() {
        this.categoryQuery.select(state => state.isShowProductModal).subscribe(data => {
            this.isVisible = data;
            if (!data) {
                this.validateForm.reset();
                this.croppedImage = null;
                this.imageChangedEvent = null;
                this.placeholder = null;
            }
        });
        this.isSubmit$ = this.categoryQuery.select(state => state.isSubmit);
        this.isSearchPrice$ = this.categoryQuery.select(state => state.isSearchPrice);

        this.categoryQuery.select(state => state.category).subscribe((data) => {
            this.category = data;
        });

        this.categoryQuery.select(state => state.type).subscribe((data) => {
            this.type = data;
        });

        this.categoryQuery.select(state => state.product).subscribe((product) => {
            this.product = product;
            this.validateForm.patchValue({
                name: product && product.name ? product.name : '',
                productId: product && product.productId ? product.productId : '',
                image: product && product.image ? product.image : '',
                description: product && product.description ? product.description : '',
                price: product && product.price ? product.price : '',
            });
            // cache oldImage use when cancel crop
            this.cacheOldImage = this.validateForm.value.image;
        });
        this.widthHeightCrop = {
            width: 0,
            height: 0,
        };
        this.categoryQuery.select(state => state.isCropImage).subscribe((data) => {
            this.isResetCropImage = data;
        });
    }

    submitForm(): void {
        // trim space
        this.trimSpace();

        // submit form
        if (this.product && this.product.id) {
            this.productService.update(this.validateForm.value, this.product.id, this.product.fastFoodCategoryId);
            if (this.isExceed) {
                this.isExceed = false;
            }
        } else {
            this.productService.save(this.validateForm.value);
        }
    }

    /** searchPrice */
    searchPrice(productId: string): void {
        if (!productId) {
            this.validateForm.get('productId').markAsDirty();
            this.validateForm.get('productId').updateValueAndValidity();
            return;
        }

        if (!this.validateForm.get('productId').valid) {
            return;
        }
        // submit
        productId = productId.trim();
        this.validateForm.patchValue({ productId });
        if (productId.length) {
            this.categoryStore.update({ isSearchPrice: true });
            this.productApi.searchPrice(productId).subscribe(x => {
                const clone = { ...this.product, price: x.data.price, name: x.data.name, productId: this.validateForm.value.productId };
                this.categoryStore.update({ product: clone, isSearchPrice: false });
            }, error => {
                this.categoryStore.update({ isSearchPrice: false });
            });
        }
    }


    /** trim space */
    trimSpace(): void {
        this.validateForm.patchValue({
            name: this.validateForm.value.name.trim(),
            productId: this.validateForm.value.productId.trim(),
            image: this.validateForm.value.image.trim(),
            description: this.validateForm.value.description.trim(),
        });
    }

    /** showConfirm modal */
    showConfirm(): void {
        this.validateForm.patchValue({ fastFoodCategoryId: this.category.id });
        // validate error
        for (const i in this.validateForm.controls) {
            if (this.validateForm.controls[i]) {
                this.validateForm.controls[i].markAsDirty();
                this.validateForm.controls[i].updateValueAndValidity();
            }
        }
        // trim space
        this.trimSpace();
        // show confirm
        if (this.validateForm.valid) {
            this.showConfirmPopup();
        }
    }

    showConfirmPopup(): void {
        this.modalService.confirm({
            nzTitle: '<span>登録確認</span>',
            nzContent: '<span>商品情報を保存しますか？</span>',
            nzCancelText: 'キャンセル',
            nzIconType: 'question-circle',
            nzOnOk: () => this.submitForm(),
            nzWidth: '416px',
        });
    }


    // crop image
    fileChangeEvent(event: any): void {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];

            if (environment.fileTypes) {
                let allow = false;
                environment.fileTypes.forEach((type) => {
                    if (type === file.type) {
                        allow = true;
                    }
                });
                if (!allow) {
                    this.isExceed = true;
                    return;
                }
            }

            this.placeholder = file.name;
            this.imageChangedEvent = event;
            this.isResetCropImage = false;
        }
    }
    imageCropped(event: ImageCroppedEvent) {
        this.croppedImage = event.file;
        this.widthHeightCrop.width = Math.abs(event.cropperPosition.x1 - event.cropperPosition.x2);
        this.widthHeightCrop.height = Math.abs(event.cropperPosition.y1 - event.cropperPosition.y2);
    }

    /** upload image */
    handleUpload(): void {
        // upload
        this.isExceed = false;
        this.isUploading = true;
        let key = null;
        this.productApi.getUploadUrl().pipe(
            tap(response => key = response.data.key),
            switchMap(response => this.productApi.putUpload(response.data.upload, this.croppedImage)),
            finalize(() => { this.isUploading = false; this.isResetCropImage = true; })
        ).subscribe(() => {
            this.validateForm.patchValue({
                image: key
            });
            this.isUploading = false;
        });
    }
    cancelCrop(upload: any) {
        this.imageChangedEvent = null;
        this.croppedImage = null;
        this.placeholder = null;
        this.isResetCropImage = true;

        // reset input file upload
        upload.value = null;
        // reset old image
        this.validateForm.patchValue({
            image: this.cacheOldImage
        });
    }

    roundingNumber(num: string) {
        const numberConvert = Number(num);
        return Math.round(numberConvert);
    }
}
