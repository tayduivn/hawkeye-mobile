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
    }
    _data: ExamineDetail = {
        video_arr: [],
        img_arr: [],
        review_summary_desc: '',
    };

    constructor() {}

    ngOnInit() {}
}
