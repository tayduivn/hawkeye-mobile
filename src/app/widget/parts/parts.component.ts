import { Sku } from './../sku-info/sku-info.component';
import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'app-parts',
    templateUrl: './parts.component.html',
    styleUrls: ['./parts.component.scss'],
})
export class PartsComponent implements OnInit {
    @Input() set sku(input: Sku) {
        if (!!input) this._data = input;
    }

    _data: Sku;

    constructor() {}

    ngOnInit() {}
}
