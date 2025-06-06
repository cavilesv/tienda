import { CommonModule} from '@angular/common';
import { Component, ElementRef, EnvironmentInjector, inject, OnInit, Renderer2, TemplateRef, ViewChild} from '@angular/core';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonRouterOutlet, IonContent, IonTitle, IonHeader, IonToolbar, IonButton, IonItem,
  IonMenu,
  IonMenuToggle,
  IonImg,
  IonRadio,
  IonRadioGroup, IonRow, IonGrid, IonCol, IonAvatar, IonList, IonInput, IonTextarea, IonModal, IonAlert } from '@ionic/angular/standalone';
import { ActivatedRoute, Router, RouterModule, Routes } from '@angular/router';
import { sleep } from 'utils';
import { BotonMenuComponent } from '../BotonMenu/boton-menu.component';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, House, Search, Bell, Heart, BadgeDollarSign, User, ShoppingCart, ChartBarStacked, CircleHelp, Store, } from 'lucide-angular';
import { DashboardComponent } from '../dashboard.page';
import { HttpClient } from '@angular/common/http';
import { AppComponent } from '../../app.component';
import { FileUploaderComponent } from '../FileUploader/file-uploader.component';
import { take } from 'rxjs';
import { ProductosSharedService } from 'src/app/productos-event-share.service';





@Component({
  standalone: true,
  selector: 'app-nuevo-producto',
  templateUrl: 'nuevo-producto.page.html',
  styleUrls: ['nuevo-producto.page.scss'],
  imports: [IonAlert, IonModal, IonInput, 
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
    IonImg, IonAvatar, IonList, IonIcon, LucideAngularModule, IonInput, IonTextarea, FileUploaderComponent]
})
export class NuevoProductoComponent  implements OnInit {

  @ViewChild('fileInputComponent') fileInputComponent!: FileUploaderComponent;

  private iconsURL: string;
  private categorias: any;
  public static seBuscoCategorias: boolean;
  private mostrarContenedorImagen: boolean;
  
  private rutaAgregarProducto = AppComponent.getDireccion() + "/agregar_producto";

  constructor(private router:Router, private http: HttpClient, private productosSharedService: ProductosSharedService) { 
    this.iconsURL = "../../assets/icon/";
    this.categorias = [];
    NuevoProductoComponent.seBuscoCategorias = false;
    this.valorCategoria = '';
    this.mostrarContenedorImagen = true;
  }

  ngOnInit() {}

  public getIconsURL()
  {
    return this.iconsURL;
  }

  public irARuta(ruta:string)
  {
    this.router.navigate(["/dashboard/"+ruta]);    
  }


  private readonly urlGetCategorias = AppComponent.getDireccion() + "/get_categorias";

  public getCategorias()
  {
    return this.categorias;
  } 

  public cargarCategorias()
  {
    if (!(NuevoProductoComponent.seBuscoCategorias))
    {
      this.http.get(this.urlGetCategorias, { headers: AppComponent.getHeaders() }) // Ejemplo de API pública
      .subscribe({
        next: (respuesta) => {
          NuevoProductoComponent.seBuscoCategorias = true;
          this.categorias = respuesta;
        },
        error: (error) => {
          console.error('Error en la llamada GET', error);
        }
      });
      return;
    }
  }

  public mostrarCategorias()
  {
    if (NuevoProductoComponent.seBuscoCategorias && this.categorias.length > 0) 
    {
      return true;
    }
    return false;
  }

  private valorCategoria: String;

  public setValorCategoria(valorCategoria:string)
  {
    this.valorCategoria = valorCategoria;
  }

  public getValorCategoria()
  {
    return this.valorCategoria;
  }

  public soloNumeros(event: KeyboardEvent) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }

  /* Aqui se ajusta el espacio cuando el usuario se dispone a llenar los campos */
 
  public setOcultarContenedorImagen()
  {
    this.mostrarContenedorImagen = false;
  }

  public setMostrarContenedorImagen()
  {
    this.mostrarContenedorImagen = true;
  }

  public getMostrarContenedorImagen()
  {
    return this.mostrarContenedorImagen;
  }

  private valorPorDefecto = "Sin categoría";

  public getValorPorDefecto()
  {
    return this.valorPorDefecto;
  }

  private mostrarErroresRecibidos(erroresRecibidos:string[])
  {

  }
/* Se gestiona el envío del formulario y la agregación del archivo. */

  @ViewChild('nombre_producto') nombre_producto!: ElementRef<HTMLInputElement>;
  @ViewChild('precio') precio!: ElementRef<HTMLInputElement>;
  @ViewChild('categoria') categoria!: ElementRef<HTMLInputElement>;
  @ViewChild('descripcion') descripcion!: ElementRef<HTMLTextAreaElement>;

  public agregarNuevoProducto()
  {
    const formData = new FormData();
   
    const imagenBlob = this.fileInputComponent.getValorInputImagen();
    const file = new File([imagenBlob], this.nombre_producto.nativeElement.value+".png", { type: imagenBlob.type });
    formData.append('imagen', file);
    formData.append('nombre', unescape(encodeURIComponent(this.nombre_producto.nativeElement.value)));
    formData.append('precio', unescape(encodeURIComponent(this.precio.nativeElement.value.toString())));
    formData.append('categoria', unescape(encodeURIComponent(this.categoria.nativeElement.value)));
    formData.append('descripcion', unescape(encodeURIComponent(this.descripcion.nativeElement.value)));

    return this.http.post(this.rutaAgregarProducto, formData, {
      headers: {
        'Accept': 'application/json; charset=UTF-8' 
      }
    }).pipe(take(1)).subscribe({
        next: (respuesta) => {
          console.log('Respuesta del servidor:', respuesta);
        },
        error: (error) => {
          let erroresEncontrados: string[] = [];
          console.error('Error en la petición:', error);
          Object.keys(error.errores).forEach(error => {
            erroresEncontrados.push(error);
          });
          this.mostrarErroresRecibidos(erroresEncontrados);
        },
        complete: () => {

          this.productosSharedService.emitirEventoNuevoProducto();
          this.setOpen(true);
          
        }});

  }
  
  /* Acá se controlan los elementos de los popup ------- */
  
  isAlertOpen = false;
  alertButtons = ['Aceptar'];
  /* alertButtons = ['Action']; */

  setOpen(isOpen: boolean) {
    this.isAlertOpen = isOpen;
  }

  /* private imagen: File | null;

  public onFileChange(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.imagen = file;
      console.log('Imagen cargada:', file.name);
    }
  } */
}
