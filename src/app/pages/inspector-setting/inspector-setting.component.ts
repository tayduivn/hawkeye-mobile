import { PageEffectService } from 'src/app/services/page-effect.service';
import { Component, OnInit } from '@angular/core';
import { InspectTask } from '../inspect-task/inspect-contract/inspect-contract.page';
import { Observable } from 'rxjs';
import { InspectionService } from 'src/app/services/inspection.service';
import { ActivatedRoute } from '@angular/router';
import { ModalOptions } from '@ionic/core/dist/types/components/modal/modal-interface';
import { InspectSettingBoxComponent } from 'src/app/widget/inspect-setting-box/inspect-setting-box.component';

@Component({
    selector: 'app-inspector-setting',
    templateUrl: './inspector-setting.component.html',
    styleUrls: ['./inspector-setting.component.scss'],
})
export class InspectorSettingComponent implements OnInit {
    data: InspectTask = {
        contract_id: null,
        contract_no: '',
        id: null,
    };
    constructor(
        private inspectCtrl: InspectionService,
        private activeRoute: ActivatedRoute,
        private effectCtrl: PageEffectService,
    ) {}

    ngOnInit() {
        this.activeRoute.params.subscribe(params => {
            this.inspectCtrl.getInspectTaskById(params.cid).subscribe(res => (this.data = res.data));
        });
    }

    inspectOp() {
        let option: ModalOptions = {
            component: InspectSettingBoxComponent,
            cssClass: 'custom-modal-sku',
            mode: 'ios',
            componentProps: { contract: this.data, type: 'task' },
        };

        this.effectCtrl.showModal(option, (data: any) => {
            this.data = data;
            console.log(data);
        });
    }
}
