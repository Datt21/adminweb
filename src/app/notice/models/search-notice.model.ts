import { IPager } from "src/app/shared/models/IPager";

export class SearchNotice implements IPager {
  page: number;
  limit: number;
  userDomain?: number;
  title?: string;
  notificationType?: number;
  publicFlag?: number;
  constructor() {}
}
