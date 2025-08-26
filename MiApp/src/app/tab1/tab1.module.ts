import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';
import { Tab1LoginPage } from './tab1.page';

const routes: Routes = [{ path: '', component: Tab1LoginPage }];

@NgModule({
  declarations: [Tab1LoginPage],
  imports: [CommonModule, FormsModule, IonicModule, RouterModule.forChild(routes)]
})
export class Tab1LoginPageModule {}
