import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-factory-cooperation-product',
    templateUrl: './factory-cooperation-product.component.html',
    styleUrls: ['./factory-cooperation-product.component.scss'],
})
export class FactoryCooperationProductComponent implements OnInit {
    @Input() isDisabled: any;
    constructor() {}

    ngOnInit() {
        console.log(this.isDisabled);
    }
}
