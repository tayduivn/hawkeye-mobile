import { DetailComponent } from './detail/detail.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { DataContrastPage } from './data-contrast.page';
import { DataComparePipe } from 'src/app/pipe/data-compare.pipe';
import { WidgetModule } from '../../widget/widget.module';
import { DirectiveModule } from 'src/app/directives/directive.module';
import { LazyLoadImageModule } from 'ng-lazyload-image';

const routes: Routes = [
    {
        path: 'data-contrast',
        component: DataContrastPage,
    },
    {
        path: 'data-contrast/detail/:contract_id/:apply_no/:sku',
        component: DetailComponent,
    },
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        FlexLayoutModule,
        LazyLoadImageModule,
        IonicModule,
        RouterModule.forChild(routes),
        WidgetModule,
        DirectiveModule,
    ],
    declarations: [DataContrastPage, DataComparePipe, DetailComponent],
})
export class DataContrastPageModule {}
