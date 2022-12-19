import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from "@angular/forms";
import { NzMessageService, NzModalRef, NzModalService } from "ng-zorro-antd";
import { ImageCroppedEvent } from "ngx-image-cropper";
import { finalize, switchMap, tap } from "rxjs/operators";
import { setHours } from "date-fns";
// import { NotificationCreate } from 'src/app/core/models/notification-create';
// import { NotificationAPI } from 'src/app/core/services/noti.service';
// import { RegionAPI } from 'src/app/core/services/region.service';
import { environment } from "src/environments/environment";
// import * as moment from 'moment-timezone';
import { Constants } from "src/app/shared/models/constants";
import { NoticeListService } from "../../services/notice-list.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-new-or-edit-notice",
  templateUrl: "./new-or-edit-notice.component.html",
  styleUrls: ["./new-or-edit-notice.component.scss"],
})
export class NewOrEditNoticeComponent implements OnInit {
  public idDetail: number;
  constructor(
    private fb: FormBuilder,
    public notiSV: NoticeListService,
    // private regionService: RegionAPI,
    // private notiService: NotificationAPI,
    private modalService: NzModalService,
    private message: NzMessageService,
    public router: Router
  ) {}
  date = null;
  today = new Date();
  timeDefaultValue = setHours(new Date(), 0);
  public isVisible: boolean;
  public validateForm: FormGroup;
  public startTime: Date | null = null;
  public endTime: Date | null = null;
  public endOpen = false;
  public placeHolderImg = "画像ファイルを選択してください";
  public provinces = [];
  public coupons = [];
  public events = [];
  public checkBlankPrefecture = true;
  public checkTitleTypeEmail = true;
  public checkContentTypeEmail = true;
  public isSubmitted: boolean;
  isExceed = false;
  checkTimeOver = false;
  isUploading: boolean;

  // crop image
  imageChangedEvent: Event;
  croppedImage: Blob;
  widthHeightCrop: any;
  isResetCropImage: boolean;
  cacheOldImage: string;
  aspectRatio = environment.aspectRatio;
  resizeToWidth = 0;

  get getNotiType(): any {
    return this.validateForm.get("notificationType").value;
  }
  get getAreaType(): any {
    return this.validateForm.get("area").value;
  }
  get getImage(): any {
    return this.validateForm.get("area").value;
  }
  get getPrefecture(): any {
    const prefectures = this.validateForm.get("province").value;
    if (!prefectures) {
      return false;
    } else {
      if (prefectures.length === 0) {
        return false;
      }
      return true;
    }
  }

  async ngOnInit() {
    if (this.idDetail) {
      this.initForm();
      // await this.initFormEdit();
    } else {
      this.initForm();
    }
    // const response = await this.regionService.get().toPromise();
    // if (response.type === 1) {
    //   this.provinces = response.data;
    // }
    this.widthHeightCrop = {
      width: 0,
      height: 0,
    };
  }

  submitForm() {
    this.isVisible = false;
  }

  registerNoti(isDraft: boolean) {
    this.isSubmitted = true;
    this.checkTitleTypeEmail = true;
    this.checkContentTypeEmail = true;
    this.checkBlankPrefecture = true;
    if (
      new Date(this.validateForm.getRawValue().startTime) >
      new Date(this.validateForm.getRawValue().endTime)
    ) {
      this.checkTimeOver = true;
      return;
    } else {
      this.checkTimeOver = false;
      // const model = this.handleFormValue(
      //   this.validateForm.getRawValue(),
      //   isDraft
      // );
      const model = null;
      if (!model.prefectures) {
        this.checkBlankPrefecture = false;
      }
      if (this.validateForm.valid) {
        if (
          model.title.trim().length === 0 &&
          model.short_content.trim().length === 0 &&
          model.file_url.trim().length === 0
        ) {
          this.showErrorValidator();
        } else {
          if (
            (model.is_region_all === 0 && model.prefectures.length > 0) ||
            model.is_region_all === 1
          ) {
            if (model.notification_type === 6 && model.title.trim() === "") {
              this.checkTitleTypeEmail = false;
            } else if (
              model.notification_type === 6 &&
              model.short_content.trim() === ""
            ) {
              this.checkContentTypeEmail = false;
            }
            if (
              (model.notification_type === 1 &&
                model.content.trim().length > 0) ||
              (model.notification_type === 2 &&
                model.url_web.trim().length > 0) ||
              (model.notification_type === 3 && model.coupon !== null) ||
              (model.notification_type === 5 && model.event !== null) ||
              model.notification_type === 0 ||
              (model.notification_type === 4 && model.user_domain === 1) ||
              (model.notification_type === 6 &&
                this.checkTitleTypeEmail &&
                this.checkContentTypeEmail)
            ) {
              this.showConfirmRegisterPopup(model, this.idDetail);
            }
          } else {
            this.checkBlankPrefecture = false;
          }
        }
      }
    }
  }

