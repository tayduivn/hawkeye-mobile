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
        if (!status) {
            this.es.showToast({
                message: '有新增或修改项，请先保存',
                duration: 1500,
                color: 'danger',
            });
        }
        this.tab.canClick$.next(status); //把当前的状态传到组件  如果时false  那么就阻止路由跳转
        return status;
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
        if (!status) {
            this.es.showToast({
                message: '有新增或修改项，请先保存',
                duration: 1500,
                color: 'danger',
            });
        }
        this.tab.canClick$.next(status); //把当前的状态传到组件  如果时false  那么就阻止路由跳转
        return status;
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
        if (!status) {
            this.es.showToast({
                message: '有新增或修改项，请先保存',
                duration: 1500,
                color: 'danger',
            });
        }
        this.tab.canClick$.next(status); //把当前的状态传到组件  如果时false  那么就阻止路由跳转
        return status;
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
        if (!status) {
            this.es.showToast({
                message: '有新增或修改项，请先保存',
                duration: 1500,
                color: 'danger',
            });
        }
        this.tab.canClick$.next(status); //把当前的状态传到组件  如果时false  那么就阻止路由跳转
        return status;
    }
}
