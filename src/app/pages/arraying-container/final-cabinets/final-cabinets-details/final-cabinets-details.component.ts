import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import _ from 'loadsh';
import { QueueComponent } from 'src/app/pages/implement-inspection/queue/queue.component';
import { UploadQueueService } from 'src/app/pages/implement-inspection/upload-queue.service';
import { PageEffectService } from 'src/app/services/page-effect.service';
@Component({
    selector: 'app-final-cabinets-details',
    templateUrl: './final-cabinets-details.component.html',
    styleUrls: ['./final-cabinets-details.component.scss'],
})
export class FinalCabinetsDetailsComponent implements OnInit {
    initObject: any = {};
    constructor(
        private activatedRoute: ActivatedRoute,
        private es: PageEffectService,
        private uQueue: UploadQueueService,
    ) {}
    alreadyUpProgress: boolean = this.uQueue.alreadyUpProgress;
    ngOnInit() {
        this.getInitQueryParams();
    }
    getInitQueryParams() {
        this.activatedRoute.queryParams.subscribe(queryParam => {
            const currentObj = _.cloneDeep(queryParam);
            currentObj.currentItem = JSON.parse(currentObj.currentItem);
            this.initObject = currentObj;
            console.log(this.initObject);
        });
    }
    showModal() {
        this.es.showModal({
            component: QueueComponent,
        });
        this.uQueue.alreadyUpProgress = true;
    }
}
