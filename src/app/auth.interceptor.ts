/* import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req);
};
 */

import { inject, Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenService } from './token.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  private rutasProtegidas = ['/agregar_producto', '/eliminar_producto', '/modificar_producto', '/obtener_producto', '/listar_productos'];     
  private tokenService = inject(TokenService); 

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.tokenService.get(); // O donde lo guardes

    const esRutaProtegida = this.rutasProtegidas.some(ruta => req.url.includes(ruta));

    if (token && esRutaProtegida) {
      const cloned = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      return next.handle(cloned);
    } else {
      return next.handle(req);
    }
  }
}