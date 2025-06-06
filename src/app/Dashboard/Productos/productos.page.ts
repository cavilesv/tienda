import { CommonModule} from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, EnvironmentInjector, inject, Renderer2, ViewChild} from '@angular/core';
import { AlertController, IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonRouterOutlet, IonContent, IonTitle, IonHeader, IonToolbar, IonButton, IonItem,
  IonMenu,
  IonMenuToggle,
  IonImg,
  IonRadio,
  IonRadioGroup, IonRow, IonGrid, IonCol, IonAvatar, IonList, IonRefresher, IonInfiniteScrollContent, IonInfiniteScroll, IonRefresherContent, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonRange, IonSearchbar } from '@ionic/angular/standalone';
import { ActivatedRoute, Router, RouterModule, Routes } from '@angular/router';
import { sleep } from 'utils';
import { BotonMenuComponent } from '../BotonMenu/boton-menu.component';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, House, Search, Bell, Heart, BadgeDollarSign, User, ShoppingCart, ChartBarStacked, CircleHelp, Store, } from 'lucide-angular';
import { DashboardComponent } from '../dashboard.page';
import { Producto, ProductosService } from './productos.service';
import { AppComponent } from 'src/app/app.component';
import { Subscription } from 'rxjs';
import { ProductosSharedService } from 'src/app/productos-event-share.service';



@Component({
  standalone: true,
  selector: 'app-productos',
  templateUrl: 'productos.page.html',
  styleUrls: ['productos.page.scss'],
  imports: [IonSearchbar, IonRange, IonCardSubtitle, IonCardTitle, IonCardHeader, IonCard, IonRefresherContent, IonInfiniteScroll, IonInfiniteScrollContent, IonRefresher, 
    IonCol, 
    IonGrid, 
    IonRow, 
    IonButton, 
    IonLabel, 
    IonHeader, 
    IonToolbar, 
    IonTitle, 
    IonContent, 
    CommonModule, 
    BotonMenuComponent, 
    FormsModule, 
    FormsModule,
    IonButton,
    IonContent,
    IonHeader,
    IonItem,
    IonMenu,
    IonMenuToggle,
    IonRadio,
    IonRadioGroup,
    IonTitle,
    IonToolbar,
    IonImg, IonAvatar, IonList, IonIcon, LucideAngularModule]
})
export class ProductosComponent {

  @ViewChild(IonInfiniteScroll) infiniteScroll!: IonInfiniteScroll;

  private readonly listaMenu1 = [
    {
      "nombre_opcion" : "Inicio",
      "icono" : House,
      "ruta" : "productos"
    },
    {
      "nombre_opcion" : "Productos",
      "icono" : Search,
      "ruta" : "productos"
    },
    {
      "nombre_opcion" : "Notificaciones",
      "icono" : Bell,
      "ruta" : ""
    },
    {
      "nombre_opcion" : "Favoritos",
      "icono" : Heart,
      "ruta" : ""
    },
    {
      "nombre_opcion" : "Ofertas",
      "icono" : BadgeDollarSign,
      "ruta" : ""
    },
    {
      "nombre_opcion" : "Mi cuenta",
      "icono" : User,
      "ruta" : ""
    },
    
  ];
  private readonly listaMenu2 = [
    {
      "nombre_opcion" : "Vender",
      "icono" : ShoppingCart,
      "ruta" : ""
    },
    {
      "nombre_opcion" : "Categorías",
      "icono" : ChartBarStacked,
      "ruta" : "categorias"
    },
    {
      "nombre_opcion" : "Tiendas oficiales",
      "icono" : Store,
      "ruta" : ""
    },
    {
      "nombre_opcion" : "Ayuda",
      "icono" : CircleHelp,
      "ruta" : ""
    },
  ];
  readonly House = House;
  readonly Search = Search;
  readonly Bell = Bell;
  readonly Heart = Heart; 
  readonly BadgeDollarSign = BadgeDollarSign;
  readonly User = User; 
  readonly ShoppingCart = ShoppingCart; 
  readonly ChartBarStacked = ChartBarStacked; 
  readonly Store = Store;
  readonly CircleHelp = CircleHelp; 
  private iconsURL: string;
  menuType: string = 'overlay';

  filtroSeleccionado = "nombre";
  productos: (Producto|null|undefined)[] | null;
  currentPage: number;
  totalPages!: number;
  loading: boolean;
  mostrarProductos: boolean;

