import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { PurchasingInspectFactoryPage } from './purchasing-inspect-factory.page';
import { AddNewInspectFactoryComponent } from './add-new-inspect-factory/add-new-inspect-factory.component';
import { WidgetModule } from 'src/app/widget/widget.module';
import { FactoryInformationComponent } from './add-new-inspect-factory/product-information/factory-information/factory-information.component';
import { FactoryCooperationProductComponent } from './add-new-inspect-factory/product-information/factory-cooperation-product/factory-cooperation-product.component';

// 导入四个子组件
// 工厂基本信息组件
import { FactoryBaseInformationComponent } from './add-new-inspect-factory/factory-base-information/factory-base-information.component';
// 工厂概况
import { FactoryGeneralSituationComponent } from './add-new-inspect-factory/factory-general-situation/factory-general-situation.component';
// 产品信息组件
import { ProductInformationComponent } from './add-new-inspect-factory/product-information/product-information.component';
// 样品信息组件
import { SpecimenInformationComponent } from './add-new-inspect-factory/specimen-information/specimen-information.component';

// 导入路由钩子函数
import { LeaveGuard1 } from './guard/leaveGuard';
const routes: Routes = [
    {
        path: 'purchasing-factory',
        component: PurchasingInspectFactoryPage,
    },
    {
        path: 'add-new-inspect-factory',
        component: AddNewInspectFactoryComponent,
        children: [
            {
                path: '',
                component: FactoryBaseInformationComponent,
                canDeactivate: [LeaveGuard1],
            },
            {
                path: 'factory-general-situation',
                component: FactoryGeneralSituationComponent,
            },
            {
                path: 'product-information',
                component: ProductInformationComponent,
            },
            {
                path: 'specimen-information',
                component: SpecimenInformationComponent,
            },
        ],
    },
];

@NgModule({
    imports: [CommonModule, FormsModule, IonicModule, RouterModule.forChild(routes), WidgetModule],
    declarations: [
        PurchasingInspectFactoryPage,
        AddNewInspectFactoryComponent,
        FactoryInformationComponent,
        FactoryCooperationProductComponent,
        FactoryBaseInformationComponent,
        FactoryGeneralSituationComponent,
        ProductInformationComponent,
        SpecimenInformationComponent,
    ],
})
export class PurchasingInspectFactoryPageModule {}
