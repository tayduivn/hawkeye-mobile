import { MenuService } from './services/menu.service';
import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';
import { PageEffectService } from './services/page-effect.service';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { HttpClient } from '@angular/common/http';
import { AppVersion } from './config/config';
import { FileTransferObject, FileTransfer } from '@ionic-native/file-transfer/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { File as AndroidFile } from '@ionic-native/file/ngx';
import { environment } from 'src/environments/environment';
import { LoadingService } from './services/loading.service';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
    ngOnInit(): void {
           // 订阅loading
           this.loadingCtrl.loadingChange.subscribe((val: boolean) => {
            this.loading = val;
        });
    }
    public appPages = this.menu.menu;
    public loading: boolean = false;
    constructor(
        private platform: Platform,
        private splashScreen: SplashScreen,
        private statusBar: StatusBar,
        private menu: MenuService,
        private Router: Router,
        private effectCtrl: PageEffectService,
        private backgroundMode: BackgroundMode,
        private http: HttpClient,
        private loadingCtrl: LoadingService,
        private fileOpener: FileOpener,
        private transfer: FileTransfer,
        private file: AndroidFile,
    ) {
        this.initializeApp();
        this.statusBar.overlaysWebView(false);

        // set status bar to white
        this.statusBar.backgroundColorByHexString('#03a9f4');
        backgroundMode.enable(); //防止后台睡觉
    }

    initializeApp() {
        this.platform.ready().then(() => {
            this.statusBar.styleDefault();
            this.splashScreen.hide();
            //判断版本号与线上版本是否有所差异
            this.http
                .get(`${environment.origin}/version/get_latest_version`)
                .toPromise()
                .then((res: any) => {
                    if (res && res.data !== AppVersion) {
                        this.effectCtrl.showAlert({
                            message: '检测到已经有新版本，是否立即自动更新？',
                            buttons: [
                                {
                                    text: '取消',
                                },
                                {
                                    text: '下载',
                                    handler: () => {
                                        this.downloadFile(
                                            `${environment.origin}/version/upload_version?version_name=${res.data}`,
                                            res.data,
                                        );
                                    },
                                },
                            ],
                        });
                    }
                });

            //下载安装
        });
    }

    /**
     *下载事件
     * @param {*} url
     * @memberof MyApp
     */
    downloadFile(url: string, version) {
        console.log('-----------    下载    -----------');
        this.effectCtrl.showLoad({
            message: `正在下载…`,
        });
        const fileTransfer: FileTransferObject = this.transfer.create();
        fileTransfer.download(encodeURI(url), `${this.file.externalDataDirectory}${version}.apk`, true).then(
            entry => {
                this.fileOpener
                    .open(
                        `${this.file.externalDataDirectory.toString()}${version}.apk`,
                        'application/vnd.android.package-archive',
                    )
                    .then(() => {})
                    .catch(e => {
                        this.effectCtrl.loadCtrl.dismiss();
                        this.effectCtrl.showToast({ message: '打开apk失败，请手动前往安装', color: 'danger' });
                    });
            },
            err => {
                this.effectCtrl.loadCtrl.dismiss();
            },
        );
        // fileTransfer.onProgress(progressEvent => {
        //     if (progressEvent.lengthComputable) {
        //         let downloadProgress = (progressEvent.loaded / progressEvent.total) * 100;
        //     }
        // });
    }

    menuBtn(p: any) {
        let that = this;
        if (p.title == '退出') {
            this.effectCtrl.showAlert({
                message: '确定要退出吗？',
                header: '提示',
                buttons: [
                    {
                        text: '确定',
                        handler: function() {
                            sessionStorage.removeItem('USER_INFO');
                            sessionStorage.removeItem('PERMISSION');
                            that.Router.navigate(['/login']);
                        },
                    },
                    {
                        text: '取消',
                    },
                ],
            });
        }
    }
}
