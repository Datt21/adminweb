
import { Component, OnInit } from '@angular/core';
import { CategoryQuery } from '../state/category.query';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { Category } from 'src/app/core/models/category';
import { CategoryService } from '../state/category.service';
import { Type } from 'src/app/core/models/type';
import { CategoryAPI } from 'src/app/core/services/category.service';
import { switchMap, tap, finalize } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { NzModalService } from 'ng-zorro-antd';
import { htmlValidator } from 'src/app/shared/validators/html-validation.directive';
import { ImageCroppedEvent } from 'ngx-image-cropper';
@Component({
    selector: 'app-category-create',
    templateUrl: './create.component.html',
    styleUrls: ['./create.component.scss']
})
export class CategoryCreateComponent implements OnInit {

    isVisible: boolean;
    isSubmit$: Observable<boolean>;
    validateForm: FormGroup;
    category: Category;
    type: Type;
    isUploading: boolean;
    isExceed = false;
    placeholder: string;

    // crop image
    imageChangedEvent: Event;
    croppedImage: Blob;
    widthHeightCrop: any;
    isResetCropImage: boolean;
    cacheOldImage: string;
    aspectRatio = environment.aspectRatio;
    resizeToWidth = environment.resizeToWidth;
    constructor(
        private fb: FormBuilder,
        private categoryQuery: CategoryQuery,
        public categoryService: CategoryService,
        public categoryAPI: CategoryAPI,
        private modalService: NzModalService
    ) {
        this.validateForm = this.fb.group({
            name: [null, [Validators.required, Validators.maxLength(30), htmlValidator(/<\/?[a-z][\s\S]*>/i)]],
            image: [null, [Validators.required]],
            storeType: [null, [Validators.required]]
        });
    }

    ngOnInit() {
        this.categoryQuery.select(state => state.isShowCategoryModal).subscribe(data => {
            this.isVisible = data;
            if (!data) {
                this.validateForm.reset();
                this.croppedImage = null;
                this.imageChangedEvent = null;
                this.placeholder = null;
            }
        });
        this.isSubmit$ = this.categoryQuery.select(state => state.isSubmit);
        this.categoryQuery.select(state => state.type).subscribe((data) => {
            this.type = data;
        });
        this.categoryQuery.select(state => state.category).subscribe((data) => {
            this.category = data;
            this.validateForm.patchValue({
                name: data && data.name ? data.name : '',
                image: data && data.image ? data.image : '',
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
        // submit form
        if (this.category) {
            this.categoryService.update(this.category.id, this.validateForm.value);
            if (this.isExceed) {
                this.isExceed = false;
            }
        } else {
            this.categoryService.save(this.validateForm.value);
        }
    }

    /** trimSpace */
    trimSpace(): void {
        this.validateForm.patchValue({
            name: this.validateForm.value.name.trim(),
            image: this.validateForm.value.image.trim(),
        });
    }


    /** showConfirm modal */
    showConfirm(): void {
        this.validateForm.patchValue({ storeType: this.type.id });
        // validate error
        for (const i in this.validateForm.controls) {
            if (this.validateForm.controls[i]) {
                this.validateForm.controls[i].markAsDirty();
                this.validateForm.controls[i].updateValueAndValidity();
            }
        }
        // trim space
        if (this.validateForm.get('name').value) {
            this.trimSpace();
        }
        // show confirm
        if (this.validateForm.valid) {
            this.showConfirmPopup();
        }
    }

    showConfirmPopup(): void {
        this.modalService.confirm({
            nzTitle: '<span>登録確認</span>',
            nzContent: '<span>カテゴリ情報を保存しますか？ </span>',
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
        let key = null;
        this.isUploading = true;
        this.categoryAPI.getUploadUrl().pipe(
            tap(response => key = response.data.key),
            switchMap(response => this.categoryAPI.putUpload(response.data.upload, this.croppedImage)),
            finalize(() => {this.isUploading = false; this.isResetCropImage = true; })
        ).subscribe(() => {
            this.validateForm.patchValue({
                image: key
            });
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
}
