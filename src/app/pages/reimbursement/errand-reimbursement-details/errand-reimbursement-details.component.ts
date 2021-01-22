import { Component, OnInit } from '@angular/core';
import { PageEffectService } from 'src/app/services/page-effect.service';
import { QueueComponent } from '../../implement-inspection/queue/queue.component';

@Component({
    selector: 'app-errand-reimbursement-details',
    templateUrl: './errand-reimbursement-details.component.html',
    styleUrls: ['./errand-reimbursement-details.component.scss'],
})
export class ErrandReimbursementDetailsComponent implements OnInit {
    constructor(private es: PageEffectService) {}
    alreadyUpProgress: boolean;
    ngOnInit() {}
    currentObj: any = {
        key: '',
    };
    isShow: boolean = true;
    // 显示上传进度
    showModal() {
        this.es.showModal({
            component: QueueComponent,
        });
        this.alreadyUpProgress = true;
    }
    selectChange() {}
    toAdd() {}
}
