import { Component, OnInit, QueryList, ViewChildren } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { NzModalService } from "ng-zorro-antd";
import { interval, Subscription } from "rxjs";
import { BaseSearchComponent } from "src/app/shared/components/page-page/base-list.component";
import { NoticeDataSelectBox } from "src/app/shared/contants/notice-select-box";
import { NotiStateStatus } from "src/app/shared/enums/notice-state-status.enum";
import { Constants } from "src/app/shared/models/constants";
import { IPager } from "src/app/shared/models/IPager";
import { PagerComponent } from "src/app/shared/pagers/pager/pager.component";
import { Utilities } from "src/app/shared/services/utilities.service";
import { Notice } from "../../models/notice.model";
import { SearchNotice } from "../../models/search-notice.model";
import { NoticeListService } from "../../services/notice-list.service";

@Component({
  selector: "app-list-notice",
  templateUrl: "./list-notice.component.html",
  styleUrls: ["./list-notice.component.scss"],
})
export class ListNoticeComponent
  extends BaseSearchComponent<SearchNotice, Notice>
  implements OnInit
{
  @ViewChildren(PagerComponent) pagers: QueryList<PagerComponent>;
  inputSearch: SearchNotice = new SearchNotice();
  limit = 20;
  page = 0;
  total = 0;
  notiListSubscription: Subscription;
  notiStateStatus: { [key in NotiStateStatus]: string } = {
    [NotiStateStatus.INPROGRESS]: "処理中",
    [NotiStateStatus.FAILED]: "失敗",
    [NotiStateStatus.COMPLETED]: "完了",
  };
  notifications: Notice[];
  validateForm: FormGroup;
  publicFlagData: any;
  userDomainData: any;
  typeData: any;
  searchParams: any;
  displayPlaceListData: any;

  constructor(
    private fb: FormBuilder,
    public noticeListService: NoticeListService,
    public common: Utilities,
    public router: Router,
    private modalService: NzModalService
  ) {
    super(common, noticeListService, SearchNotice);
    this.publicFlagData = NoticeDataSelectBox.publicFlag;
    this.userDomainData = NoticeDataSelectBox.userDomain;
    this.typeData = NoticeDataSelectBox.type;
    this.displayPlaceListData = NoticeDataSelectBox.type;
    this.inputSearch.page = 0;
    this.inputSearch.limit = 20;
  }

  async ngOnInit() {
    await this.pagerChanges({
      page: this.inputSearch.page + 1,
      limit: this.inputSearch.limit,
    });
    if (this.notifications.length > 0) {
      if (this.notifications.some((e) => e.state === 0)) {
        this.notiListSubscription = interval(30000).subscribe(async (x) => {
          if (!this.notifications.some((e) => e.state === 0)) {
            this.notiListSubscription.unsubscribe();
          } else {
            await this.pagerChanges();
          }
        });
      } else {
        if (this.notiListSubscription) {
          this.notiListSubscription.unsubscribe();
          await this.pagerChanges();
        }
      }
    }
  }

  async ngOnDestroy() {
    if (this.notiListSubscription) {
      this.notiListSubscription.unsubscribe();
    }
  }

  async pagerChanges(pageInfo?: IPager): Promise<void> {
    this.inputSearch.page = pageInfo
      ? pageInfo.page
      : this.pagers.first.pagerInfo.currentPage;
    this.inputSearch.limit = pageInfo
      ? pageInfo.limit
      : this.pagers.first.pagerInfo.pageSize;

    // sync other pager value
    if (this.pagers) {
      this.pagers.forEach((pager) => {
        pager.pageSize = this.inputSearch.limit;
        pager.pagerInfo.currentPage = this.inputSearch.page;
      });
    }
    await this.loadData();
    const $this = this;
    setTimeout(() => {
      $this.pagers.forEach((pager) => {
        pager.refresh();
      });
    });
  }

  async loadData() {
    this.noticeListService.showLoader();
    const response = await this.noticeListService
      .getListNotification(this.inputSearch)
      .toPromise();
    if (response && response.data) {
      this.total = response.meta;
      this.notifications = this.convertData(response.data);
    } else {
      this.total = 0;
      this.notifications = [];
    }
    this.noticeListService.showLoader(true);
  }

  convertData(notifications) {
    return notifications.map((x) => {
      x.switch_public_value = x.is_public === 0 ? false : true;
      const userDomain = this.userDomainData.find(
        (y) => y.value === x.userDomain
      );

      if (userDomain) {
        x.userDomain = userDomain.label;
      }

      const disPlayPlace = this.displayPlaceListData.find(
        (y) => y.value === x.displayPlace
      );

      if (disPlayPlace) {
        x.displayPlace = disPlayPlace.label;
      }

      const type = this.typeData.find((y) => y.value === x.notificationType);

      if (type) {
        x.notificationType = type.label;
      }

      return x;
    });
  }

  async searchForm(params) {
    this.inputSearch.title = params.title;
    this.inputSearch.notificationType = params.notificationType;
    this.inputSearch.publicFlag = params.publicFlag;
    this.inputSearch.userDomain = params.userDomain;
    await this.pagerChanges({
      page: 1,
      limit: 20,
    });
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
    this.validateForm.controls.userDomain.setValue(1);
  }

  switchVisible(id: number, e: boolean) {
    this.showConfirmPopup(id, e);
  }

  showConfirmPopup(id: number, val: boolean): void {
    const value = val ? 1 : 0;
    if (value === 1) {
      this.modalService.confirm({
        nzTitle: "<span>更新を確認します</span>",
        nzContent: "<span>このお知らせを「公開」に変更しますか？ </span>",
        nzCancelText: "キャンセル",
        nzIconType: "question-circle",
        nzOnCancel: () => this.pagerChanges(),
        nzOnOk: () => this.updatePublicFlag(id, value),
        nzWidth: "416px",
      });
    } else {
      this.modalService.confirm({
        nzTitle: "<span>更新を確認します</span>",
        nzContent: "<span>このお知らせを「非公開」に変更しますか？</span>",
        nzCancelText: "キャンセル",
        nzIconType: "question-circle",
        nzOnCancel: () => this.pagerChanges(),
        nzOnOk: () => this.updatePublicFlag(id, value),
        nzWidth: "416px",
      });
    }
  }

  updatePublicFlag(id: number, value: number) {
    this.noticeListService.showLoader();
    this.noticeListService
      .updateStatusFlag(id, {
        publicFlag: value,
      })
      .subscribe((res) => {
        this.noticeListService.showLoader(true);
      });
  }

  deleteNotice(id) {
    this.modalService.confirm({
      nzTitle: "<span>更新を確認します</span>",
      nzContent: "<span>このお知らせを削除しますか？</span>",
      nzCancelText: "キャンセル",
      nzIconType: "question-circle",
      nzOnOk: () => this.handleDeleteNoti(id),
      nzWidth: "416px",
    });
  }

  // openDetail(id: number) {
  //   this.router.navigate(["/admin/notifications/noti-setting/" + id], {
  //     queryParams: { isDetail: true },
  //   });
  // }

  onEditNotice(id: number) {
    this.router.navigate(["/admin/list-notice/edit/" + id]);
  }

  async handleDeleteNoti(id) {
    this.noticeListService.showLoader();
    const result = await this.noticeListService.deleteNotice(id);
    if (result.type === 1) {
      this.pagerChanges();
    }
    this.noticeListService.showLoader(true);
  }

  btnClearClick() {
    throw new Error("Method not implemented.");
  }
  trackByFn(index: any, item: any) {
    throw new Error("Method not implemented.");
  }
}
