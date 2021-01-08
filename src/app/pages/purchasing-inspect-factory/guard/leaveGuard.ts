import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { PageEffectService } from 'src/app/services/page-effect.service';
import { FactoryBaseInformationComponent } from '../add-new-inspect-factory/factory-base-information/factory-base-information.component';
import { FactoryGeneralSituationComponent } from '../add-new-inspect-factory/factory-general-situation/factory-general-situation.component';
import { TabStatusService } from '../tab-status.service';
import { ProductInformationComponent } from '../add-new-inspect-factory/product-information/product-information.component';
import { SpecimenInformationComponent } from '../add-new-inspect-factory/specimen-information/specimen-information.component';
@Injectable({
    providedIn: 'root',
})
export class LeaveGuard1 implements CanDeactivate<FactoryBaseInformationComponent> {
    constructor(private tab: TabStatusService, private es: PageEffectService) {}

    canDeactivate(
        component: FactoryBaseInformationComponent,
        currentRoute: ActivatedRouteSnapshot,
        currentState: RouterStateSnapshot,
        nextState?: RouterStateSnapshot,
    ): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        const status = component.confirm();
        return new Promise(resolve => {
            if (status) {
                resolve(true);
                this.tab.canClick$.next(true);
            } else {
                this.es.showAlert({
                    message: '当前有新增或修改项,是否确定离开?',
                    buttons: [
                        {
                            text: '取消',
                            handler: () => {
                                resolve(false);
                                this.tab.canClick$.next(false);
                            },
                        },
                        {
                            text: '离开',
                            handler: () => {
                                resolve(true);
                                this.tab.canClick$.next(true);
                            },
                        },
                    ],
                });
            }
        });
    }
}

export class LeaveGuard2 implements CanDeactivate<FactoryGeneralSituationComponent> {
    constructor(private tab: TabStatusService, private es: PageEffectService) {}

    canDeactivate(
        component: FactoryGeneralSituationComponent,
        currentRoute: ActivatedRouteSnapshot,
        currentState: RouterStateSnapshot,
        nextState?: RouterStateSnapshot,
    ): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        const status = component.confirm();
        return new Promise(resolve => {
            if (status) {
                resolve(true);
                this.tab.canClick$.next(true);
            } else {
                this.es.showAlert({
                    message: '当前有新增或修改项,是否确定离开?',
                    buttons: [
                        {
                            text: '取消',
                            handler: () => {
                                resolve(false);
                                this.tab.canClick$.next(false);
                            },
                        },
                        {
                            text: '离开',
                            handler: () => {
                                resolve(true);
                                this.tab.canClick$.next(true);
                            },
                        },
                    ],
                });
            }
        });
    }
}

export class LeaveGuard3 implements CanDeactivate<ProductInformationComponent> {
    constructor(private tab: TabStatusService, private es: PageEffectService) {}

    canDeactivate(
        component: ProductInformationComponent,
        currentRoute: ActivatedRouteSnapshot,
        currentState: RouterStateSnapshot,
        nextState?: RouterStateSnapshot,
    ): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        const status = component.confirm();
        return new Promise(resolve => {
            if (status) {
                resolve(true);
                this.tab.canClick$.next(true);
            } else {
                this.es.showAlert({
                    message: '当前有新增或修改项,是否确定离开?',
                    buttons: [
                        {
                            text: '取消',
                            handler: () => {
                                resolve(false);
                                this.tab.canClick$.next(false);
                            },
                        },
                        {
                            text: '离开',
                            handler: () => {
                                resolve(true);
                                this.tab.canClick$.next(true);
                            },
                        },
                    ],
                });
            }
        });
    }
}

export class LeaveGuard4 implements CanDeactivate<SpecimenInformationComponent> {
    constructor(private tab: TabStatusService, private es: PageEffectService) {}

    canDeactivate(
        component: SpecimenInformationComponent,
        currentRoute: ActivatedRouteSnapshot,
        currentState: RouterStateSnapshot,
        nextState?: RouterStateSnapshot,
    ): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        const status = component.confirm();
        return new Promise(resolve => {
            if (status) {
                resolve(true);
                this.tab.canClick$.next(true);
            } else {
                this.es.showAlert({
                    message: '当前有新增或修改项,是否确定离开?',
                    buttons: [
                        {
                            text: '取消',
                            handler: () => {
                                resolve(false);
                                this.tab.canClick$.next(false);
                            },
                        },
                        {
                            text: '离开',
                            handler: () => {
                                resolve(true);
                                this.tab.canClick$.next(true);
                            },
                        },
                    ],
                });
            }
        });
    }
}
