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


  productos: Producto[];
  currentPage: number;
  totalPages!: number;
  loading: boolean;
  constructor(private router:Router, 
    private route: ActivatedRoute, 
    private productosService: ProductosService, 
    private cdRef: ChangeDetectorRef,
    private alertController: AlertController) 
  {
    this.iconsURL = "../../assets/icon/";
    this.productos = [];
    this.loading = false;
    this.currentPage = 1;
    this.totalPages = 1;
    this.productosOriginales = [];
    this.filtroActivo  = '';
    this.terminoBusqueda = '';
  }

  ngOnInit(): void {
    this.cargarProductos();
  }

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

  public irARuta(path:string)
  {
    this.router.navigate(["/dashboard/"+path]);
  }

  /*Busqueda de productos*/
  filtroActivo: '' | 'nombre' | 'categoria';
  terminoBusqueda: string;
  productosOriginales: Producto[];
  
  /* Lógica de manejo de productos: */
  cargarProductos(): void {
    if (this.loading) return;
    this.loading = true;

    this.productosService.getPaginatedProductos(this.currentPage).subscribe(response => {

        const nuevosProductos = response.data;

        nuevosProductos.forEach(producto => {
        // Cargar la imagen como blob
        this.productosService.getProductoImagen(producto.id).subscribe(blob => {
          // Crear una URL temporal para mostrar la imagen
         /*  const imageUrl = URL.createObjectURL(blob);
          producto.image_url = imageUrl;
        }, err => {
          console.error(`Error cargando imagen para producto ID ${producto.id}`, err);
          producto.image_url = 'assets/img/placeholder.png'; // fallback si falla */
        });
      });

      this.productos = [...this.productos, ...response.data];
      this.productosOriginales = [...this.productosOriginales, ...nuevosProductos];
      this.totalPages = response.last_page;
      this.generarParesDeProductos();
      this.loading = false;
      this.cdRef.detectChanges();
      // Actualiza los pares para mostrar
      
    },
    (error) => {
      console.error(error);
      this.loading = false;
    });
  }

  cargarDatos(event: any){
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.cargarProductos();
    } else {
      event.target.disabled = true;  // Desactiva el infinite scroll si no hay más productos
    }
    event.target.complete();
  }

  cargarImagen(producto: Producto): void {
    this.productosService.getProductoImagen(producto.id).subscribe(blob => {
      const url = URL.createObjectURL(blob);
      producto.image_url = url;
    });
  }

  

  getDireccion()
  {
    return AppComponent.getDireccion();
  }

  productPairs: Producto[][] = [];

  generarParesDeProductos(): void {
    this.productPairs = [];
    for (let i = 0; i < this.productos.length; i += 2) {
      const par = this.productos.slice(i, i + 2);
      this.productPairs.push(par);
    } 
    //console.log("Pares generados:", this.productPairs);
  }


  getRows(length: number): number[] {
    return Array(Math.ceil(length / 2)).fill(0);
  }

  /* cambiarPagina(page: number): void {
    this.currentPage = page;
    this.cargarProductos(page);
  } */



  async mostrarOpcionesFiltro() {
    const alert = await this.alertController.create({
      header: 'Buscar por...',
      buttons: [
        {
          text: 'Nombre',
          handler: () => {
            this.filtroActivo = 'nombre';
            this.terminoBusqueda = '';
          }
        },
        {
          text: 'Categoría',
          handler: () => {
            this.filtroActivo = 'categoria';
            this.terminoBusqueda = '';
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel'
        }
      ]
    });
  
    await alert.present();
  }

  filtrarProductos() {
    if (this.terminoBusqueda.length < 2) return; // evita peticiones innecesarias

    this.productosService.getPaginatedProductos(1, this.filtroActivo, this.terminoBusqueda).subscribe(response => {
      this.productos = response.data;
      this.totalPages = response.last_page;
      this.currentPage = 1;
    }, error => {
    console.error('Error al filtrar productos:', error);
  });
  }

  cancelarBusqueda() {
    this.filtroActivo = '';
    this.terminoBusqueda = '';
    this.currentPage = 1;
    this.productos = [];
    this.productosOriginales = [];
    this.cargarProductos(); // recarga todo sin filtros
  }
  

}
