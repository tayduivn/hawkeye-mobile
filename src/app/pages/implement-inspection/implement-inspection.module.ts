import { ExamineDetailComponent } from './inspect-factory/examine-detail/examine-detail.component';
import { EvaluationComponent } from './evaluation/evaluation.component';
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
import { SkuGuard } from './sku.guard';
import { InspectTabBarComponent } from 'src/app/inspect-tab-bar/inspect-tab-bar.component';
import { InspectPartsComponent } from './inspect-parts/inspect-parts.component';
import { InspectCustomTestComponent } from './inspect-custom-test/inspect-custom-test.component';
import { InspectCheckComponent } from './inspect-check/inspect-check.component';

const routes: Routes = [
    {
        path: 'implement-inspection',
        component: ImplementInspectionPage,
    },
    {
        path: 'inspect-factory/:fid/:apply_group_id',
        component: InspectFactoryComponent,
    },
    {
        path: 'inspect-po/:fid',
        component: InspectPoComponent,
    },
    {
        path: 'inspect-sku/:contract_no',
        component: InspectSkuComponent,
        canDeactivate: [SkuGuard],
    },
    {
        path: 'inspect-evaluation',
        component: EvaluationComponent,
    },
    {
        path: 'inspect-parts',
        component: InspectPartsComponent
    },
    {
        path: 'inspect-check',
        component: InspectCheckComponent
    }
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
        EvaluationComponent,
        ExamineDetailComponent,
        InspectTabBarComponent,
        InspectPartsComponent,
        InspectCustomTestComponent,
        InspectCheckComponent
    ],
    providers: [Camera],
})
export class ImplementInspectionPageModule {}
