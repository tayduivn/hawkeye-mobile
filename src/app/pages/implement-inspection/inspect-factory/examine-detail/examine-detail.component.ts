import { environment } from 'src/environments/environment';
import { ExamineDetail } from './../inspect-factory.component';
import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'app-examine-detail',
    templateUrl: './examine-detail.component.html',
    styleUrls: ['./examine-detail.component.scss'],
})
export class ExamineDetailComponent implements OnInit {
    env: any = environment.usFileUrl;
    @Input() set data(input: ExamineDetail) {
        if (!!input) this._data = input;
        if(typeof input.review_summary_desc == 'string'){
            this._data.review_summary_desc = [{
                color:'#000',
                text: input.review_summary_desc
            }]
        }
    }
    _data: ExamineDetail = {
        video_arr: [],
        img_arr: [],
        review_summary_desc: [],
    };

    constructor() {}

    ngOnInit() {}
}
