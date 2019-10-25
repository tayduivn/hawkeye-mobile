import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { menu } from './menu';

export interface Menu {
  title?: string;
  url?: string;
  type?: string;
  icon?: string;
  active?: boolean;
  limit?: string;
  children?: Menu[];
  sonIndex?: number; //手动设置active的时候用到的children的子索引
}

@Injectable({
  providedIn: "root"
})
export class MenuService {
  menu:Menu[] = menu
  menuChanged: Subject<boolean> = new Subject<boolean>();
  autoExpandMenu: Subject<Menu> = new Subject<Menu>();     //自动展开菜单项
  constructor() {}

  setMenuChange(val: boolean) {
    this.menuChanged.next(val);
  }

  setMenuExpand(menu: Menu) {
    this.autoExpandMenu.next(menu);
  }

}
