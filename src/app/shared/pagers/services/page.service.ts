import { Injectable } from "@angular/core";

@Injectable()
export class PagerService {
  getPagerInfo(
    totalItems: number,
    currentPage: number = 1,
    pageSize: number = 10
  ) {
    const totalPages = Math.ceil(totalItems / pageSize);

    if (currentPage < 1) {
      currentPage = 1;
    } else if (currentPage > totalPages) {
      currentPage = totalPages;
    }

    return {
      totalItems,
      currentPage,
      pageSize,
      totalPages,
    };
  }
}
