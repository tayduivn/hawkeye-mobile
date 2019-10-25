import { StorageService } from './../services/storage.service';
import { Injectable, Component } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginCanLeaveGuard implements CanDeactivate<Component>{
  canDeactivate(component: Component, currentRoute: ActivatedRouteSnapshot, currentState: RouterStateSnapshot, nextState?: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    let isLogin:boolean = this.storage.get('USER_INFO')!=null?true:false
    return isLogin
  }
   
  constructor(private storage:StorageService){}
}
