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

  constructor(
    private auth: AuthService,
    private router: Router,
    private toastCtrl: ToastController
  ) {}

  togglePwd()  { this.showPwd  = !this.showPwd; }
  togglePwd2() { this.showPwd2 = !this.showPwd2; }

  copyPwdToConfirm() {
    this.password2 = this.password;
    // marcamos como “tocado” para que, si hay error, se muestre; y recalculamos match
    this.confirmTouched = true;
    this.checkMatch();
  }

  checkMatch() {
    this.passwordsMatch = !!this.password && !!this.password2 && this.password === this.password2;
  }

  async onSubmit(form: NgForm) {
    if (this.loading || !form.valid || !this.passwordsMatch) return;
    this.errorMsg = '';
    this.loading = true;

    try {
      // 1) Crear usuario en Supabase
      const user = await this.auth.signUp(this.email.trim(), this.password);

      // 2) (Opcional) Crear perfil en tu tabla "profiles"
      if (user?.id) {
        await supabase.from('profiles').upsert({
          id: user.id,
          email: this.email.trim(),
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
      this.errorMsg = e?.message ?? 'Error al crear la cuenta';
      const t = await this.toastCtrl.create({
        message: `❌ ${this.errorMsg}`,
        duration: 2500,
        position: 'top',
        color: 'danger'
      });
      await t.present();
    } finally {
      this.loading = false;
    }
  }
}
