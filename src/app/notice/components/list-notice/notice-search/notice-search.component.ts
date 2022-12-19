import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { NzModalService } from "ng-zorro-antd";
import { Notice } from "src/app/notice/models/notice.model";
import { NoticeDataSelectBox } from "src/app/shared/contants/notice-select-box";

@Component({
  selector: "app-notice-search",
  templateUrl: "./notice-search.component.html",
  styleUrls: ["./notice-search.component.scss"],
})
export class NoticeSearchComponent implements OnInit {
  validateForm: FormGroup;
  @Output() notificationForm = new EventEmitter<any>();
  @Output() searchParams = new EventEmitter<Notice>();
  publicFlagData: any[];
  userDomainData: any[];
  typeData: any[];
  displayPlaceListData: any[];
  constructor(
    private fb: FormBuilder,
    private modalSV: NzModalService,
    // public notiSV: NotificationService,
    public router: Router
  ) {
    this.publicFlagData = NoticeDataSelectBox.publicFlag;
    this.userDomainData = NoticeDataSelectBox.userDomain;
    this.typeData = NoticeDataSelectBox.type;
    this.displayPlaceListData = NoticeDataSelectBox.type;
  }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.validateForm = this.fb.group({
      publicFlag: 2,
      userDomain: null,
      title: "",
      notificationType: null,
    });
  }

  submitForm() {
    for (const i in this.validateForm.controls) {
      if (this.validateForm.controls[i]) {
        this.validateForm.controls[i].markAsDirty();
        this.validateForm.controls[i].updateValueAndValidity();
      }
    }
    // trim space
    this.trimSpace();
    this.searchParams.emit(this.validateForm.value);
  }

  trimSpace(): void {
    this.validateForm.patchValue({
      title: this.validateForm.value.title
        ? this.validateForm.value.title.trim()
        : "",
    });
  }

  resetForm() {
    this.validateForm.reset();
    this.validateForm.controls.publicFlag.setValue(2);
  }

  // router path
  async btnAddNotice() {
    this.router.navigate(["admin/list-notice/add"]);
  }
}