  // handleRegister(model: NotificationCreate) {
  //   this.notiSV.showLoader();
  //   if (this.idDetail) {
  //     // Case edit
  //     this.notiService
  //       .editNotification(this.idDetail, model)
  //       .subscribe((response) => {
  //         if (response.type === 1) {
  //           this.message.create("success", "更新処理が完了しました。");
  //           this.modalRef.close(response);
  //         } else {
  //           this.message.create(
  //             "error",
  //             " 作成処理の時はエラーが発生しました。"
  //           );
  //           this.notiSV.showLoader(true);
  //         }
  //       });
  //   } else {
  //     // Case create
  //     this.notiService.createNotification(model).subscribe((response) => {
  //       if (response.type === 1) {
  //         this.message.create("success", "作成処理が完了しました。");
  //         this.modalRef.close(response);
  //       } else {
  //         this.message.create("error", " 作成処理の時はエラーが発生しました。");
  //         this.notiSV.showLoader(true);
  //       }
  //     });
  //   }
  // }

  initForm() {
    this.validateForm = this.fb.group({
      isModeTest: true,
      startTime: [null, [Validators.required]],
      endTime: [null, [Validators.required]],
      userDomain: [0, [Validators.required]],
      gender: new FormGroup(
        {
          isMale: new FormControl(true),
          isFemale: new FormControl(true),
        },
        { validators: this.genderValidator() }
      ),
      age: new FormGroup(
        {
          isUnder20: new FormControl(true),
          isUnder30: new FormControl(true),
          isUnder40: new FormControl(true),
          isUnder50: new FormControl(true),
          isUpper50: new FormControl(true),
        },
        { validators: [this.ageValidator()] }
      ),
      area: ["1", [Validators.required]],
      province: [],
      displayPlace: new FormControl(2),
      file_url: [""],
      title: [""],
      shortcontent: [""],
      notificationType: [null, [Validators.required]],
      content: [""],
      urlWeb: [""],
      coupon: [null],
      event: [null],
      publicFlag: false,
    });
  }

  public genderValidator(): ValidatorFn {
    return (group: FormGroup): ValidationErrors => {
      const control1 = group.controls.isMale;
      const control2 = group.controls.isFemale;
      if (control1.value || control2.value) {
        return null;
      } else {
        return { IsEmpty: true };
      }
    };
  }

  public ageValidator(): ValidatorFn {
    return (group: FormGroup): ValidationErrors => {
      const control1 = group.controls.isUnder20;
      const control2 = group.controls.isUnder30;
      const control3 = group.controls.isUnder40;
      const control4 = group.controls.isUnder50;
      const control5 = group.controls.isUpper50;
      if (
        control1.value ||
        control2.value ||
        control3.value ||
        control4.value ||
        control5.value
      ) {
        return null;
      } else {
        return { IsEmpty: true };
      }
    };
  }

  showConfirmRegisterPopup(model, idDetail): void {
    if (model.status === 0) {
      this.modalService.confirm({
        nzTitle: "<span>登録を確認します。</span>",
        nzContent: "<span>新しいお知らせを上書き保存しますか？ </span>",
        nzCancelText: "キャンセル",
        nzIconType: "question-circle",
        // nzOnOk: () => this.handleRegister(model),
        nzWidth: "416px",
      });
    } else {
      if (idDetail) {
        this.modalService.confirm({
          nzTitle: "<span>登録を確認します。</span>",
          nzContent: "<span>このお知らせを編集しますか？ </span>",
          nzCancelText: "キャンセル",
          nzIconType: "question-circle",
          // nzOnOk: () => this.handleRegister(model),
          nzWidth: "416px",
        });
      } else {
        this.modalService.confirm({
          nzTitle: "<span>登録を確認します。</span>",
          nzContent: "<span>新しいお知らせを登録しますか？ </span>",
          nzCancelText: "キャンセル",
          nzIconType: "question-circle",
          // nzOnOk: () => this.handleRegister(model),
          nzWidth: "416px",
        });
      }
    }
  }

