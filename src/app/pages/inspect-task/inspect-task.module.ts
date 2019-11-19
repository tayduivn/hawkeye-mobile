import { DirectiveModule } from './../../directives/directive.module';
import { WidgetModule } from './../../widget/widget.module';
import { ShowFactoryPipe } from './../../pipe/show-factory.pipe';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { InspectTaskPage } from './inspect-task.page';
import { SkuDetailPage } from './sku-detail/sku-detail.page';
import { InspectContractPage } from './inspect-contract/inspect-contract.page';
import { FlexLayoutModule } from '@angular/flex-layout';
import { InspectorSettingComponent } from '../inspector-setting/inspector-setting.component';
import { SkuDescriptionComponent } from './sku-description/sku-description.component';

const routes: Routes = [
    {
        path: 'inspect-task',
        component: InspectTaskPage,
    },
    {
        path: 'inspect-contract',
        component: InspectContractPage,
    },
    {
        path: 'sku-detail',
        component: SkuDetailPage,
    },
    {
        path: 'sku-desc',
        component: SkuDescriptionComponent,
    },
    {
        path: 'inspector-setting/:cid',
        component: InspectorSettingComponent,
    },
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        FlexLayoutModule,
        WidgetModule,
        DirectiveModule,
        ReactiveFormsModule,
        RouterModule.forChild(routes),
    ],
    declarations: [
        InspectTaskPage,
        ShowFactoryPipe,
        SkuDetailPage,
        InspectContractPage,
        InspectorSettingComponent,
        SkuDescriptionComponent,
    ],
})
export class InspectTaskPageModule {}

/**
 * session description
 * CURRENT_INSPECT_GROUP           =>       inspect group of current  first level data
 * CURRENT_INSPECT_CONTRACT        =>       inspect contract of current  second level data
 * SKU_INFO                        =>       inspect sku of contract  three level data
 */