  mostrarScroll: boolean = true;
  /* -------------------------------------------------------------------------------*/
  /* ------------------------- AQUI ESTA EL CONSTRUCTOR ----------------------------*/
  /* -------------------------------------------------------------------------------*/
  constructor(private router:Router, 
    private route: ActivatedRoute, 
    private productosService: ProductosService, 
    private cdRef: ChangeDetectorRef,
    private alertController: AlertController,
    private renderer: Renderer2,
    private productosSharedService: ProductosSharedService) 
    {
      this.iconsURL = "../../assets/icon/";
      this.productos = [];
      this.loading = false;
      this.currentPage = 1;
      /* this.totalPages = 1; */
      this.productosOriginales = [];
      this.filtroActivo  = 'nombre';
      this.terminoBusqueda = '';
      this.copiaArregloOriginal = null;
      this.mostrarProductos = true;
    }

  ngOnInit(): void {
    this.cargarProductos(null);

    this.subEliminacionProducto = this.productosSharedService.eventoEliminacionProducto$.subscribe((id: string) => {
      this.recibido = true;
      console.log('¡Evento recibido en componente '+ id);
      this.eliminarProducto(id);
    });

    this.subNuevoProducto = this.productosSharedService.eventoNuevoProducto$.subscribe((producto: {}) => {
      this.recibido = true;
      console.log('¡Evento recibido en componente');
      this.agregarProducto();
    });

    this.subModificarProducto = this.productosSharedService.eventoModificarProducto$.subscribe((producto: {}) => {
      this.recibido = true;
      console.log('¡Evento recibido en componente');
      this.modificarProducto();
    });
  }

    /* -------------------------------------------------------------------------------*/
  /*-------------------------- AGREGAR PRODUCTO LOCAL -----------------------------------*/
  /* -------------------------------------------------------------------------------*/

  private modificarProducto()
  {
    this.resetearListadoProductos();
    /* this.currentPage = 1; // Reiniciar la paginación
    //this.terminoBusqueda = ''; // Limpiar término de búsqueda
    this.productos!.splice(0, this.productos!.length); // Eliminar los productos existentes
    this.productPairs!.splice(0, this.productPairs!.length);
    
    this.productosOriginales!.splice(0, this.productosOriginales!.length);  */// Eliminar los productos originales
    
    
    /* if (this.infiniteScroll) {
      this.infiniteScroll.disabled = false; // Asegúrate que el scroll no está desactivado
    } */
     /*  this.mostrarScroll = false; // 🧼 ocultar el scroll para reiniciarlo

    setTimeout(() => {
      this.mostrarScroll = true;  // ✅ volver a mostrarlo después de refrescar
      this.cargarProductos(null);
    }, 100); */
  }

  /* -------------------------------------------------------------------------------*/
  /*-------------------------- AGREGAR PRODUCTO LOCAL -----------------------------------*/
  /* -------------------------------------------------------------------------------*/

  private agregarProducto()
  {
    this.resetearListadoProductos();
    //this.cargarProductos();
  }

  private resetearListadoProductos()
  {
    this.currentPage = 1; // Reiniciar la paginación
    //this.terminoBusqueda = ''; // Limpiar término de búsqueda
    
    this.productPairs!.splice(0, this.productPairs!.length);
    this.productPairs = [];
    this.productos!.splice(0, this.productos!.length); // Eliminar los productos existentes
    this.productos = [];
    this.productosOriginales!.splice(0, this.productosOriginales!.length); // Eliminar los productos originales
    this.productosOriginales = [];
    
    /* if (this.infiniteScroll) {
      this.infiniteScroll.disabled = false; // Asegúrate que el scroll no está desactivado
    } */
    this.mostrarProductos = false;
    this.mostrarScroll = false; // 🧼 ocultar el scroll para reiniciarlo

    setTimeout(() => {
      this.mostrarScroll = true;  // ✅ volver a mostrarlo después de refrescar
      this.cargarProductos(null);
      this.mostrarProductos = true;
    }, 100);
    /* this.productPairs?.splice(0, this.productPairs.length);
    this.productos?.splice(0, this.productos.length);
    this.productosOriginales?.splice(0, this.productosOriginales?.length); */
  }
  /* -------------------------------------------------------------------------------*/
  /*-------------------------- ELIMINACION LOCAL -----------------------------------*/
  /* -------------------------------------------------------------------------------*/
  private eliminarProducto(idProducto: string) {
    const id = parseInt(idProducto);

    this.eliminarDeProductPairs(id);
    this.eliminarDeLista(this.productos!, id);
    this.eliminarDeLista(this.productosOriginales!, id);
  }

