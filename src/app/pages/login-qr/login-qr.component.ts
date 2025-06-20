import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  signal,
  ViewChild,
} from '@angular/core';
import { CustomModalComponent } from '../../components/shared/custom-modal/custom-modal.component';
import { BarcodeFormat } from '@zxing/library';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { SpinnerComponent } from '../../components/shared/spinner/spinner.component';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { StorageService } from '../../services/storage.service';
import { ErroresBackendComponent } from '../../components/shared/errores-backend/errores-backend.component';

@Component({
  selector: 'app-login-qr',
  imports: [ZXingScannerModule, SpinnerComponent, ErroresBackendComponent],
  templateUrl: './login-qr.component.html',
  styleUrl: './login-qr.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LoginQrComponent {
  camara = signal<boolean>(true);
  hideScanner = signal<boolean>(false);

  private authService = inject(AuthService);
  private router = inject(Router);
  msgErrores = signal<string>('');

  allowedFormats: BarcodeFormat[] = [
    BarcodeFormat.QR_CODE,
    BarcodeFormat.EAN_13,
    BarcodeFormat.CODE_128,
    BarcodeFormat.DATA_MATRIX,
  ];

  async escanearQR(event: any) {
    if (event) {
      this.hideScanner.set(true);
      console.log(event, 'ESCANER LOGIN QR');
      try {
        await this.authService.loginWithQR(event);

        setTimeout(() => {
          this.router.navigateByUrl('/');
        }, 1000);
      } catch (error: any) {
        this.msgErrores.set(error.error.message);
        console.log(error);

        setTimeout(() => {
          this.msgErrores.set('');
          this.hideScanner.set(false);
        }, 2000);
      }
    }
  }

  camaranoEncontrada(e: any) {
    // this.camara = false;
    this.camara.set(false);
  }
}
