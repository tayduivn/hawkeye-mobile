import {
    AlertController,
    LoadingController,
    ToastController,
    ModalController,
    ActionSheetController,
} from '@ionic/angular';
import { Injectable } from '@angular/core';
import { AlertOptions, LoadingOptions, ToastOptions, ModalOptions, ActionSheetOptions } from '@ionic/core';

@Injectable({
    providedIn: 'root',
})
export class PageEffectService {
    constructor(
        public alertCtrl: AlertController,
        public loadCtrl: LoadingController,
        public modalCtrl: ModalController,
        public actionSheetController: ActionSheetController,
        public toastCtrl: ToastController,
    ) {}

    async showAlert(option: AlertOptions) {
        const alert = await this.alertCtrl.create(option);
        await alert.present();
    }

    async showLoad(option: LoadingOptions) {
        const load = await this.loadCtrl.create(option);
        await load.present();
    }

    async showToast(option: ToastOptions) {
        option.position = 'top';
        option.mode = 'ios';
        option.duration = 1000;
        const toast = await this.toastCtrl.create(option);
        await toast.present();
        return toast.onDidDismiss();
    }

    async showModal(option: ModalOptions, callback?: Function) {
        const modal = await this.modalCtrl.create({
            component: option.component,
            cssClass: option.cssClass,
            componentProps: option.componentProps,
        });
        await modal.present();
        const { data } = await modal.onDidDismiss();
        if (data) {
            // tslint:disable-next-line: no-unused-expression
            callback && callback(data);
        }
    }

    async showActionSheet(options: ActionSheetOptions) {
        const actionSheet = await this.actionSheetController.create(options);
        await actionSheet.present();
    }

    public clearEffectCtrl() {
        this.toastCtrl.getTop().then((e: any) => {
            if (e && e.id) {
                this.toastCtrl.dismiss();
            }
        });
        this.actionSheetController.getTop().then((e: any) => {
            if (e && e.id) {
                this.actionSheetController.dismiss();
            }
        });
        this.loadCtrl.getTop().then((e: any) => {
            if (e && e.id) {
                this.loadCtrl.dismiss();
            }
        });
        this.alertCtrl.getTop().then((e: any) => {
            if (e && e.id) {
                this.alertCtrl.dismiss();
            }
        });
    }
}
