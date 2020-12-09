import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import _ from 'loadsh';
import { QueueComponent } from 'src/app/pages/implement-inspection/queue/queue.component';
import { UploadQueueService } from 'src/app/pages/implement-inspection/upload-queue.service';
import { PageEffectService } from 'src/app/services/page-effect.service';

@Component({
    selector: 'app-installed-cabinets-details',
    templateUrl: './installed-cabinets-details.component.html',
    styleUrls: ['./installed-cabinets-details.component.scss'],
})
export class InstalledCabinetsDetailsComponent implements OnInit {
    initObject: any = {};
    constructor(
        private activatedRoute: ActivatedRoute,
        private es: PageEffectService,
        private uQueue: UploadQueueService,
    ) {}
    ngOnInit() {
        this.getInitQueryParams();
    }
    alreadyUpProgress: boolean = this.uQueue.alreadyUpProgress;
    getInitQueryParams() {
        this.activatedRoute.queryParams.subscribe(queryParam => {
            let currentObj = _.cloneDeep(queryParam);
            currentObj.currentItem = JSON.parse(currentObj.currentItem);
            this.initObject = currentObj;
            console.log(currentObj);
        });
    }
    showModal() {
        this.es.showModal({
            component: QueueComponent,
        });
        this.uQueue.alreadyUpProgress = true;
    }
}
