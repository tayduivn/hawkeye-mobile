import { Component, OnInit } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { ModalController } from '@ionic/angular';
import { PageEffectService } from 'src/app/services/page-effect.service';

@Component({
    selector: 'app-scan',
    templateUrl: './scan.component.html',
    styleUrls: ['./scan.component.scss'],
})
export class ScanComponent implements OnInit {
    ngOnInit(): void {}

    constructor(
        private barcodeScanner: BarcodeScanner,
        private modalCtrl: ModalController,
        private es: PageEffectService,
    ) {}

    ionViewDidEnter() {
        this.barcodeScanner
            .scan()
            .then(barcodeData => {
                console.log(barcodeData);
                this.modalCtrl.dismiss({
                    value: barcodeData.text,
                });
            })
            .catch(err => {
                console.log('Error', err);
            });
    }
}
