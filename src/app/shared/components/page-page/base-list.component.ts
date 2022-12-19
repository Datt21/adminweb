import {
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
  Directive,
} from "@angular/core";
import { IPager } from "../../models/IPager";
import { ISearchService } from "../../services/search.service";
import { PagerComponent } from "../../pagers/pager/pager.component";
import { Constants } from "../../models/constants";
import { Utilities } from "../../services/utilities.service";

@Directive({
  selector: "my-directive",
})
export abstract class BaseSearchComponent<T extends IPager, M>
  implements OnInit
{
  @ViewChildren(PagerComponent) pagers: QueryList<PagerComponent>;

  search: T = this.getNew();
  searchCache: T = this.getNew();
  $items: M[] = [];
  total = 0;
  isEdit: boolean;
  isSearched = false;
  PAGE_DEFAULT = 1;

  protected constructor(
    protected common: Utilities,
    protected service: ISearchService<T>,
    protected type: new () => T
  ) {}

  getNew(): T {
    return new this.type();
  }

  ngOnInit() {
    this.btnSearchClick();
  }

  async btnSearchClick(): Promise<void> {
    // refresh search cache
    this.searchCache = this.common.copyObject(this.search);
    await this.pagerChanges({
      page:
        this.searchCache && this.searchCache.page ? this.searchCache.page : 1,
      limit:
        this.searchCache && this.searchCache.limit
          ? this.searchCache.limit
          : Constants.PAGESIZE_DEFAULT,
    });
  }

  abstract btnClearClick();

  searchKeyDown(event: KeyboardEvent): void {
    // Search when enter key pressed
    if (event.keyCode === 13) {
      this.btnSearchClick();
    }
  }

  async searchAsync(): Promise<void> {
    this.isSearched = false;
    // Scroll to top
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    const result = await this.service.search(this.searchCache);
    if (result.message === "success") {
      this.$items = result.data;
      this.total = result.meta ? result.meta : 0;
      this.isSearched = true;
      if (
        this.searchCache.page > this.PAGE_DEFAULT &&
        this.$items.length === 0
      ) {
        this.search.page = this.PAGE_DEFAULT;
        this.btnSearchClick();
      }
    } else {
      this.$items = [];
      this.total = 0;
      this.isSearched = true;
    }

    const $this = this;
    setTimeout(() => {
      $this.pagers.forEach((pager) => {
        pager.refresh();
      });
    });
  }

  // async btnDeleteClick(model: any): Promise<void> {
  //   const msg = await this.common.trans("message.confirm_delete");
  //   const resultConfirm = await this.confirmService.show(msg);
  //   if (resultConfirm) {
  //     const msgProcessing = await this.common.trans("other.processing");
  //     this.loader.show(msgProcessing);
  //     const result = await this.service.delete(model);
  //     if (result.type === ResponseTypeEnum.SUCCESS) {
  //       await this.searchAsync();
  //       this.notification.showSuccess(
  //         await this.common.trans("message.delete_success")
  //       );
  //     } else {
  //       this.notification.showError(
  //         await this.common.trans("message.delete_error")
  //       );
  //     }
  //     this.loader.hide();
  //   }
  // }

  /*
   * event when pager changed
   */
  async pagerChanges(pageInfo: IPager): Promise<void> {
    this.searchCache.page = pageInfo.page;
    this.searchCache.limit = pageInfo.limit;

    // sync other pager value
    if (this.pagers) {
      this.pagers.forEach((pager) => {
        pager.pageSize = pageInfo.limit;
        pager.pagerInfo.currentPage = pageInfo.page;
      });
    }
    // call search function
    await this.searchAsync();
  }

  abstract trackByFn(index, item);
}