  // async initFormEdit() {
  //   this.notiSV.showLoader();
  //   const response = await this.notiService
  //     .getDetailNotification(this.idDetail)
  //     .toPromise();
  //   const arrayPrefecture = response.data.notification_prefectures.reduce(
  //     (prev, curr) => {
  //       prev.push(...curr.prefectures);
  //       return prev;
  //     },
  //     []
  //   );
  //   if (response.type === 1) {
  //     this.validateForm.patchValue({
  //       isModeTest: response.data.notification.is_mode_test ? true : false,
  //       publicFlag: response.data.notification.is_public ? true : false,
  //       startTime: response.data.notification.start_time,
  //       endTime: response.data.notification.end_time,
  //       userDomain: response.data.notification.user_domain,
  //       displayPlace: response.data.notification.display_place,
  //       title: response.data.notification.title
  //         ? response.data.notification.title
  //         : "",
  //       shortcontent: response.data.notification.short_content
  //         ? response.data.notification.short_content
  //         : "",
  //       content: response.data.notification.content,
  //       notificationType: response.data.notification.notification_type,
  //       area: "" + response.data.notification.is_region_all,
  //       province: arrayPrefecture,
  //       urlWeb: response.data.notification.url_web,
  //       file_url: response.data.notification.file_url
  //         ? response.data.notification.file_url
  //         : "",
  //       coupon: response.data.notification.coupon,
  //       event: response.data.notification.event,
  //     });
  //     // path province

  //     // Path gender
  //     this.validateForm.controls.gender.patchValue({
  //       isMale: response.data.notification.gender.includes("0") ? true : false,
  //       isFemale: response.data.notification.gender.includes("1")
  //         ? true
  //         : false,
  //     });
  //     // Path age
  //     this.validateForm.controls.age.patchValue({
  //       isUnder20: response.data.notification.age.includes("<20")
  //         ? true
  //         : false,
  //       isUnder30: response.data.notification.age.includes("20-29")
  //         ? true
  //         : false,
  //       isUnder40: response.data.notification.age.includes("30-39")
  //         ? true
  //         : false,
  //       isUnder50: response.data.notification.age.includes("40-49")
  //         ? true
  //         : false,
  //       isUpper50: response.data.notification.age.includes(">=50")
  //         ? true
  //         : false,
  //     });
  //   }
  //   this.notiSV.showLoader(true);
  // }

  showErrorValidator() {
    this.modalService.warning({
      nzTitle: "<span>エラーバリデータ</span>",
      nzContent:
        "<span>次の3つの情報のうち少なくとも1つを入力する必要があります:<br/> <ul><li>画像</li><li>タイトル</li><li>短縮内容</li></ul></span>",
      // nzCancelText: "キャンセル",
      nzIconType: "question-circle",
      nzWidth: "416px",
    });
  }

  onChangeDisplayPlace() {
    this.validateForm.controls.notificationType.setValue(null);
    if (this.validateForm.getRawValue().displayPlace === 4) {
      this.validateForm.controls.notificationType.setValue(6);
    }
  }

  onStartChange(): void {
    // this.startTime = this.validateForm.getRawValue().startTime;
    // const startTime = moment(new Date(this.startTime)).format(
    //   Constants.TIMESTAMP_FORMAT
    // );
    // const isModeTest = this.validateForm.getRawValue().isModeTest;
    // this.notiService
    //   .getListCouponNotification({ startTime, isModeTest })
    //   .subscribe((response) => {
    //     if (response.type === 1) {
    //       this.coupons = response.data;
    //     }
    //   });
    // this.notiService
    //   .getListEventNotification({ startTime, isModeTest })
    //   .subscribe((response) => {
    //     if (response.type === 1) {
    //       this.events = response.data;
    //     }
    //   });
  }

  onEndChange(date: Date): void {
    this.endTime = date;
    if (
      new Date(this.validateForm.getRawValue().startTime) >
      new Date(this.validateForm.getRawValue().endTime)
    ) {
      this.checkTimeOver = true;
    } else {
      this.checkTimeOver = false;
    }
  }

  onChangeNotiType() {
    this.isSubmitted = false;
  }

