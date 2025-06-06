import { Routes, withComponentInputBinding } from '@angular/router';
import { DashboardComponent } from './dashboard.page';
import { ProductosComponent } from './Productos/productos.page';
import { CategoriasComponent } from './Categorias/categorias.page';


export const routes: Routes = 
[  
    {
        path: 'productos',
        loadComponent: () =>
            import('./Productos/productos.page').then((m) => m.ProductosComponent)
    },
    {
        path: 'ver_producto/:id/:nombre/:precio/:categoria/:imagen/:descripcion',
        loadComponent: () =>
            import('./DetalleProducto/detalle-producto.page').then((m) => m.DetalleProductoComponent),
        data: {
            componentInputBinding: true
        }
    },
    {
        path: 'agregar_producto',
        loadComponent: () =>
            import('./NuevoProducto/nuevo-producto.page').then((m) => m.NuevoProductoComponent)
    },
    {
        path: 'modificar_producto',
        loadComponent: () =>
            import('./ModificarProducto/modificar-producto.page').then((m) => m.ModificarProductoComponent)
    },
    {
        path: 'categorias',
        loadComponent: () =>
            import('./Categorias/categorias.page').then((m) => m.CategoriasComponent)
    },
    {
        path: 'agregar_categoria',
        loadComponent: () =>
            import('./NuevaCategoria/nueva-categoria.page').then((m) => m.NuevaCategoriaComponent)
    },
    {
        path: 'modificar_categoria',
        loadComponent: () =>
            import('./ModificarCategoria/modificar-categoria.page').then((m) => m.ModificarCategoriaComponent)
    },  
    {
        path: '',
        redirectTo: 'productos',
        pathMatch: 'full'
    }
];