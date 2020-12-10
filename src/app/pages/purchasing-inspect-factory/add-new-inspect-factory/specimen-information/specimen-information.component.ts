import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-specimen-information',
    templateUrl: './specimen-information.component.html',
    styleUrls: ['./specimen-information.component.scss'],
})
export class SpecimenInformationComponent implements OnInit {
    constructor(private activatedRoute: ActivatedRoute) {}
    isDisabled: boolean;
    ngOnInit() {
        this.getInitQueryParams();
    }
    getInitQueryParams() {
        this.activatedRoute.queryParams.subscribe(queryParam => {
            console.log(queryParam); //flag等于0不做任何操作  等于1那么回填加禁用编辑  等于2那么回填可编辑
            if (queryParam.flag === '0') {
                this.isDisabled = false;
            } else if (queryParam.flag === '1') {
                this.isDisabled = true;
            } else {
                this.isDisabled = false;
            }
        });
    }
}
