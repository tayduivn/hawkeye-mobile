import { Component, OnInit, Input } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-part',
    templateUrl: './part.component.html',
    styleUrls: ['./part.component.scss'],
})
export class PartComponent implements OnInit {
    _part: any = {};
    imgOrigin: string = environment.fileUrlPath;

    @Input() set part(input: any) {
        if (!!input) {
            this._part = input;
            console.log(this._part)
        }
    }
    constructor() {}

    ngOnInit() {}
}
