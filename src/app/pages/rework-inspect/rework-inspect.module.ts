import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ReworkInspectPage } from './rework-inspect.page';
import { InspectPoComponent } from './inspect-po/inspect-po.component';
import { ReworkSkuComponent } from './rework-sku/rework-sku.component';
import { WidgetModule } from 'src/app/widget/widget.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { EvaluateDetailComponent } from './evaluate-detail/evaluate-detail.component';
import { DirectiveModule } from 'src/app/directives/directive.module';
const routes: Routes = [
    {
        path: '',
        component: ReworkInspectPage,
    },
    {
        path: 'rework-po/:factory_id',
        component: InspectPoComponent,
    },
    {
        path: 'rework-sku/:apply_inspection_no/:contract_no/:sku',
        component: ReworkSkuComponent,
    },
    {
        path: 'evaluate/:id/:applyId/:applyNo',
        component: EvaluateDetailComponent,
    },
    {
        path:'evaluate-reload/:id/:applyId/:applyNo',
        component: EvaluateDetailComponent
    }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild(routes),
        WidgetModule,
        ReactiveFormsModule,
        FlexLayoutModule,
        DirectiveModule
    ],
    declarations: [ReworkInspectPage, InspectPoComponent, ReworkSkuComponent, EvaluateDetailComponent],
})
export class ReworkInspectPageModule {}
