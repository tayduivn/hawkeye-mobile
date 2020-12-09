import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-factory-general-situation',
    templateUrl: './factory-general-situation.component.html',
    styleUrls: ['./factory-general-situation.component.scss'],
})
export class FactoryGeneralSituationComponent implements OnInit {
    constructor(private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.getInitQueryParams();
    }
    getInitQueryParams() {
        this.activatedRoute.queryParams.subscribe(queryParam => {
            console.log(queryParam); //flag等于0不做任何操作  等于1那么回填加禁用编辑  等于2那么回填可编辑
        });
    }
}
