import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { LoginGuard } from './guard/login.guard';
import { LoginCanLeaveGuard } from './guard/login-can-leave.guard';
import { LoginCanEnterGuard } from './guard/login-can-enter.guard';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
    },
    {
        path: '',
        loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule),
        canDeactivate: [LoginCanLeaveGuard],
        canActivate: [LoginCanEnterGuard],
    },
    {
        path: '',
        canActivate: [LoginGuard],
        loadChildren: () => import('./pages/welcome/welcome.module').then(m => m.WelcomePageModule),
    },
    {
        path: '',
        loadChildren: () => import('./pages/inspect-task/inspect-task.module').then(m => m.InspectTaskPageModule),
        canActivate: [LoginGuard],
    },
    {
        path: 'home',
        canActivate: [LoginGuard],
        loadChildren: () => import('./pages/home/home.module').then(m => m.HomePageModule),
    },

    {
        path: '',
        loadChildren: () =>
            import('./pages/implement-inspection/implement-inspection.module').then(
                m => m.ImplementInspectionPageModule,
            ),
        canActivate: [LoginGuard],
    },
    {
        path: '',
        loadChildren: () => import('./pages/inspection/inspection.module').then(m => m.InspectionPageModule),
        canActivate: [LoginGuard],
    },
    {
        path: '',
        loadChildren: () => import('./pages/evaluate/evaluate.module').then(m => m.EvaluatePageModule),
        canActivate: [LoginGuard],
    },
    { 
        path: '', 
        loadChildren: () => import('./pages/data-contrast/data-contrast.module').then(m => m.DataContrastPageModule),
        canActivate: [LoginGuard],
    },
    {
        path: '**',
        redirectTo: 'welcome',
        pathMatch: 'full',
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
    exports: [RouterModule],
})
export class AppRoutingModule {}
