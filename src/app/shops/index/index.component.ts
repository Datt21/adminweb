import { Component, OnInit, OnDestroy, EventEmitter } from "@angular/core";
import { Shop } from "src/app/core/models/shop";
import { ShopQuery } from "../state/shop.query";
import { ShopService } from "../state/shop.service";
import { Type, Types } from "src/app/core/models/type";
import { ShopStore } from "../state/shop.store";
import { NzModalService } from "ng-zorro-antd";
import { Observable } from "rxjs";
import { AuthQuery } from "src/app/auth/state/auth.query";
import { Router } from "@angular/router";

@Component({
  selector: "app-shop-index",
  templateUrl: "./index.component.html",
  styleUrls: ["./index.component.scss"],
})
export class ShopIndexComponent implements OnInit, OnDestroy {
  shops: Shop[];
  types: Type[];
  storeTypesOptions: Type[];
  storeTypeRadio: number;
  cacheStoreTypeRadio: number;
  dataConfirm: any;
  isSubmit$: Observable<boolean>;
  isSubmitConfirm$: Observable<boolean>;
  isSubmit: boolean;
  pagination: any;
  valueFormSearch: any;
  current: EventEmitter<number>;
  isSpinning: Observable<boolean>;
  token: string;
  constructor(
    private shopQuery: ShopQuery,
    private shopService: ShopService,
    private shopStore: ShopStore,
    public router: Router,
    private modalService: NzModalService,
    private authQuery: AuthQuery
  ) {
    this.shopQuery.selectAll().subscribe((x) => (this.shops = x));
    this.shopQuery
      .select((state) => state.pagination)
      .subscribe((x) => (this.pagination = x));
    this.shopQuery
      .select((state) => state.types)
      .subscribe((x) => (this.types = x));
    this.storeTypesOptions = Types;
    this.shopQuery
      .select((state) => state.isSubmit)
      .subscribe((x) => {
        this.isSubmit = x;
        this.storeTypeRadio = null;
      });
  }

  ngOnInit() {
    this.authQuery
      .select((state) => state.token)
      .subscribe((data) => {
        this.token = data;
      });
    if (!this.token) {
      this.router.navigate(["/login"]);
    }
  }

  /** show modal confirm */
  showConfirm(data: any, type: number): void {
    if (type === 1) {
      this.showConfirmPopupCheckRadio();
    } else {
      this.showConfirmPopupCheckbox();
    }
    this.dataConfirm = data;
  }

  /** handle oke confirm */
  handleOk(): void {
    if (this.dataConfirm !== "checkAllVertical") {
      this.shopService.updateShop(
        this.dataConfirm.shop,
        this.dataConfirm.newData
      );
      this.storeTypeRadio = null;
    } else {
      this.cacheStoreTypeRadio = this.storeTypeRadio;
      const clone = [...this.shops];
      const input = { stores: [] };
      input.stores = clone
        .filter((x) => {
          if (x.storeType !== this.storeTypeRadio) {
            return x;
          }
        })
        .map((x) => {
          return {
            storeId: x.id,
            storeType: this.storeTypeRadio,
          };
        });
      this.shopService.updateStoreTypeShops(input);
    }
  }

  /** handle cancel confirm */
  handleCancel(): void {
    if (this.dataConfirm !== "checkAllVertical") {
      // reset state old of checkbox
      this.shopStore.update(this.dataConfirm.shop.id, this.dataConfirm.oldData);
    } else {
      // reset state old of group radio
      this.storeTypeRadio = this.cacheStoreTypeRadio;
    }
  }

  /** show modal confirm for checkbox */
  showConfirmPopupCheckbox(): void {
    this.modalService.confirm({
      nzTitle: "<span>変更確認</span>",
      nzContent: "<span>変更してもよろしいですか?</span>",
      nzCancelText: "キャンセル",
      nzIconType: "question-circle",
      nzOnOk: () => this.handleOk(),
      nzOnCancel: () => this.handleCancel(),
      nzWidth: "416px",
    });
  }

  /** show modal confirm for radio group */
  showConfirmPopupCheckRadio(): void {
    this.modalService.confirm({
      nzTitle:
        "<span>店舗タイプの変更によって、該当店舗の商品設定が変更になる可能性があります。</span>",
      nzContent: "<span>変更してもよろしいですか?</span>",
      nzCancelText: "キャンセル",
      nzIconType: "warning",
      nzOnOk: () => this.handleOk(),
      nzOnCancel: () => this.handleCancel(),
      nzWidth: "416px",
    });
  }

  /** reset state for shop store */
  ngOnDestroy() {
    this.shopService.resetStore();
  }
  onIndexChange(page) {
    this.isSpinning = this.shopQuery.select((state) => state.isSubmit);
    let req: any;
    req = this.valueFormSearch;
    req.pageNumber = page;
    this.shopService.searchShop(req);
    this.isSpinning = this.shopQuery.select((state) => state.isSubmit);
  }
  valueForm(data) {
    this.isSpinning = this.shopQuery.select((state) => state.isSubmit);
    this.valueFormSearch = data;
    this.isSpinning = this.shopQuery.select((state) => state.isSubmit);
  }
}
