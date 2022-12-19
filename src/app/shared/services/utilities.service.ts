import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class Utilities {
  constructor() {}

  copyObject<T>(input: T) {
    try {
      return JSON.parse(JSON.stringify(input));
    } catch (error) {
      return null;
    }
  }

  /*
   * Copy Array
   * @param: {Array}
   * @return: {Array}
   */
  copyArray(arrInput: any) {
    return [...arrInput];
  }
}
