import { bootstrapApplication} from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules, withComponentInputBinding } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { TokenInterceptor } from './app/token.interceptor';
import { inject } from '@angular/core';
import { HandlerAdapter } from './app/handler-adapter';

bootstrapApplication(AppComponent, {
  providers: [
      { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
      provideIonicAngular(),
      provideRouter(routes, withPreloading(PreloadAllModules), withComponentInputBinding()),
      provideHttpClient(
        withInterceptors([(req, next) => {
          const interceptor = inject(TokenInterceptor);
          const handler = new HandlerAdapter(next);
          return interceptor.intercept(req, handler);
        }])
      ),
      TokenInterceptor,
      provideHttpClient(withInterceptorsFromDi())
  ]
});