  private eliminarDeProductPairs(id: number) {
    let encontrado = false;

    for (let i = 0; i < this.productPairs!.length; i++) {
      const pair = this.productPairs![i];
      if (!pair) continue;

      for (let j = 0; j < 2; j++) {
        const producto = pair[j];
        if (!encontrado && producto && producto.id === id) {
          encontrado = true;
          this.productPairs![i][j] = null;

          const siguiente = (j === 0) ? pair[1] : this.productPairs![i + 1]?.[0];
          if (siguiente) this.productPairs![i][j] = siguiente;
        } else if (encontrado) {
          this.productPairs![i][j] = null;

          const siguiente = (j === 0) ? pair[1] : this.productPairs![i + 1]?.[0];
          if (siguiente) this.productPairs![i][j] = siguiente;
        }
      }
    }
  }

  private eliminarDeLista(lista: (Producto | null |undefined)[], id: number) {
    let encontrado = false;

    for (let i = 0; i < lista.length; i++) {
      const producto = lista[i];
      if (!encontrado && producto && producto.id === id) {
        encontrado = true;
        lista[i] = null;

        const siguiente = lista[i + 1];
        if (siguiente) lista[i] = siguiente;
      }
    }
  }

  ngOnDestroy() {
    this.subEliminacionProducto.unsubscribe(); // Limpieza
    this.subNuevoProducto.unsubscribe();
    this.subModificarProducto.unsubscribe();
  }

  ngAfterViewInit()
  {
    /* if (this.infiniteScroll.disabled == true)
      {
        
        this.infiniteScroll.disabled = false;
        
      } */
  }
  

  /* -------------------------------------------------------------------------------*/
  /* ----------------------------------ICONOS DEL MENU-------------------------------*/
  /* -------------------------------------------------------------------------------*/
  public getIconsURL()
  {
    return this.iconsURL;
  }

  public getListaMenu1()
  {
    return this.listaMenu1;
  }

  public getListaMenu2()
  {
    return this.listaMenu2;
  }
  /* -------------------------------------------------------------------------------*/
  /* -------------------------------------------------------------------------------*/
  /* -------------------------------------------------------------------------------*/


  /*Busqueda de productos*/
  filtroActivo: "nombre" | "categoria";
  terminoBusqueda: string;
  productosOriginales: (Producto|null|undefined)[]|null;
  
  /* Lógica de manejo de productos: */
  

  

  cargarImagen(producto: Producto): void {
    this.productosService.getProductoImagen(producto.id).subscribe(blob => {
      const url = URL.createObjectURL(blob);
      producto.image = url;
    });
  }

  

  getDireccion()
  {
    return AppComponent.getDireccion();
  }

  productPairs: (Producto|null|undefined)[][] | null = null;

  generarParesDeProductos(): void {
    this.productPairs = [];
    for (let i = 0; i < this.productos!.length; i += 2) {
      const par = this.productos!.slice(i, i + 2);
      this.productPairs.push(par);
    } 
    /* console.log("Pares generados:", this.productPairs); */
  }


  getRows(length: number): number[] {
    return Array(Math.ceil(length / 2)).fill(0);
  }

  private copiaArregloOriginal: (Producto|null|undefined)[]|null;

  private detectarVariableComparar(producto: Producto): string {
    
    try {
      let variableComparar: string;
      switch (this.filtroActivo) {
        case "nombre": variableComparar = producto.name; break;
        case "categoria": variableComparar = producto.category; break;
        default: variableComparar = producto.name; break;
      }
      /* console.log("El filtro activo es"+ this.filtroActivo); */
      return variableComparar.toString();
    } catch (error) {
      console.error('Error en detectarVariableComparar:', {
        producto,
        filtro: this.filtroActivo,
        error
      });
      return ''; // Devuelve un string vacío en caso de error para que no se caiga
    }
  }

  

  /*------------------------------------------------------------------------------------------------------------------------------------------ */
  /*------------------------------------------------------------ CARGAR PRODUCTOS ------------------------------------------------------------ */
  /*------------------------------------------------------------------------------------------------------------------------------------------ */

  cargarDatos(event:any|null)
  {    
    if (this.currentPage < this.totalPages) 
    {   
      this.currentPage++;
      this.cargarProductos(event);
    } 
    else 
    {
      if (event != null)
      {
        event.target.disabled = true;  // Desactiva el infinite scroll si no hay más productos
      }   
    }
  }

