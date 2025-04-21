import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';
import { Chart, registerables } from 'chart.js';
import { addIcons } from 'ionicons';
import {
  createOutline,
  trashOutline,
  checkmarkOutline,
  saveOutline
} from 'ionicons/icons';

Chart.register(...registerables);

addIcons({
  'create-outline': createOutline,
  'trash-outline': trashOutline,
  'checkmark-outline': checkmarkOutline,
  'save-outline': saveOutline
});

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ]
});