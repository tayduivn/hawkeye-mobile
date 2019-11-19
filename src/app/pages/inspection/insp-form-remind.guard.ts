import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { CanDeactivate } from '@angular/router';
import { InspectionPage } from './inspection/inspection.page';

@Injectable({
    providedIn: 'root',
})
export class InspFormRemindGuard implements CanDeactivate<InspectionPage> {
    route: ActivatedRouteSnapshot;
    public component: InspectionPage;
    canDeactivate(
        component: InspectionPage,
        currentRoute: ActivatedRouteSnapshot,
        currentState: RouterStateSnapshot,
        nextState?: RouterStateSnapshot,
    ): boolean | UrlTree | import('rxjs').Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        if (!component.isFormDirty()) {
            return window.confirm('确定要离开吗？');
        } else return true;
    }

    constructor() {}
}
