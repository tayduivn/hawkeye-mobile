import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PageEffectService } from 'src/app/services/page-effect.service';
import { QueueComponent } from '../../implement-inspection/queue/queue.component';
import { UploadQueueService } from '../../implement-inspection/upload-queue.service';

@Component({
    selector: 'app-list-detail',
    templateUrl: './list-detail.component.html',
    styleUrls: ['./list-detail.component.scss'],
})
export class ListDetailComponent implements OnInit {
    initObject: any = {
        able_container_num: '',
        apply_inspection_no: '',
        bar_code: '',
        container_num: '',
        contract_no: '',
        factory_contacts: '',
        gross_weight: '',
        gross_weight_total: '',
        id: '',
        manufacturer: '',
        manufacturer_address: '',
        mobil_phone: '',
        net_weight: '',
        net_weight_total: '',
        product_num: '',
        rate_container: '',
        schedule_user_name: '',
        size: '',
        size_volume: '',
        sku: '',
    };
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
            this.initObject = queryParam;
            console.log(this.initObject);
        });
    }
}