  cargarProductos(event?:any): void 
  {
    if (this.loading)
    { 
      return;    
    }
    this.loading = true;
    
    this.productosService.getPaginatedProductos(this.currentPage, this.filtroActivo, this.terminoBusqueda).subscribe(response => {

        let nuevosProductos = response.data;

        /* nuevosProductos.forEach(producto => {
        // Cargar la imagen como blob
        this.productosService.getProductoImagen(producto.id).subscribe(blob => { */
          // Crear una URL temporal para mostrar la imagen
         /*  const imageUrl = URL.createObjectURL(blob);
          producto.image_url = imageUrl; */
        /* }, err => {
          console.error(`Error cargando imagen para producto ID ${producto.id}`, err);
          producto.image_url = 'assets/img/placeholder.png'; // fallback si falla */ 
      let copiaArregloOriginalSize = this.copiaArregloOriginal != null ? this.copiaArregloOriginal.length : 0;
      if (copiaArregloOriginalSize > 0)
      {
        let elementosADescartar: Producto[] = [];

        nuevosProductos = nuevosProductos.filter(producto => 
                                                {                                                                                      
                                                  for(let i=0; i < copiaArregloOriginalSize; i++)
                                                  {
                                                    if (producto.id == this.copiaArregloOriginal![i]!.id)
                                                    {
                                                      elementosADescartar.push(producto);
                                                      return false;
                                                    }                                                    
                                                  }
                                                  return true;
                                                });
        let elementosADescartarSize = elementosADescartar.length;                                        
        this.copiaArregloOriginal = this.copiaArregloOriginal!.filter(producto => {
            for(let i=0; i < elementosADescartarSize ; i++)
            {
              if (producto!.id == elementosADescartar[i].id)
              {
                return false;
              }
            }
            return true;
        });
      }
      this.productosOriginales = [...this.productosOriginales!, ...nuevosProductos];
      this.productos = [...this.productos!, ...nuevosProductos];
      
      this.totalPages = response.last_page;

      this.generarParesDeProductos();     
      
      this.cdRef.detectChanges(); 
      
      event?.target?.complete();
      this.loading = false;
        /* if (event) {
          console.log("llega dentro de event");
          event.target.complete(); // ✅ solo cuando ya se han recibido los datos
        } */
      // Actualiza los pares para mostrar      
    },
    (error) => {
      console.error(error);
      this.loading = false;
      event?.target?.complete();
    });
  }

  public filtrando = false;
  private ultimoTerminoBusqueda = '';
  private ultimoProceso = 0;

