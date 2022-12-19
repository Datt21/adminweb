import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { ResponseModel } from "../models/response.model";

@Injectable()
export class BaseHttpService {
  constructor(protected http: HttpClient) {}

  private generateParamsFrom(params?: any): HttpParams {
    let httpParams = new HttpParams();
    for (const item in params) {
      if (
        params.hasOwnProperty(item) &&
        params[item] !== undefined &&
        params[item] !== null
      ) {
        httpParams = httpParams.set(item, params[item]);
      }
    }
    return httpParams;
  }

  protected getAsync(path: string, params?: object): Promise<any> {
    try {
      const httpParams = this.generateParamsFrom(params);
      return this.http
        .get<ResponseModel<any>>(`${environment.mobileOrderUrl}/${path}`, {
          params: httpParams,
        })
        .toPromise();
    } catch (e) {
      return e;
    }
  }

  protected postAsync(
    path: string,
    request?: any
  ): Promise<ResponseModel<any>> {
    try {
      return this.http
        .post<ResponseModel<any> | any>(
          `${environment.mobileOrderUrl}/${path}`,
          request
        )
        .toPromise();
    } catch (e) {
      return e;
    }
  }

  protected putAsync(
    path: string,
    request?: object
  ): Promise<ResponseModel<any>> {
    try {
      return this.http
        .put<ResponseModel<any> | any>(
          `${environment.mobileOrderUrl}/${path}`,
          request
        )
        .toPromise();
    } catch (e) {
      return e;
    }
  }

  protected deleteAsync(path: string): Promise<ResponseModel<any>> {
    try {
      return this.http
        .delete<ResponseModel<any> | any>(
          `${environment.mobileOrderUrl}/${path}`
        )
        .toPromise();
    } catch (e) {
      return e;
    }
  }
}