  handleStartOpenChange(open: boolean): void {
    if (!open) {
      this.endOpen = true;
    }
  }

  handleEndOpenChange(open: boolean): void {
    this.endOpen = open;
  }

  // handleFormValue(formValue: any, isDraft: boolean): NotificationCreate {
  //   const resData: NotificationCreate = {
  //     is_mode_test: +formValue.isModeTest,
  //     start_time: formValue.startTime,
  //     end_time: formValue.endTime,
  //     user_domain: +formValue.userDomain,
  //     gender: null,
  //     age: null,
  //     is_region_all: +formValue.area,
  //     display_place: null,
  //     notification_type: +formValue.notificationType,
  //     file_url: formValue.file_url,
  //     title: formValue.title,
  //     content: formValue.content,
  //     coupon: formValue.coupon,
  //     event: formValue.event,
  //     short_content: formValue.shortcontent,
  //     status: isDraft ? 0 : 1,
  //     url_web: formValue.urlWeb,
  //     is_public: formValue.publicFlag ? 1 : 0,
  //   };

  //   // custom province
  //   if (formValue.province) {
  //     let prefecturesCustom: string[] = [];
  //     const regions = this.provinces.map((e) => e.title);
  //     formValue.province.forEach((element) => {
  //       const idx = regions.indexOf(element);
  //       if (idx >= 0) {
  //         const prefectures = this.provinces[idx].children.map((e) => e.value);
  //         prefecturesCustom = prefecturesCustom.concat(prefectures);
  //       } else {
  //         prefecturesCustom.push(element);
  //       }
  //     });
  //     resData.prefectures = prefecturesCustom;
  //   }

  //   // parse gender
  //   const arrGender: string[] = [];
  //   if (formValue.gender.isMale) {
  //     arrGender.push("0");
  //   }
  //   if (formValue.gender.isFemale) {
  //     arrGender.push("1");
  //   }
  //   if (arrGender.length > 0) {
  //     resData.gender = arrGender.join(",");
  //   }

  //   // parse age
  //   const arrAge: string[] = [];
  //   if (formValue.age.isUnder20) {
  //     arrAge.push("<20");
  //   }
  //   if (formValue.age.isUnder30) {
  //     arrAge.push("20-29");
  //   }
  //   if (formValue.age.isUnder40) {
  //     arrAge.push("30-39");
  //   }
  //   if (formValue.age.isUnder50) {
  //     arrAge.push("40-49");
  //   }
  //   if (formValue.age.isUpper50) {
  //     arrAge.push(">=50");
  //   }
  //   if (arrAge.length > 0) {
  //     resData.age = arrAge.join(",");
  //   }

  //   resData.display_place = formValue.displayPlace;

  //   return resData;
  // }

  // crop image
  onChange(event: any): void {
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

      // get width, height image to crop
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const img = new Image();
        img.src = reader.result as string;
        img.onload = () => {
          const height = img.naturalHeight;
          const width = img.naturalWidth;
          this.resizeToWidth = width;
          if (width > height) this.resizeToWidth = height;
        };
      };

      this.placeHolderImg = file.name;
      this.imageChangedEvent = event;
      this.isResetCropImage = false;
    }
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.file;
    this.widthHeightCrop.width = event.width;
    this.widthHeightCrop.height = event.height;
  }

  handleUpload() {
    // upload
    // this.isExceed = false;
    // let key = null;
    // this.isUploading = true;
    // this.notiService
    //   .getUploadUrl()
    //   .pipe(
    //     tap((response) => (key = response.data.key)),
    //     switchMap((response) =>
    //       this.notiService.putUpload(response.data.upload, this.croppedImage)
    //     ),
    //     finalize(() => {
    //       this.isUploading = false;
    //       this.isResetCropImage = true;
    //     })
    //   )
    //   .subscribe(() => {
    //     this.validateForm.patchValue({
    //       file_url: `${environment.domain}` + key,
    //     });
    //   });
  }

  cancelCrop(upload: any) {
    this.imageChangedEvent = null;
    this.croppedImage = null;
    this.placeHolderImg = null;
    this.isResetCropImage = true;

    // reset input file upload
    upload.value = null;
    // reset old image
    this.validateForm.patchValue({
      image: this.cacheOldImage,
      file_url: "",
    });
  }

  back() {
    this.router.navigate(["/admin/list-notice"]);
  }
}
