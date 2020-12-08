import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import _ from 'loadsh';

@Component({
    selector: 'app-installed-cabinets-details',
    templateUrl: './installed-cabinets-details.component.html',
    styleUrls: ['./installed-cabinets-details.component.scss'],
})
export class InstalledCabinetsDetailsComponent implements OnInit {
    initObject: any = {};
    constructor(private activatedRoute: ActivatedRoute) {}
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