  /*------------------------------------------------------------------------------------------------------------------------------------------- */
  /*---------------------------------------------------- FILTRAR PRODUCTOS--------------------------------------------------------------------- */
  /*------------------------------------------------------------------------------------------------------------------------------------------- */
  public esperar(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  async filtrarProductos() {
    /* if (this.filtrando)
    {
      return;
    } */
    let procesoActual;
    this.ultimoProceso++;
    if (this.ultimoProceso == 50)
      this.ultimoProceso = 0;
    procesoActual = this.ultimoProceso;

    await this.esperar(2000);

    if (!(procesoActual == this.ultimoProceso))
    {
      console.log("Se cancelo busqueda anterior"+this.ultimoProceso);
      return;
    }

    while(this.filtrando)
    {
      continue;
    }
    this.filtrando = true;
    if (this.terminoBusqueda.trim().length == 0) {
      this.currentPage = 1;
      this.mostrarScroll = false; // 🧼 ocultar el scroll para reiniciarlo
      this.productos!.splice(0, this.productos!.length); // Eliminar los productos existentes
      this.productPairs!.splice(0, this.productPairs!.length);
    
      this.productosOriginales!.splice(0, this.productosOriginales!.length); // Eliminar los productos originales

      setTimeout(() => {
        this.mostrarScroll = true;  // ✅ volver a mostrarlo después de refrescar
        this.cargarProductos(null);
      }, 100);
      this.filtrando = false;
      return;
    } 
    this.ultimoTerminoBusqueda = this.terminoBusqueda.trim();
    this.currentPage = 1;
    this.mostrarScroll = false;
    this.copiaArregloOriginal = [];
    this.productPairs = null;

    this.productosOriginales = this.productosOriginales!.filter(producto => {
      let variableComparar:string = this.detectarVariableComparar(producto!);
      return variableComparar.toLowerCase().includes(this.terminoBusqueda.toLowerCase())
    });

    this.productos = this.productos!.filter(producto => {
      let variableComparar:string = this.detectarVariableComparar(producto!);
      return variableComparar.toLowerCase().includes(this.terminoBusqueda.toLowerCase())
    });

    let productosSize = this.productos.length;
    let productosOriginalesSize = this.productosOriginales.length;
    if (productosSize < productosOriginalesSize)
    {
      let productosAusentes = this.productosOriginales.filter(producto => {

        for(let i = 0; i < productosSize; i++)
        {
          if (producto!.id == this.productos![i]!.id)
          {
            return false;
          }
        }
        return true;
      });
      this.productos = [...this.productos, ...productosAusentes];  
    }
    this.generarParesDeProductos();

    this.copiaArregloOriginal = this.productosOriginales.slice();

    this.currentPage = 1;
    this.mostrarScroll = false; // 🧼 ocultar el scroll para reiniciarlo

    setTimeout(() => {
      this.mostrarScroll = true;  // ✅ volver a mostrarlo después de refrescar
      if (procesoActual = this.ultimoProceso)
        this.cargarProductos(null);
    }, 100);
    this.filtrando = false;
    return;
    
    /* if (this.filtroActivo === 'nombre') {
        filtrados = this.productosOriginales.filter(producto =>
        producto.name.toLowerCase().includes(this.terminoBusqueda.toLowerCase())
      );
    } else if (this.filtroActivo === 'categoria') {
      filtrados = this.productosOriginales.filter(producto =>
        producto.category.toLowerCase().includes(this.terminoBusqueda.toLowerCase())
      );
    }
  
    this.productos = filtrados; */
  }

  /* cancelarBusqueda() {
    this.filtroActivo = 'nombre';
    this.terminoBusqueda = '';
    this.productos = [...this.productosOriginales];
    this.generarParesDeProductos();
  }
  
  cancelarBusquedaServidor() {
    this.filtroActivo = 'nombre';
    this.terminoBusqueda = '';
    this.currentPage = 1;
    this.productos = [];
    this.productosOriginales = [];
    this.cargarProductos(); // recarga todo sin filtros
  } */

    
/* --------------------------------------------------------------------------------------------------------------------- */
/* ------------------------------------------------------- FILTRO ------------------------------------------------------- */
/* --------------------------------------------------------------------------------------------------------------------- */
  cambiarFiltro(): void {
    // Restablecer la lista de productos y la página actual cuando se cambia el filtro
   
   
    this.currentPage = 1; // Reiniciar la paginación
    this.terminoBusqueda = ''; // Limpiar término de búsqueda
    this.productos!.splice(0, this.productos!.length); // Eliminar los productos existentes
    this.productPairs!.splice(0, this.productPairs!.length);
    
    this.productosOriginales!.splice(0, this.productosOriginales!.length); // Eliminar los productos originales
    
    
    /* if (this.infiniteScroll) {
      this.infiniteScroll.disabled = false; // Asegúrate que el scroll no está desactivado
    } */
      this.mostrarScroll = false; // 🧼 ocultar el scroll para reiniciarlo

  setTimeout(() => {
    this.mostrarScroll = true;  // ✅ volver a mostrarlo después de refrescar
    this.cargarProductos(null);
  }, 100);

    // Cargar productos desde el servidor con el nuevo filtro
  
  }


/* --------------------------------------------------------------------------------------------------------------------- */
/* ----------------------------------------------------- CAMBIO DE RUTA ------------------------------------------------ */
/* --------------------------------------------------------------------------------------------------------------------- */
  public irARuta(path:string)
  {
    this.router.navigate(["/dashboard/"+path]);
  }

  public irARutaConParametros(path:string, producto: Producto)
  {
    this.router.navigate(["/dashboard/", path,
      producto.id,
      producto.name,
      producto.price,
      producto.category,
      producto.image,
      producto.description
    ]);
  }
  
  consolear(mensaje:string){
    console.log(mensaje);
  }

  /* ----------------------------------------------------------------------------------------------------------------------------------------- */
  /* ----------------------------------------------------- SUSCRIPCION EVENTOS CAMBIO PRODUCTO ------------------------------------------------ */
  /* ----------------------------------------------------------------------------------------------------------------------------------------- */
  recibido = false;
  private subEliminacionProducto!: Subscription;
  private subNuevoProducto!: Subscription;
  private subModificarProducto!: Subscription;
}
