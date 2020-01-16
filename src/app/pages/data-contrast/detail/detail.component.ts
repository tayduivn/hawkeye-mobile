import { DataCompareService } from './../../../services/data-compare.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

export interface CompareItem {
    name: string;
    chinese_name: string;
    type: 'pic' | 'video' | 'desc';
    system: any;
    posted: any;
    compare_res?: boolean;
    box_type?: 'inner'|'outer'|'test'
}
@Component({
    selector: 'app-detail',
    templateUrl: './detail.component.html',
    styleUrls: ['./detail.component.scss'],
})
export class DetailComponent implements OnInit {
    contractId: number;
    applyNo: string;
    sku: string;
    compareData: CompareItem[] = []
    constructor(private activeRoute: ActivatedRoute, private dataCompare: DataCompareService) {
        this.activeRoute.params.subscribe(res => {
            this.contractId = res.contract_id;
            this.applyNo = res.apply_no;
            this.sku = res.sku;
        });
    }

    ngOnInit() {
        this.dataCompare
            .getCompareDetail({ contract_id: this.contractId, apply_inspection_no: this.applyNo, sku: this.sku })
            .subscribe(res => {
                res.data && (this.compareData = res.data);
            });
    }
}
