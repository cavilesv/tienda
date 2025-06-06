import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { AppComponent } from 'src/app/app.component';

export interface RespuestaProductos {
  current_page: number,
  data: Producto[],
  first_page_url: string,
  from: number,
  last_page: number,
  last_page_url: string,
  links: string[],
  next_page_url: string|null,
  path: string,
  per_page: number,
  prev_page_url: string|null,
  to: number
  total: number
}

export interface Producto {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
  mime: string;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductosService {
  private apiUrl = AppComponent.getDireccion()+'/listar_productos';

  constructor(private http: HttpClient) {}

  getPaginatedProductos(page: number, filtro: 'nombre'|'categoria' = 'nombre', termino: string|null = null): Observable<RespuestaProductos> {
    let params = new HttpParams().set('page', page.toString());
    params = params.set('filtro', filtro);

    if (termino) {
      params = params.set('termino', termino);
    }

    return this.http.get<RespuestaProductos>(this.apiUrl, { params });/* .pipe(
      map((data) => data.map((item: any) => this.mapRespuestaProductos(item)))); */
  }

  /* private mapRespuestaProductos(item: any): any {
    return {
      'id': item.id,            // Asocia 'user_id' con 'id'
      'nombre': item.name,      // Asocia 'full_name' con 'nombre'
      'precio': item.price,
      'categoria' : item.category,
      'imagen_url' : item.image_url,
      'mime' : item.mime,
      'descripcion' : item.description
             // Asocia 'user_email' con 'email'
    };
  } */

  
  getProductoImagen(id: number): Observable<Blob> {
    return this.http.get(`/productos/imagen/${id}`, { responseType: 'blob' });
  }
}
