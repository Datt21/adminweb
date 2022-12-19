import { Component, Input, OnInit, Output, EventEmitter } from "@angular/core";
import { Constants } from "../../models/constants";
import { PagerService } from "../services/page.service";

export interface IPager {
  page: number;
  limit: number;
}

@Component({
  selector: "app-pager",
  templateUrl: "./pager.component.html",
  styleUrls: ["./pager.component.scss"],
})
export class PagerComponent implements OnInit {
  @Input() pageSize: number;
  @Input() total: number;
  @Output() onChangePage: EventEmitter<IPager> = new EventEmitter();

  pagerInfo: {
    totalItems?: number;
    currentPage?: number;
    pageSize?: number;
    totalPages?: number;
  } = {};
  PAGESIZES = Constants.PAGESIZES;

  constructor(private pagerService: PagerService) {}

  ngOnInit() {
    this.pagerInfo = this.pagerService.getPagerInfo(
      this.total,
      1,
      this.pageSize
    );
  }

  refresh() {
    const currentPage = this.pagerInfo.currentPage;

    this.pagerInfo = this.pagerService.getPagerInfo(
      this.total,
      this.pagerInfo.currentPage,
      this.pageSize
    );

    if (
      currentPage !== this.pagerInfo.currentPage &&
      this.pagerInfo.totalPages > 0
    ) {
      this.onChangePage.emit({
        page: this.pagerInfo.currentPage,
        limit: this.pageSize,
      });
    }
  }

  setPage(page: number) {
    if (
      page < 1 ||
      page > this.pagerInfo.totalPages ||
      page === this.pagerInfo.currentPage
    ) {
      return;
    }

    this.pagerInfo = this.pagerService.getPagerInfo(
      this.total,
      page,
      this.pageSize
    );
    this.onChangePage.emit({ page, limit: this.pageSize });
  }

  changePageSize(pageSize: number) {
    if (this.pageSize === pageSize) {
      return;
    }

    this.pagerInfo = this.pagerService.getPagerInfo(
      this.pagerInfo.totalItems,
      1,
      pageSize
    );

    this.onChangePage.emit({
      page: this.pagerInfo.currentPage,
      limit: pageSize,
    });
  }

  pagination(currentPage: number, totalPages: number) {
    const current = currentPage;
    const last = totalPages;
    const delta = 2;
    const range = [];
    const rangeWithDots = [];
    let l: number;

    range.push(1);

    if (last <= 1) {
      return range;
    }

    for (let i = current - delta; i <= current + delta; i++) {
      if (i < last && i > 1) {
        range.push(i);
      }
    }

    range.push(last);

    for (const i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push("...");
        }
      }
      rangeWithDots.push(i);
      l = i;
    }

    return rangeWithDots;
  }
}
