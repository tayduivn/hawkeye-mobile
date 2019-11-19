import { ModalController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { PageEffectService } from 'src/app/services/page-effect.service';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';

@Component({
    selector: 'app-scan',
    templateUrl: './scan.component.html',
    styleUrls: ['./scan.component.scss'],
})
export class ScanComponent implements OnInit {
    ngOnInit(): void {}

    value: string | number = null;

    light: boolean; //判断闪光灯
    frontCamera: boolean; //判断摄像头
    isShow: boolean = false; //控制显示背景，避免切换页面卡顿

    constructor(
        private qrScanner: QRScanner,
        private effectCtrl: PageEffectService,
        private modalCtrl: ModalController,
    ) {
        //默认为false
        this.light = false;
        this.frontCamera = false;
    }

    ionViewDidEnter() {
        this.qrScanner
            .prepare()
            .then((status: QRScannerStatus) => {
                if (status.authorized) {
                    // camera permission was granted
                    // start scanning
                    let scanSub = this.qrScanner.scan().subscribe((text: string) => {
                        this.value = text;
                        console.log(text);
                        this.modalCtrl.dismiss({
                            value: this.value,
                        });
                        // this.effectCtrl.showAlert({
                        //   message: text,
                        //   header: "扫描到以下信息"
                        // });
                        this.qrScanner.hide(); // hide camera preview
                        scanSub.unsubscribe(); // stop scanning
                    });

                    // show camera preview
                    this.qrScanner.show();

                    // wait for user to scan something, then the observable callback will be called
                } else if (status.denied) {
                    // camera permission was permanently denied
                    // you must use QRScanner.openSettings() method to guide the user to the settings page
                    // then they can grant the permission from there
                } else {
                    // permission was denied, but not permanently. You can ask for permission again at a later time.
                }
            })
            .catch((e: any) => console.log('Error is', e));
        this.showCamera();
        this.isShow = true; //显示背景
    }

    ionViewWillEnter() {}

    /**
     * 闪光灯控制，默认关闭
     */
    toggleLight() {
        if (this.light) {
            this.qrScanner.disableLight();
        } else {
            this.qrScanner.enableLight();
        }
        this.light = !this.light;
    }

    /**
     * 前后摄像头互换
     */
    toggleCamera() {
        if (this.frontCamera) {
            this.qrScanner.useBackCamera();
        } else {
            this.qrScanner.useFrontCamera();
        }
        this.frontCamera = !this.frontCamera;
    }

    showCamera() {
        (window.document.querySelector('app-root') as HTMLElement).classList.add('cameraView');
    }
    hideCamera() {
        (window.document.querySelector('app-root') as HTMLElement).classList.remove('cameraView');
        this.qrScanner.hide(); //需要关闭扫描，否则相机一直开着
        this.qrScanner.destroy(); //关闭
    }

    ionViewWillLeave() {
        this.hideCamera();
    }
}
