import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Socket, io } from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class ClientSocketIoService {
  private socket!: Socket;

  constructor() {
    this.connect();
  }

  private connect(): void {
    // this.socket = io('http://localhost:3000'); // Ajusta URL según tu backend
    this.socket = io('https://qrud-backend-latest.onrender.com'); // Ajusta URL según tu backend
  }

  // Emitir un evento
  // sendMessage(message: string): void {
  //   this.socket.emit('test', { texto: message });
  // }

  // // Escuchar un evento
  // onMessage(): Observable<any> {
  //   return new Observable((observer) => {
  //     this.socket.on('test-response', (data) => {
  //       observer.next(data);
  //     });
  //   });
  // }
  onUpdatePermissions(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('updateRolPermissions', (data) => {
        observer.next(data);
      });
    });
  }

  // Desconectar
  disconnect(): void {
    this.socket.disconnect();
  }
}
