import { Sku } from '../../../widget/sku-info/sku-info.component';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { StorageService } from 'src/app/services/storage.service';
import { InspectionService } from 'src/app/services/inspection.service';
import { ModalOptions } from '@ionic/core';
import { InspectSettingBoxComponent } from 'src/app/widget/inspect-setting-box/inspect-setting-box.component';
import { PageEffectService } from 'src/app/services/page-effect.service';

@Component({
    selector: 'app-sku-detail',
    templateUrl: './sku-detail.page.html',
    styleUrls: ['./sku-detail.page.scss'],
})
export class SkuDetailPage implements OnInit {
    data: Sku;

    addDescParams: any = {
        apply_id: null,
        inspection_task_desc: [],
        sku: '',
    };
    constructor(
        private storage: StorageService,
        private inspectCtrl: InspectionService,
        private pageEffect: PageEffectService,
        private el: ElementRef,
    ) {
        this.addDescParams.apply_id = this.storage.get('CURRENT_INSPECT_CONTRACT').id;
    }

    ngOnInit() {
        this.data = this.storage.get('SKU_INFO');
    }

    ionViewWillEnter() {
        this.data.inspection_task_desc = this.data.inspection_task_desc ? this.data.inspection_task_desc : [''];
    }

    ionViewWillLeave() {
        this.storage.remove('SKU_INFO');
    }

    addInspectDesc() {
        let val: string[] = [];
        this.el.nativeElement.querySelectorAll('input').forEach(element => {
            val.push(element.value);
        });
        // this.addDescParams.inspection_task_desc = this.data.inspection_task_desc
        this.addDescParams.inspection_task_desc = val;
        this.addDescParams.sku = this.data.sku;
        this.inspectCtrl.addInspectionTaskDesc(this.addDescParams).subscribe(res => {
            this.pageEffect.showToast({
                message: res.message,
                color: 'success',
            });
            /**
             * because data is previous page not get meta data , so let meta data resize Assemble
             */
            let inspectContract = this.storage.get('CURRENT_INSPECT_CONTRACT');
            inspectContract.sku_desc.forEach((sku: Sku, i: number) => {
                if (sku.sku == this.data.sku) {
                    sku.inspection_task_desc = this.addDescParams.inspection_task_desc;
                }
            });
            this.storage.set('CURRENT_INSPECT_CONTRACT', inspectContract);
            this.storage.set('SKU_INFO', this.data);
        });
    }

    inputChange(p: string, i: number) {
        console.log(this.data.inspection_task_desc, p, i);
    }

    inspectOp() {
        let option: ModalOptions = {
            component: InspectSettingBoxComponent,
            cssClass: 'custom-modal-sku',
            mode: 'ios',
            componentProps: { contract: this.data, type: 'skuDetail' },
        };
        this.pageEffect.showModal(option, (data: any) => {
            this.data = data.refresh;
            console.log(data);
        });
    }
}
