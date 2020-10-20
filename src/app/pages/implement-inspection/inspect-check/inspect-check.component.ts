import { Component, OnInit } from '@angular/core';
import { UploadQueueService } from '../upload-queue.service';
import { PageEffectService } from 'src/app/services/page-effect.service';
import { QueueComponent } from '../queue/queue.component';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
    selector: 'app-inspect-check',
    templateUrl: './inspect-check.component.html',
    styleUrls: ['./inspect-check.component.scss'],
})
export class InspectCheckComponent implements OnInit {
    skuInfo: any = {};
    constructor(private uQueue: UploadQueueService, private es: PageEffectService,private fb:FormBuilder) {}

    ngOnInit() {}
    skuInspectModel: FormGroup = this.fb.group({})
    alreadyUpProgress: boolean = this.uQueue.alreadyUpProgress;
    showModal() {
        this.es.showModal({
            component: QueueComponent,
        });
        this.uQueue.alreadyUpProgress = true;
    }

    descEnter(e: string[], type: string, boxType: 'inner' | 'outer') {}

    barCode
    apply_inspection_no
    contract_no

    scan(){

    }
}
