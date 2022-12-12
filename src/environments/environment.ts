// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    production: false,
    baseUrlAuth: 'https://dmikcr6mwkewb.cloudfront.net/api/auth/admin',
    baseUrl: 'https://dmikcr6mwkewb.cloudfront.net/api/master-data',
    domain: 'https://d28wi64mkihktj.cloudfront.net/',
    aspectRatio: 1 / 1,
    resizeToWidth: 154,
    fileTypes: ['image/jpg', 'image/jpeg', 'image/png'],
    redirectAfterLogin: '/admin/home'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
