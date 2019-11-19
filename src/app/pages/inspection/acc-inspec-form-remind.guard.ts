import { PageEffectService } from '../../services/page-effect.service';
import { AccInspecPage } from './acc-inspec/acc-inspec.page';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { CanDeactivate } from '@angular/router';

@Injectable({
    providedIn: 'root',
})
export class AccInspFormRemindGuard implements CanDeactivate<AccInspecPage> {
    route: ActivatedRouteSnapshot;
    public component: AccInspecPage;
    canDeactivate(
        component: AccInspecPage,
        currentRoute: ActivatedRouteSnapshot,
        currentState: RouterStateSnapshot,
        nextState?: RouterStateSnapshot,
    ): boolean | UrlTree | import('rxjs').Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        if (!component.isFormDirty()) {
            let some: boolean = true;
            // this.effectCtrl.showAlert({
            //   header:'提示',
            //   message:'您还未保存数据，确认要离开吗？',
            //   backdropDismiss:false,
            //   buttons:[{
            //     text:'取消',
            //     role:'cancel',
            //     handler:()=>{
            //       some = true
            //     }
            //   },{
            //     text:'确认',
            //     handler:()=>{
            //       debugger
            //       some = false
            //       return some
            //     }
            //   }]
            // })
            return window.confirm('您还未保存数据，确定要离开吗？');
        } else return true;
    }

    constructor(private effectCtrl: PageEffectService) {}
}
