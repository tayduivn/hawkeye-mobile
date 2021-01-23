import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { AddNewErrandReimbursementComponent } from 'src/app/pages/reimbursement/add-new-errand-reimbursement/add-new-errand-reimbursement.component';
import { ErrandReimbursementDetailsComponent } from 'src/app/pages/reimbursement/errand-reimbursement-details/errand-reimbursement-details.component';
import { CompileErrandReimbursementComponent } from 'src/app/pages/reimbursement/compile-errand-reimbursement/compile-errand-reimbursement.component';
import { NormalComponent } from 'src/app/pages/reimbursement/add-new-errand-reimbursement/normal/normal.component';
import { SelfDriveComponent } from 'src/app/pages/reimbursement/add-new-errand-reimbursement/self-drive/self-drive.component';
import { IonicModule } from '@ionic/angular';
import { ReimbursementPage } from './reimbursement.page';
import { WidgetModule } from 'src/app/widget/widget.module';
const routes: Routes = [
    {
        path: 'errand-reimbursement',
        component: ReimbursementPage,
    },
    {
        path: 'add-new-errand-reimbursement',
        component: AddNewErrandReimbursementComponent,
    },
    {
        path: 'normal',
        component: NormalComponent,
    },
    {
        path: 'self-drive',
        component: SelfDriveComponent,
    },
    {
        path: 'errand-reimbursement-details',
        component: ErrandReimbursementDetailsComponent,
    },
    {
        path: 'compile-errand-reimbursement',
        component: CompileErrandReimbursementComponent,
    },
];

@NgModule({
    imports: [CommonModule, FormsModule, IonicModule, RouterModule.forChild(routes), WidgetModule],
    declarations: [
        ReimbursementPage,
        AddNewErrandReimbursementComponent,
        ErrandReimbursementDetailsComponent,
        CompileErrandReimbursementComponent,
        NormalComponent,
        SelfDriveComponent,
    ],
})
export class ReimbursementPageModule {}
