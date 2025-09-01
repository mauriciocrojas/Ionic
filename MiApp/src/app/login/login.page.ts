import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage {
  email = '';
  password = '';
  remember = true;
  loading = false;
  errorMsg = '';
  showPwd = false;

  constructor(
    private auth: AuthService,
    private router: Router,
    private toastCtrl: ToastController
  ) {
    // Prefill si el usuario eligió "Recordarme"
    const saved = localStorage.getItem('login_email');
    if (saved) this.email = saved;
  }

  togglePwd() {
    this.showPwd = !this.showPwd;
  }

  /** Rellena el formulario con credenciales de demo */
  prefill(form: NgForm) {
    this.email = 'mauguitar17@gmail.com';
    this.password = '123456';
    // Asegura que el formulario se marque como válido inmediatamente
    setTimeout(() => form.control.updateValueAndValidity(), 0);
  }

  async onSubmit(form: NgForm) {
    if (this.loading || !form.valid) return;
    this.errorMsg = '';
    this.loading = true;

    try {
      await this.auth.signIn(this.email.trim(), this.password);

      // Guardar email si corresponde
      if (this.remember) {
        localStorage.setItem('login_email', this.email.trim());
      } else {
        localStorage.removeItem('login_email');
      }

      const t = await this.toastCtrl.create({
        message: '✅ Inicio de sesión correcto',
        duration: 1500,
        position: 'top',
      });
      await t.present();

      await this.router.navigateByUrl('/home', { replaceUrl: true });
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
