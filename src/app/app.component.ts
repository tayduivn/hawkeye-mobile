import { MenuService } from './services/menu.service';
import { Component, OnInit } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';
import { PageEffectService } from './services/page-effect.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  ngOnInit(): void { }  
  public appPages = this.menu.menu

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private menu:MenuService,
    private Router:Router,
    private effectCtrl:PageEffectService
  ) {
    this.initializeApp();
    this.statusBar.overlaysWebView(false);

    // set status bar to white
    this.statusBar.backgroundColorByHexString('#03a9f4');
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  menuBtn(p: any) {
    let that = this
    if (p.title == '退出') {
      this.effectCtrl.showAlert({
        message: '确定要退出吗？',
        header: '提示',
        buttons: [{
          text: '确定',
          handler: function () {
            sessionStorage.removeItem('USER_INFO')
            sessionStorage.removeItem('PERMISSION')
            that.Router.navigate(['/login'])
          }
        }, {
          text: '取消'
        }]
      })
    }
  }

}
