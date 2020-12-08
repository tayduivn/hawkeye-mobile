import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import _ from 'loadsh';
@Component({
    selector: 'app-final-cabinets-details',
    templateUrl: './final-cabinets-details.component.html',
    styleUrls: ['./final-cabinets-details.component.scss'],
})
export class FinalCabinetsDetailsComponent implements OnInit {
    initObject: any = {};
    constructor(private activatedRoute: ActivatedRoute) {}

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
}
