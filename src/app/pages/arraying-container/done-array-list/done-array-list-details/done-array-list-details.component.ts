import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import _ from 'loadsh';
@Component({
    selector: 'app-done-array-list-details',
    templateUrl: './done-array-list-details.component.html',
    styleUrls: ['./done-array-list-details.component.scss'],
})
export class DoneArrayListDetailsComponent implements OnInit {
    constructor(private activatedRoute: ActivatedRoute) {}
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
