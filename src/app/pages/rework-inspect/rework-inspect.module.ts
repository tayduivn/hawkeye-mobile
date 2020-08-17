import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ReworkInspectPage } from './rework-inspect.page';
const routes: Routes = [
    {
        path: '',
        component: ReworkInspectPage,
    },
];

@NgModule({
    imports: [CommonModule, FormsModule, IonicModule, RouterModule.forChild(routes)],
    declarations: [ReworkInspectPage],
})
export class ReworkInspectPageModule {}
