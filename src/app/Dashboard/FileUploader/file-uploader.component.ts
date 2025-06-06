import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Capacitor } from '@capacitor/core';
import { IonCard, IonButton, IonRow, IonContent, IonCol, IonHeader } from "@ionic/angular/standalone";


@Component({
  standalone: true,
  selector: 'app-file-uploader',
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-uploader.component.scss'],
  imports: [IonHeader, IonCol, IonContent, IonRow, IonButton, IonCard, CommonModule]
})

export class FileUploaderComponent  {
  private imagenSeleccionada!: string | undefined | ArrayBuffer | null;

  @ViewChild('inputImagen') inputImagen!: ElementRef;

  public constructor()
  {
 
  }

  getImagenSeleccionada()
  {
    return this.imagenSeleccionada;
  }

  getValorInputImagen(){
    return this.base64ToBlob( this.imagenSeleccionada as string);
  }

  public async cargarImagen(event:any)
  {
    if (Capacitor.isNativePlatform()) {
      this.cargarImagenCapacitor(event);
      return;
    }
    
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = async() => {
      const base64 = reader.result as string;
      this.imagenSeleccionada = await this.recortarImagenCuadrada(base64);
    };
    reader.readAsDataURL(file);
   
    return
  }

  public abrirSelector()
  {
    this.inputImagen.nativeElement.value = '';
    this.inputImagen.nativeElement.click();
  }

  /* const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*'; */
   //this.inputImagen.nativeElement.onchange = async (event: any) => {

  public async cargarImagenCapacitor(event:any)
  {
    let rawBase64: string | ArrayBuffer | null = null;
      // En Android o iOS
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Prompt, // cámara o galería
    });

    this.imagenSeleccionada = image.dataUrl;
      
    if (typeof rawBase64 === 'string') {
      this.imagenSeleccionada = await this.recortarImagenCuadrada(rawBase64);
    }
  }

  recortarImagenCuadrada(base64: string): Promise<string> {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64;
      img.onload = () => {
        const lado = Math.min(img.width, img.height);
        const offsetX = (img.width - lado) / 2;
        const offsetY = (img.height - lado) / 2;
  
        const canvas = document.createElement('canvas');
        canvas.width = lado;
        canvas.height = lado;
  
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, offsetX, offsetY, lado, lado, 0, 0, lado, lado);
  
        const resultado = canvas.toDataURL('image/jpeg'); // Puedes usar 'image/png'
        resolve(resultado);
      };
    });
  }

  /*TRANSFORMA IMAGEN A BASE64*/
  private base64ToBlob(base64: string): Blob {
    try { 
        const parts = base64.split(',');
        const mime = parts[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
        const byteCharacters = atob(parts[1]);
        const byteArrays = [];
      
        for (let i = 0; i < byteCharacters.length; i++) {
          byteArrays.push(byteCharacters.charCodeAt(i));
        }
      
        const byteArray = new Uint8Array(byteArrays);
        return new Blob([byteArray], { type: mime });
      } catch (error) {
        console.error('Error al convertir base64 a Blob:', error);
        throw error;  // Lanza el error para manejarlo más arriba
    }
  }
}


