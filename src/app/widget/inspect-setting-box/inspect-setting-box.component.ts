import { StorageService } from 'src/app/services/storage.service';
import { PageEffectService } from '../../services/page-effect.service';
import { ModalController } from '@ionic/angular';
import { Component, OnInit, Input } from '@angular/core';
import { InspectionService } from 'src/app/services/inspection.service';

export type InspectorSetType = 'group' | 'task' | 'skuList' | 'skuDetail' | '';
@Component({
    selector: 'app-inspect-setting-box',
    templateUrl: './inspect-setting-box.component.html',
    styleUrls: ['./inspect-setting-box.component.scss'],
})
export class InspectSettingBoxComponent implements OnInit {
    @Input() set contract(input: any) {
        this._contract = JSON.parse(JSON.stringify(input));
    }

    @Input() type?: InspectorSetType = '';

    @Input() apply_id?:number = null
    _contract: any; 
    constructor(
        private modalService: ModalController,
        private storage: StorageService,
        private inspectService: InspectionService,
        private effectCtrl: PageEffectService,
    ) {}

    ngOnInit() {}

    enter() {
        let params = {
            is_contacked_factory: this._contract.is_contacked_factory ? 1 : 0,
            is_bought_ticket: this._contract.is_bought_ticket ? 1 : 0,
            is_inspected_factory: this._contract.is_inspected_factory ? 1 : 0,
            is_inspected_product: this._contract.is_inspected_product ? 1 : 0,
            is_plan_date: this._contract.is_plan_date ? 1 : 0,
            is_know_demand: this._contract.is_know_demand ? 1 : 0,
            apply_id:
                this.type == 'skuList' || this.type == 'skuDetail'
                    ? this.storage.get('CURRENT_INSPECT_CONTRACT').id
                    : this.apply_id,
        };
        if (this.type == 'skuList' || this.type == 'skuDetail') {
            this.inspectService
                .addInspectionTaskDesc({
                    apply_id: params.apply_id,
                    sku: this._contract.sku,
                    is_know_demand: params.is_know_demand,
                    is_inspected_product: params.is_inspected_product,
                })
                .subscribe(data => {
                    if (data.status == 1) {
                        this.modalService.dismiss({
                            refresh: this._contract,
                        });
                    } else this.modalService.dismiss();

                    this.effectCtrl.showToast({
                        message: data.message,
                        color: 'success',
                    });
                });
        } else {
            this.inspectService.inspectSetting(params).subscribe(data => {
                if (data.status == 1) {
                    this.modalService.dismiss({
                        refresh: this._contract,
                    });
                } else this.modalService.dismiss();

                this.effectCtrl.showToast({
                    message: data.message,
                    color: 'success',
                });
            });
        }
    }
}
