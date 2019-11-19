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

@Component({
    selector: 'app-inspect-task',
    templateUrl: './inspect-task.page.html',
    styleUrls: ['./inspect-task.page.scss'],
})
export class InspectTaskPage implements OnInit {
    screenType: ScreenAngle;
    inspectGroup: Observable<InspectGroup[]>;
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
        this.inspectGroup = this.inspectService.getTaskList();
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
            p.data[0] = data;
            console.log(data);
        });
    }
}
