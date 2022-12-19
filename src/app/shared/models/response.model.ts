import { MetaModel } from "./meta.model";

export interface ResponseModel<T> {
  statusCode?: number;
  message: string;
  data: T;
  meta?: any;
  errorCode: "CM0000";
  id: any;
}
