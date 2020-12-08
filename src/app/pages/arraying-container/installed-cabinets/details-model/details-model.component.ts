import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
    selector: 'app-details-model',
    templateUrl: './details-model.component.html',
    styleUrls: ['./details-model.component.scss'],
})
export class DetailsModelComponent implements OnInit {
    @Input() item: any;
    constructor(private modal: ModalController) {}
    close() {
        this.modal.dismiss();
    }
    ngOnInit() {
        console.log(this.item);
    }
}
