// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  baseUrlAuth:
    "http://kaimono-2019-1690777928.ap-northeast-1.elb.amazonaws.com/api/auth/admin",
  baseUrl:
    "http://kaimono-2019-1690777928.ap-northeast-1.elb.amazonaws.com/api/master-data",
  mobileOrderUrl:
    "http://kaimono-2019-1690777928.ap-northeast-1.elb.amazonaws.com/api/mobile-order",
  domain: "https://d218ztyit1smt5.cloudfront.net/",
  aspectRatio: 1 / 1,
  resizeToWidth: 154,
  fileTypes: ["image/jpg", "image/jpeg", "image/png"],
  redirectAfterLogin: "/admin/home",
};
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
