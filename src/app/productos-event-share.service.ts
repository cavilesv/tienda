// shared.service.ts
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProductosSharedService {
  private eventoEliminacionProducto = new Subject<any>(); // También puede ser Subject<any> si envías datos
  private eventoNuevoProducto = new Subject<any>();
  private eventoModificarProducto = new Subject<any>();

  eventoEliminacionProducto$ = this.eventoEliminacionProducto.asObservable(); // Observable que otros pueden suscribirse
  eventoNuevoProducto$ = this.eventoNuevoProducto.asObservable();
  eventoModificarProducto$ = this.eventoNuevoProducto.asObservable();

  emitirEventoEliminacionProducto(datos: any) {
    this.eventoEliminacionProducto.next(datos); // Emite el evento
  }

  emitirEventoNuevoProducto() {
    this.eventoNuevoProducto.next(null); // Emite el evento
  }

  emitirEventoModificarProducto() {
    this.eventoModificarProducto.next(null); // Emite el evento
  }
}
