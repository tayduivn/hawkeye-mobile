import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { FactoryAssessPage } from './factory-assess.page';

import { AssessDetailsComponent } from './assess-details/assess-details.component';
const routes: Routes = [
    {
        path: 'factory-assess',
        component: FactoryAssessPage,
    },
    {
        path: 'assess-details',
        component: AssessDetailsComponent,
    },
];

@NgModule({
    imports: [CommonModule, FormsModule, IonicModule, RouterModule.forChild(routes)],
    declarations: [FactoryAssessPage, AssessDetailsComponent],
})
export class FactoryAssessPageModule {}
