import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { LoginPage } from './login.page';
import { SecureStorage } from '@ionic-native/secure-storage/ngx';

const routes: Routes = [
    {
        path: 'login',
        component: LoginPage,
    },
];

@NgModule({
    imports: [CommonModule, IonicModule, RouterModule.forChild(routes), FormsModule, ReactiveFormsModule],
    declarations: [LoginPage],
    providers: [SecureStorage],
})
export class LoginPageModule {}
