import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AuthService } from '../auth.service';
import { supabase } from '../supabase.client';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  standalone: false
})
export class RegistroPage {
  email = '';
  password = '';
  password2 = '';
  loading = false;
  errorMsg = '';
  showPwd = false;
  showPwd2 = false;

  passwordsMatch = false;
  confirmTouched = false;
  emailTaken = false; // bandera “correo ya registrado”

  constructor(
    private auth: AuthService,
    private router: Router,
    private toastCtrl: ToastController
  ) {}

  togglePwd()  { this.showPwd  = !this.showPwd; }
  togglePwd2() { this.showPwd2 = !this.showPwd2; }

  copyPwdToConfirm() {
    this.password2 = this.password;
    this.confirmTouched = true;
    this.checkMatch();
  }

  checkMatch() {
    this.passwordsMatch = !!this.password && !!this.password2 && this.password === this.password2;
  }

  async onSubmit(form: NgForm) {
    if (this.loading || !form.valid || !this.passwordsMatch) return;
    this.errorMsg = '';
    this.emailTaken = false;
    this.loading = true;

    const normalizedEmail = this.email.trim().toLowerCase();

    try {
      // 1) Crear usuario en Supabase
      const user = await this.auth.signUp(normalizedEmail, this.password);

      // 2) (Opcional) Crear/actualizar perfil en tu tabla "profiles"
      if (user?.id) {
        await supabase.from('profiles').upsert({
          id: user.id,
          email: normalizedEmail,
          created_at: new Date().toISOString()
        });
      }

      const t = await this.toastCtrl.create({
        message: '✅ Cuenta creada. Revisá tu correo para confirmar (si tu proyecto lo requiere).',
        duration: 2500,
        position: 'top'
      });
      await t.present();

      // 3) Redirigir a login
      await this.router.navigateByUrl('/login', { replaceUrl: true });

    } catch (e: any) {
      // Manejamos casos conocidos
      if (e?.code === 'email_exists') {
        this.emailTaken = true;
        this.errorMsg = '';
        const t = await this.toastCtrl.create({
          message: '⚠️ Ese correo ya está registrado. Probá iniciar sesión o recuperar tu clave.',
          duration: 2600,
          position: 'top',
          color: 'warning'
        });
        await t.present();
      } else {
        this.errorMsg = e?.message ?? 'Error al crear la cuenta';
        const t = await this.toastCtrl.create({
          message: `❌ ${this.errorMsg}`,
          duration: 2600,
          position: 'top',
          color: 'danger'
        });
        await t.present();
      }
    } finally {
      this.loading = false;
    }
  }
}
