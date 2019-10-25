import { PageEffectService } from '../services/page-effect.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { CanActivate } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate{
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | import("rxjs").Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    let isLogin:boolean = sessionStorage.getItem('USER_INFO')!=null?true:false
    if(!isLogin) {
      this.effectCtrl.showAlert({
        header:'提示',
        message:'登录失效，请重新登录',
        backdropDismiss:false,
        buttons:[{
          text:'确定',
          handler:()=>{
            this.Router.navigate(['/login'])
          }
        }]
      })
    }
    return isLogin
  }
  
  constructor(private Router:Router,private effectCtrl:PageEffectService){}
}
