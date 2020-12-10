import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import _ from 'loadsh';
import { QueueComponent } from 'src/app/pages/implement-inspection/queue/queue.component';
import { UploadQueueService } from 'src/app/pages/implement-inspection/upload-queue.service';
import { PageEffectService } from 'src/app/services/page-effect.service';
@Component({
    selector: 'app-done-array-list-details',
    templateUrl: './done-array-list-details.component.html',
    styleUrls: ['./done-array-list-details.component.scss'],
})
export class DoneArrayListDetailsComponent implements OnInit {
    constructor(
        private activatedRoute: ActivatedRoute,
        private es: PageEffectService,
        private uQueue: UploadQueueService,
    ) {}
    initObject: any = {};
    ngOnInit() {
        this.getInitQueryParams();
    }
    getInitQueryParams() {
        this.activatedRoute.queryParams.subscribe(queryParam => {
            let currentObj = _.cloneDeep(queryParam);
            currentObj.currentItem = JSON.parse(currentObj.currentItem);
            this.initObject = currentObj;
            console.log(currentObj);
        });
    }
}
