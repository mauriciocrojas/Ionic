// tab1.page.ts
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './tab1.page.html',
  styleUrls: ['./tab1.page.scss'],
  standalone: false
})
export class Tab1LoginPage {
  email = '';
  password = '';
  loading = false;
  errorMsg = '';

  constructor(
    private auth: AuthService,
    private router: Router,
    private toastCtrl: ToastController
  ) {}

  async onSubmit(form: NgForm) {
    if (this.loading || !form.valid) return;
    this.errorMsg = '';
    this.loading = true;

    try {
      await this.auth.signIn(this.email.trim(), this.password);
      // 1) mensaje de OK
      const t = await this.toastCtrl.create({
        message: '✅ Inicio de sesión correcto',
        duration: 1500,
        position: 'top',
      });
      await t.present();

      // 2) si querés, navegás (dejé replaceUrl para no volver al login con “atrás”)
      await this.router.navigateByUrl('/tabs', { replaceUrl: true });
    } catch (e: any) {
      this.errorMsg = e?.message ?? 'Error de autenticación';
      const t = await this.toastCtrl.create({
        message: `❌ ${this.errorMsg}`,
        duration: 2000,
        position: 'top',
        color: 'danger',
      });
      await t.present();
    } finally {
      this.loading = false;
    }
  }
}
