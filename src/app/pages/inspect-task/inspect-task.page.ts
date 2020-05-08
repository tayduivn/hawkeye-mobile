import { PageEffectService } from './../../services/page-effect.service';
import { StorageService } from './../../services/storage.service';
import { ScreenAngle, ScreenService } from './../../services/screen.service';
import { Component, OnInit } from '@angular/core';
import { InspectionService, InspectGroup } from 'src/app/services/inspection.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { ModalOptions } from '@ionic/core';
import { InspectSettingBoxComponent } from 'src/app/widget/inspect-setting-box/inspect-setting-box.component';
import { InspectTask } from './inspect-contract/inspect-contract.page';
import { map } from 'rxjs/operators';

@Component({
    selector: 'app-inspect-task',
    templateUrl: './inspect-task.page.html',
    styleUrls: ['./inspect-task.page.scss'],
})
export class InspectTaskPage implements OnInit {
    screenType: ScreenAngle;
    inspectGroup: InspectGroup[] = [];
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
        this.inspectService.getTaskList().subscribe(res => {
            this.inspectGroup = res.data;
        });
        this.storage.remove('CURRENT_INSPECT_GROUP');
    }

    toContract(p: any) {
        this.storage.set('CURRENT_INSPECT_GROUP', p);
        this.router.navigate(['inspect-contract']);
    }

    inspectOp(p: any) {
        let option: ModalOptions = {
            component: InspectSettingBoxComponent,
            cssClass: 'custom-modal-sku',
            mode: 'ios',
            componentProps: { contract: p.data[0], type: 'group' },
        };

        this.effectCtrl.showModal(option, (data: any) => {
            p.data[0] = data.refresh;
            console.log(data);
        });
    }

    getList(page: number) {
        this.inspectService.getTaskList(page).subscribe(res => {
            this.inspectGroup = this.inspectGroup.concat(res.data);
        });
    }
    page: number = 2;
    loadData(event) {
        this.inspectService.getTaskList(this.page).subscribe(res => {
            if (res.data && res.data.length) {
                this.inspectGroup = this.inspectGroup.concat(res.data);
                this.page = res.current_page + 1;
            } else {
                this.effectCtrl.showToast({
                    message: '别刷了，没有数据啦！',
                    color: 'danger',
                });
            }

            event.target.complete();
        });
    }
}
