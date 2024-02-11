import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';

// 11.2.2024 -> Ich tweake

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
