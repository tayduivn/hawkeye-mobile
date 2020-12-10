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
    ngOnInit() {
        this.getInitQueryParams();
    }
    getInitQueryParams() {
        this.activatedRoute.queryParams.subscribe(queryParam => {
            const currentObj = _.cloneDeep(queryParam);
            currentObj.currentItem = JSON.parse(currentObj.currentItem);
            currentObj.estimate_loading_time = currentObj.estimate_loading_time.split(' ')[0];
            currentObj.estimated_arrival_time = currentObj.estimated_arrival_time.split(' ')[0];
            currentObj.on_board_date = currentObj.on_board_date.split(' ')[0];
            currentObj.truely_loading_time = currentObj.truely_loading_time.split(' ')[0];
            this.initObject = currentObj;
            console.log(this.initObject);
        });
    }
}
