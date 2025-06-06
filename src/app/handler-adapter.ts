import { HttpHandler, HttpHandlerFn, HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

export class HandlerAdapter implements HttpHandler {
  constructor(private handlerFn: HttpHandlerFn) {}

  handle(req: HttpRequest<any>): Observable<HttpEvent<any>> {
    return this.handlerFn(req);
  }
}