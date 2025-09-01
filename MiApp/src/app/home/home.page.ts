import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false
})
export class HomePage implements OnInit {
  email: string | null = null;
  isLoading = true;

  constructor(private auth: AuthService, private router: Router) {}

  async ngOnInit() {
    try {
      this.email = await this.auth.getUserEmail();
    } finally {
      this.isLoading = false;
    }
  }

  async refresh(ev: CustomEvent) {
    try {
      this.isLoading = true;
      this.email = await this.auth.getUserEmail();
    } finally {
      (ev.detail as any).complete();
      this.isLoading = false;
    }
  }

  async logout() {
    try {
      await this.auth.signOut();  // ← implementado en tu AuthService
    } finally {
      this.email = null;
      this.router.navigateByUrl('/login', { replaceUrl: true });
    }
  }
}
