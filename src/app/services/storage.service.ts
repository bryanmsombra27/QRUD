import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import * as CryptoJS from 'crypto-js';
const { secret_key } = environment;

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  mensajeEncriptado: string = '';

  mensajeDesencriptado: string = '';

  constructor() {}

  async encryptar(llave: string, text: string) {
    this.mensajeEncriptado = CryptoJS.AES.encrypt(text, secret_key).toString();
    sessionStorage.setItem(llave, this.mensajeEncriptado);
  }

  desencriptar(llave: any) {
    const valor: any = this.obtenerDeLocalStorage(llave) || '';

    const textoOriginal = CryptoJS.AES.decrypt(valor, secret_key);
    this.mensajeDesencriptado = textoOriginal.toString(CryptoJS.enc.Utf8);

    return this.mensajeDesencriptado;
  }

  obtenerDeLocalStorage(key: string) {
    const valor = sessionStorage.getItem(key) || '';
    return valor;
  }

  guardarSesionStorage(llave: string, valor: any) {
    sessionStorage.setItem(llave, valor);
  }
}
