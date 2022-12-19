import { ResponseModel } from "../models/response.model";

export interface ISearchService<T> {
  search(model: T): Promise<ResponseModel<any>>;
  create(model: any): Promise<ResponseModel<any>>;
  update(model: any): Promise<ResponseModel<any>>;
  delete(model: any): Promise<ResponseModel<any>>;
  detail(model: any): Promise<ResponseModel<any>>;
}
