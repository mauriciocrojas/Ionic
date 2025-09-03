import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AuthService } from '../auth.service';

type PresetKey = 'mau' | 'mcc' | 'nico';

interface Preset {
  key: PresetKey;
  label: string;     // cómo se muestra
  email: string;
  password: string;
  initials: string;  // fallback si no hay avatar
  avatar?: string | null;
  short: string;     // email acortado para UI
  shape: 'shape-hex' | 'shape-kite' | 'shape-squircle';
}

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

  // ⚠️ Cambiá las passwords de demo si hace falta
  presets: Preset[] = [
    {
      key: 'mau',
      label: 'Mau Rojas',
      email: 'mauguitar17@gmail.com',
      password: '123456',
      initials: 'MR',
      avatar: null, // ej: 'assets/avatars/mau.png'
      short: this.shortenEmail('mauguitar17@gmail.com'),
      shape: 'shape-hex',
    },
    {
      key: 'mcc',
      label: 'Mauricio CC',
      email: 'mauriciocc.rojas@gmail.com',
      password: '123456',
      initials: 'MC',
      avatar: null, // ej: 'assets/avatars/mcc.png'
      short: this.shortenEmail('mauriciocc.rojas@gmail.com'),
      shape: 'shape-kite',
    },
    {
      key: 'nico',
      label: 'Nico Migliarino',
      email: 'nmigliarino@gmail.com',
      password: '123456',
      initials: 'NM',
      avatar: null, // ej: 'assets/avatars/nico.png'
      short: this.shortenEmail('nmigliarino@gmail.com'),
      shape: 'shape-squircle',
    },
  ];

  constructor(
    private auth: AuthService,
    private router: Router,
    private toastCtrl: ToastController
  ) {
    const saved = localStorage.getItem('login_email');
    if (saved) this.email = saved;
  }

  togglePwd() {
    this.showPwd = !this.showPwd;
  }

  /** Tocar un preset: precarga credenciales y envía el login automáticamente */
  quickFill(key: PresetKey, form: NgForm, autoSubmit: boolean = true) {
    if (this.loading) return;
    const p = this.presets.find(x => x.key === key);
    if (!p) return;

    this.email = p.email;
    this.password = p.password;

    // Marca el form como válido y dispara submit si se desea
    setTimeout(() => {
      form.control.updateValueAndValidity();
      if (autoSubmit) {
        this.onSubmit(form);
      }
    }, 0);
  }

  /** Acorta el email para la UI (usuario@dominio → usuario@…) */
  private shortenEmail(email: string): string {
    const [user, domain] = email.split('@');
    return domain ? `${user}@…` : email;
  }

  async onSubmit(form: NgForm) {
    if (this.loading || !form.valid) return;
    this.errorMsg = '';
    this.loading = true;

    try {
      await this.auth.signIn(this.email.trim(), this.password);

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
