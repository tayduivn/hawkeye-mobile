import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { PageEffectService } from 'src/app/services/page-effect.service';
import { FactoryBaseInformationComponent } from '../add-new-inspect-factory/factory-base-information/factory-base-information.component';
import { TabStatusService } from '../tab-status.service';

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
            });
        }
        this.tab.canClick$.next(status); //把当前的状态传到组件  如果时false  那么就阻止路由跳转
        return status;
    }
}
