import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { BaseHttpService } from "src/app/shared/services/base-http.service";
import { SearchNotice } from "../models/search-notice.model";
import { ResponseModel } from "src/app/shared/models/response.model";
import { ISearchService } from "src/app/shared/services/search.service";
import { Notice } from "../models/notice.model";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable()
export class NoticeListService
  extends BaseHttpService
  implements ISearchService<SearchNotice>
{
  private url = "notification/list";
  isSpinning: boolean;
  constructor(protected http: HttpClient) {
    super(http);
  }
  async search(model: SearchNotice): Promise<ResponseModel<Notice>> {
    return await super.getAsync(`notification/list`, model);
  }
  create(model: any): Promise<ResponseModel<any>> {
    throw new Error("Method not implemented.");
  }
  update(model: any): Promise<ResponseModel<any>> {
    throw new Error("Method not implemented.");
  }
  delete(model: any): Promise<ResponseModel<any>> {
    throw new Error("Method not implemented.");
  }
  detail(model: any): Promise<ResponseModel<any>> {
    throw new Error("Method not implemented.");
  }

  getListNotification(params?: any): Observable<any> {
    return this.http.get<any>(
      `${environment.mobileOrderUrl}/notification/list`,
      {
        params,
      }
    );
  }

  updateStatusFlag(id: number, flag: any): Observable<any> {
    return this.http.put<any>(
      `${environment.mobileOrderUrl}${this.url}/public_flag/${id}`,
      flag
    );
  }

  async deleteNotice(id: number[]): Promise<any> {
    return await this.http
      .delete<any>(`${environment.mobileOrderUrl}${this.url}/${id}`)
      .toPromise();
  }

  showLoader(hide?: boolean) {
    this.isSpinning = !hide;
  }
}
