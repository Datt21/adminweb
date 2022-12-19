import { Component, OnInit } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Type, Types } from "../core/models/type";
import { ActivatedRoute, Router } from "@angular/router";
import { NzModalService } from "ng-zorro-antd";
import { AuthStore } from "../auth/state/auth.store";

@Component({
  selector: "app-layout",
  templateUrl: "./layout.component.html",
  styleUrls: ["./layout.component.scss"],
})
export class LayoutComponent implements OnInit {
  isCollapsed = false;
  user$: BehaviorSubject<any>;
  types: Type[];
  userName: String;

  constructor(
    private activeRoute: ActivatedRoute,
    public router: Router,
    private modalService: NzModalService,
    private authStore: AuthStore
  ) {
    this.types = Types;
    // this.userName = this.authStore.getValue().user.name;
    this.user$ = new BehaviorSubject<any>({
      photoUrl: "laal",
      displayName: "admin",
    });
  }

  ngOnInit(): void {
    // todo
  }
  convertUrl(url: string): string {
    let nameHeader: string;
    nameHeader = "";
    const nameFF = "向け商品管理";
    if (url === "/admin/change-password") {
      nameHeader = "パスワード変更";
    } else if (url === "/admin/shops/index") {
      nameHeader = "店舗設定";
    } else if (url === "/admin/list-notice") {
      nameHeader = "お知らせ";
    } else if (url === "/admin/categories/shops/1") {
      nameHeader = "ミニストップ" + nameFF;
    } else if (url === "/admin/categories/shops/2") {
      nameHeader = "ST" + nameFF;
    } else if (url === "/admin/categories/shops/3") {
      nameHeader = "cisca" + nameFF;
    }
    return nameHeader;
  }
  confirmLogout() {
    this.modalService.confirm({
      nzTitle: "<span>ログアウト確認</span>",
      nzContent: "<span>ログアウトしてもよろしいですか?</span>",
      nzCancelText: "キャンセル",
      nzIconType: "question-circle",
      nzOnOk: () => this.submitForm(),
      nzWidth: "416px",
    });
  }
  submitForm() {
    this.authStore.update({ token: null, user: null });
    this.router.navigate(["/login"]);
  }
}
