import { DetailComponent } from './detail/detail.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { EvaluatePage } from './evaluate.page';

const routes: Routes = [
  {
    path: 'evaluate',
    component: EvaluatePage
  },
  {
    path: 'evaluate/detail/:id',
    component: DetailComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FlexLayoutModule,
    RouterModule.forChild(routes)
  ],
  declarations: [EvaluatePage,DetailComponent]
})
export class EvaluatePageModule {}
