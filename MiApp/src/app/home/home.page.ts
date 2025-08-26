// home.page.ts
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false
})
export class HomePage implements OnInit {
  email: string | null = null;

  constructor(private auth: AuthService) {}

  async ngOnInit() {
    this.email = await this.auth.getUserEmail();
  }
}
