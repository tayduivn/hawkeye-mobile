import { FlexLayoutModule } from '@angular/flex-layout';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { DataContrastPage } from './data-contrast.page';

const routes: Routes = [
  {
    path: 'data-contrast',
    component: DataContrastPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    FlexLayoutModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [DataContrastPage]
})
export class DataContrastPageModule {}
