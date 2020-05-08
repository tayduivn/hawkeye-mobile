import { DetailComponent } from './detail/detail.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { EvaluatePage } from './evaluate.page';
import { WidgetModule } from 'src/app/widget/widget.module';

const routes: Routes = [
    {
        path: 'evaluate',
        component: EvaluatePage,
    },
    {
        path: 'evaluate/detail/:id/:applyId/:applyNo',
        component: DetailComponent,
    },
    {
        path:'evaluate/reload/:id/:applyId/:applyNo',
        component: DetailComponent
    }
];

@NgModule({
    imports: [
        CommonModule, 
        FormsModule, 
        IonicModule, 
        FlexLayoutModule, 
        WidgetModule,
        RouterModule.forChild(routes)
    ],
    declarations: [EvaluatePage, DetailComponent],
})
export class EvaluatePageModule {}
