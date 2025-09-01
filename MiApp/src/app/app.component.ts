import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { StatusBar } from '@capacitor/status-bar';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  constructor(private platform: Platform) {
    this.initializeApp();
  }

  private initializeApp() {
    this.platform.ready().then(() => {
      // Evita que el contenido se superponga a la barra de estado
      StatusBar.setOverlaysWebView({ overlay: false });

      // Opcional: cambia el color de la barra de estado
      StatusBar.setBackgroundColor({ color: '#687FE5' });
    });
  }
}
