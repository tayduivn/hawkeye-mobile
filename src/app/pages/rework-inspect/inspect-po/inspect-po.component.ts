import { Component, OnInit } from '@angular/core';
import { FeedbackComponent } from '../feedback/feedback.component';
import { PageEffectService } from 'src/app/services/page-effect.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ReworkService, ReworkContract } from '../rework.service';
import { UploadQueueService } from '../../implement-inspection/upload-queue.service';
import { QueueComponent } from '../../implement-inspection/queue/queue.component';

@Component({
    selector: 'app-inspect-po',
    templateUrl: './inspect-po.component.html',
    styleUrls: ['./inspect-po.component.scss'],
})
export class InspectPoComponent implements OnInit {
    factory_name = '天府三街新希望国际';
    list: Array<ReworkContract> = [];
    apply_inspect_no = '';
    alreadyUpProgress: boolean = this.uQueue.alreadyUpProgress;
    showModal() {
        this.es.showModal({
            component: QueueComponent,
        });
        this.uQueue.alreadyUpProgress = true;
    }
    constructor(
        private es: PageEffectService,
        private router: ActivatedRoute,
        private route: Router,
        private reworkCtrl: ReworkService,
        private uQueue: UploadQueueService,
    ) {
        router.params.subscribe(res => {
            this.apply_inspect_no = res.factory_id;
            this.getData();
        });
    }

    ngOnInit() {}

    feedback(p: any, sku: any) {
        this.es.showModal({
            component: FeedbackComponent,
            componentProps: { apply_inspection_no: this.apply_inspect_no, sku: sku.sku, contract_no: p.contract_no },
        });
    }

    getData() {
        this.reworkCtrl.getReworkContractForApplyId(this.apply_inspect_no).subscribe(res => {
            this.list = res.data;
        });
    }

    toReworkSku(p, sku) {
        if (sku.is_appraise) {
            this.es.showToast({
                message: '已评价不能验货！',
                color: 'danger',
            });
            return;
        }
        this.route.navigate(['/rework-inspect/rework-sku', this.apply_inspect_no, p.contract_no, sku.sku]);
    }
}
