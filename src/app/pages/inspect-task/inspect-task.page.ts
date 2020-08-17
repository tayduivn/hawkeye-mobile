import { PageEffectService } from './../../services/page-effect.service';
import { StorageService } from './../../services/storage.service';
import { ScreenAngle, ScreenService } from './../../services/screen.service';
import { Component, OnInit } from '@angular/core';
import { InspectionService, InspectGroup } from 'src/app/services/inspection.service';
import { Router } from '@angular/router';
import { ModalOptions } from '@ionic/core';
import { InspectSettingBoxComponent } from 'src/app/widget/inspect-setting-box/inspect-setting-box.component';

@Component({
    selector: 'app-inspect-task',
    templateUrl: './inspect-task.page.html',
    styleUrls: ['./inspect-task.page.scss'],
})
export class InspectTaskPage implements OnInit {
    screenType: ScreenAngle;
    inspectGroup: InspectGroup[] = [];
    getListParams: any = {
        keywords: 'factory_name',
        value: '',
        page: 1,
    };
    constructor(
        private inspectService: InspectionService,
        private effectCtrl: PageEffectService,
        private screen: ScreenService,
        private storage: StorageService,
        private router: Router,
    ) {
        this.screenType = this.screen.screenAngle;
        this.screen.onResize.subscribe(res => (this.screenType = res));
    }

    ngOnInit() {}

    ionViewWillEnter() {
        this.getListParams.page = 1;
        this.inspectService.getTaskList(this.getListParams).subscribe(res => {
            this.inspectGroup = res.data;
            this.getListParams.page = res.current_page + 1;
        });
        this.storage.remove('CURRENT_INSPECT_GROUP');
    }

    toContract(p: any) {
        this.storage.set('CURRENT_INSPECT_GROUP', p);
        this.router.navigate(['inspect-contract']);
    }

    inspectOp(p: any, e: any) {
        let option: ModalOptions = {
            component: InspectSettingBoxComponent,
            cssClass: 'custom-modal-sku',
            mode: 'ios',
            componentProps: { contract: p.data[0], type: 'group', apply_id: p.data[0].id },
        };

        this.effectCtrl.showModal(option, (data: any) => {
            p.data[0] = data.refresh;
        });
    }

    getList() {
        this.inspectService.getTaskList(this.getListParams).subscribe(res => {
            this.inspectGroup = this.inspectGroup.concat(res.data);
            this.getListParams.page = res.current_page + 1;
        });
    }
    loadData(event) {
        this.inspectService.getTaskList(this.getListParams).subscribe(res => {
            if (res.data && res.data.length) {
                this.inspectGroup = this.inspectGroup.concat(res.data);
                this.getListParams.page = res.current_page + 1;
            } else {
                this.effectCtrl.showToast({
                    message: '别刷了，没有数据啦！',
                    color: 'danger',
                });
            }

            event.target.complete();
        });
    }

    factoryChange() {
        this.getListParams.page = 1;
        this.inspectService.getTaskList(this.getListParams).subscribe(res => {
            if (res.data && res.data.length) {
                this.inspectGroup = res.data;
                this.getListParams.page = res.current_page + 1;
            } else {
                this.inspectGroup = [];
            }
        });
    }
}
