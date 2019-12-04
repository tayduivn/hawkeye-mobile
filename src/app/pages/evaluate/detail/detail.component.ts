import { Factory } from './../../implement-inspection/inspect-po/inspect-po.component';
import { Sku } from './../../../widget/sku-info/sku-info.component';
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-detail',
    templateUrl: './detail.component.html',
    styleUrls: ['./detail.component.scss'],
})
export class DetailComponent implements OnInit {
    coordination: string = 'middle';
    storage: string = 'excellent';
    other: boolean = false;
    productType: string = '';
    skuList: Sku[] = [];
    factorySituation: string = '';
    factory: Factory = {};
    constructor() {}

    ngOnInit() {}
}
