import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AlertaService {
  msg = signal<string>('');

  setMessage(message: string) {
    this.msg.set(message);
  }
  clearMessage() {
    this.msg.set('');
  }
}
