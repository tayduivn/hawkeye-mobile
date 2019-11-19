import { InspectSkuComponent } from './inspect-sku/inspect-sku.component';
import { DirectiveModule } from './../../directives/directive.module';
import { SkuListPipe } from './../../pipe/sku-list.pipe';
import { WidgetModule } from './../../widget/widget.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ImplementInspectionPage } from './implement-inspection.page';
import { ContractPipe } from 'src/app/pipe/contract.pipe';
import { InspectFactoryComponent } from './inspect-factory/inspect-factory.component';
import { Camera } from '@ionic-native/camera/ngx';
import { InspectPoComponent } from './inspect-po/inspect-po.component';
import { TestPipe } from 'src/app/pipe/test.pipe';

const routes: Routes = [
    {
        path: 'implement-inspection',
        component: ImplementInspectionPage,
    },
    {
        path: 'inspect-factory/:fid',
        component: InspectFactoryComponent,
    },
    {
        path: 'inspect-po/:fid',
        component: InspectPoComponent,
    },
    {
        path: 'inspect-sku',
        component: InspectSkuComponent,
    },
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        FlexLayoutModule,
        WidgetModule,
        DirectiveModule,
        IonicModule,
        ReactiveFormsModule,
        RouterModule.forChild(routes),
    ],
    declarations: [
        ImplementInspectionPage,
        ContractPipe,
        SkuListPipe,
        TestPipe,
        InspectFactoryComponent,
        InspectPoComponent,
        InspectSkuComponent,
    ],
    providers: [Camera],
})
export class ImplementInspectionPageModule {}
