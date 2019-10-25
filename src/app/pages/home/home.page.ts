import { ScreenService, ScreenAngle } from './../../services/screen.service';
import { MenuService } from './../../services/menu.service';
import { UserInfoService } from './../../services/user-info.service';
import { Router } from '@angular/router';
import { Component, ChangeDetectorRef } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Menu } from 'src/app/services/menu.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  src: string
  constructor(private menu: MenuController, 
              private cd: ChangeDetectorRef,
              public user:UserInfoService,
              private menuService:MenuService,
              private screen:ScreenService,
              private Router:Router) { }

  ngOnInit(): void {
    this.setDiffImgSize(this.screen.screenAngle)
    this.menu.close()
    if(this.user.info.is_first){
      let menuItem:Menu = {
        url: '/create-department',
        sonIndex:2
      }
      this.menuService.setMenuExpand(menuItem)
      this.Router.navigate(['/modify-pwd'])
    }
    this.screen.onResize
      .subscribe(res => {
          this.setDiffImgSize(res)
      })
  }

  setDiffImgSize(screenAngle:ScreenAngle){
    if( screen.availWidth >= 1080){
      this.src = `../../../assets/img/home-img/${this.dayToBeat}_1595X510.jpg`
    }else{
      if(screenAngle == 'Vertical'){
        this.src = `../../../assets/img/home-img/${this.dayToBeat}_390X311.jpg`
      }else this.src = `../../../assets/img/home-img/${this.dayToBeat}_1254X570.jpg`
    }
  }

  get dayToBeat():string{
    let today = new Date().getDay()
    let some = ''
    switch(today){
      case 1:
        some = 'A'
      break
      case 2:
        some = 'B'
      break
      case 3:
        some = 'C'
      break
      case 4:
        some = 'D'
      break
      case 5:
        some = 'E'
      break
      default:{
        some = 'F'
      }
    }
    return some
  }
}
