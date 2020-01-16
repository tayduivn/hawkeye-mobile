import { DetailComponent } from './detail/detail.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { DataContrastPage } from './data-contrast.page';
import { DataComparePipe } from 'src/app/pipe/data-compare.pipe';

const routes: Routes = [
    {
        path: 'data-contrast',
        component: DataContrastPage,
    },
    {
        path: 'data-contrast/detail/:contract_id/:apply_no/:sku',
        component: DetailComponent
    }
];

@NgModule({
    imports: [CommonModule, FormsModule, FlexLayoutModule, IonicModule, RouterModule.forChild(routes)],
    declarations: [DataContrastPage,DataComparePipe,DetailComponent],
})
export class DataContrastPageModule {}
