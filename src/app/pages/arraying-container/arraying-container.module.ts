import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ArrayingContainerPage } from './arraying-container.page';
import { DoneArrayListComponent } from './done-array-list/done-array-list.component';
import { InstalledCabinetsComponent } from './installed-cabinets/installed-cabinets.component';
import { FinalCabinetsComponent } from './final-cabinets/final-cabinets.component';
import { ListDetailComponent } from './list-detail/list-detail.component';
import { InstalledCabinetsDetailsComponent } from './installed-cabinets/installed-cabinets-details/installed-cabinets-details.component';
import { FinalCabinetsDetailsComponent } from './final-cabinets/final-cabinets-details/final-cabinets-details.component';
import { MainComponent } from './main/main.component';
import { DoneArrayListDetailsComponent } from './done-array-list/done-array-list-details/done-array-list-details.component';
const routes: Routes = [
    {
        path: 'arraying-container',
        component: MainComponent,
        children: [
            {
                path: '',
                component: ArrayingContainerPage,
            },
            {
                path: 'done-array-list',
                component: DoneArrayListComponent,
            },
            {
                path: 'installed-cabinets',
                component: InstalledCabinetsComponent,
            },
            {
                path: 'final-cabinets',
                component: FinalCabinetsComponent,
            },
        ],
    },
    {
        path: 'list-detail',
        component: ListDetailComponent,
    },
    {
        path: 'installed-cabinets-details',
        component: InstalledCabinetsDetailsComponent,
    },
    {
        path: 'final-cabinets-details',
        component: FinalCabinetsDetailsComponent,
    },
    {
        path: 'done-array-list-details',
        component: DoneArrayListDetailsComponent,
    },
];

@NgModule({
    imports: [CommonModule, FormsModule, IonicModule, RouterModule.forChild(routes)],
    declarations: [
        ArrayingContainerPage,
        DoneArrayListComponent,
        InstalledCabinetsComponent,
        FinalCabinetsComponent,
        ListDetailComponent,
        InstalledCabinetsDetailsComponent,
        FinalCabinetsDetailsComponent,
        MainComponent,
        DoneArrayListDetailsComponent,
    ],
})
export class ArrayingContainerPageModule {}
