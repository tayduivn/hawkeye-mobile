import { Component, OnInit, Input } from '@angular/core';
import { Description } from '../item-by-item-desc/item-by-item-desc.component';
import { ModalController } from '@ionic/angular';

@Component({
    selector: 'app-description',
    templateUrl: './description.component.html',
    styleUrls: ['./description.component.scss'],
})
export class DescriptionComponent implements OnInit {
    @Input() set desc(input: Description) {
        if (!!input) this._desc = JSON.parse(JSON.stringify(input));
    }
    @Input() type: 'add' | 'modify';

    _desc: Description;
    constructor(private modal: ModalController) {}

    ngOnInit() {}

    enter() {
        this.modal.dismiss(this._desc);
    }
}
