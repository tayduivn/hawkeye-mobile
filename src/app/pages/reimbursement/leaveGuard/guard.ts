// import { Injectable } from '@angular/core';
// import { CanDeactivate, UrlTree } from '@angular/router';
// import { Observable } from 'rxjs';
// import { PageEffectService } from 'src/app/services/page-effect.service';
// import { NormalComponent } from '../add-new-errand-reimbursement/normal/normal.component';
// import { SelfDriveComponent } from '../add-new-errand-reimbursement/self-drive/self-drive.component';
// import { TabSaveService } from '../tab-save.service';
// @Injectable({
//     providedIn: 'root',
// })
// export class LeaveGuard implements CanDeactivate<NormalComponent> {
//     constructor(private es: PageEffectService, private tabSave: TabSaveService) {}

//     canDeactivate(
//         component: NormalComponent,
//     ): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
//         const status = component.confirm();
//         const isback = window.sessionStorage.getItem('reimbursementBACK');
//         // console.log(status);
//         // 此处return的东西代表的就是是否同意跳转   true的时候就同意跳转
//         // return true;
//         // return status;
//         // 点击了返回
//         if (isback == 'BACK') {
//             //有修改项
//             return new Promise(resolve => {
//                 if (!status) {
//                     this.es.showAlert({
//                         message: '当前有新增或修改项，是否离开?',
//                         buttons: [
//                             {
//                                 text: '留下',
//                                 handler: () => {
//                                     resolve(false);
//                                 },
//                             },
//                             {
//                                 text: '离开',
//                                 handler: () => {
//                                     resolve(true);
//                                 },
//                             },
//                         ],
//                     });
//                 } else {
//                     resolve(true);
//                 }
//             });
//         } else {
//             // 普通的切换
//             return new Promise(resolve => {
//                 if (!status) {
//                     this.es.showAlert({
//                         message: '当前有新增或修改项，是否保存?',
//                         buttons: [
//                             {
//                                 text: '取消',
//                                 handler: () => {
//                                     resolve(true);
//                                     this.tabSave.tabSave$.next({
//                                         save: false,
//                                         toggle: true,
//                                     });
//                                 },
//                             },
//                             {
//                                 text: '保存',
//                                 handler: () => {
//                                     resolve(false);
//                                     // 调用保存
//                                     this.tabSave.tabSave$.next({
//                                         save: true,
//                                         toggle: false,
//                                     });
//                                 },
//                             },
//                         ],
//                     });
//                 } else {
//                     resolve(true);
//                 }
//             });
//         }
//     }
// }
// export class LeaveGuard1 implements CanDeactivate<SelfDriveComponent> {
//     constructor(private es: PageEffectService, private tabSave: TabSaveService) {}

//     canDeactivate(
//         component: SelfDriveComponent,
//     ): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
//         const status = component.confirm();
//         const isback = window.sessionStorage.getItem('reimbursementBACK');
//         // console.log(status);
//         // 此处return的东西代表的就是是否同意跳转   true的时候就同意跳转
//         // return true;
//         // return status;
//         // 点击了返回
//         if (isback == 'BACK') {
//             //有修改项
//             return new Promise(resolve => {
//                 if (!status) {
//                     this.es.showAlert({
//                         message: '当前有新增或修改项，是否离开?',
//                         buttons: [
//                             {
//                                 text: '留下',
//                                 handler: () => {
//                                     resolve(false);
//                                 },
//                             },
//                             {
//                                 text: '离开',
//                                 handler: () => {
//                                     resolve(true);
//                                 },
//                             },
//                         ],
//                     });
//                 } else {
//                     resolve(true);
//                 }
//             });
//         } else {
//             // 普通的切换
//             return new Promise(resolve => {
//                 if (!status) {
//                     this.es.showAlert({
//                         message: '当前有新增或修改项，是否保存?',
//                         buttons: [
//                             {
//                                 text: '取消',
//                                 handler: () => {
//                                     resolve(false);
//                                     this.tabSave.tabSave$.next({
//                                         save: false,
//                                         toggle: true,
//                                     });
//                                 },
//                             },
//                             {
//                                 text: '保存',
//                                 handler: () => {
//                                     resolve(true);
//                                     // 调用保存
//                                     this.tabSave.tabSave$.next({
//                                         save: true,
//                                         toggle: false,
//                                     });
//                                 },
//                             },
//                         ],
//                     });
//                 } else {
//                     resolve(true);
//                 }
//             });
//         }
//     }
// }
