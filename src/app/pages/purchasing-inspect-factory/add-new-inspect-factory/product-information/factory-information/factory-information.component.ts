import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-factory-information',
    templateUrl: './factory-information.component.html',
    styleUrls: ['./factory-information.component.scss'],
})
export class FactoryInformationComponent implements OnInit {
    @Input() isDisabled: any;
    constructor() {}

    ngOnInit() {
        console.log(this.isDisabled);
    }
}
