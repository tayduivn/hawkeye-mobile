import { UserInfoService } from './user-info.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SystemMangerService {

  constructor(private userInfo:UserInfoService) { }

  isSystemManger(): boolean {
    let some: boolean = false,
      mangerCompany: Array<string> = ["XD118", "XD006", "XD111", "XD147"];
    if (mangerCompany.indexOf(this.userInfo.info.company_no) != -1) {
      some = true;
    }
    return some;
  }
  
}
