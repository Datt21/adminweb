import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

import { akitaConfig, persistState } from '@datorama/akita';

if (environment.production) {
    enableProdMode();
}

persistState({
    key: 'auth'
});

platformBrowserDynamic().bootstrapModule(AppModule)
    .catch(err => console.error(err));

akitaConfig({
    resettable: true
});
