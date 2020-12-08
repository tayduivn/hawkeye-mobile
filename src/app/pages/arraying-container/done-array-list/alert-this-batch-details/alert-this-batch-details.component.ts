import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
    selector: 'app-alert-this-batch-details',
    templateUrl: './alert-this-batch-details.component.html',
    styleUrls: ['./alert-this-batch-details.component.scss'],
})
export class AlertThisBatchDetailsComponent implements OnInit {
    @Input() item: any;
    constructor(private modal: ModalController) {}
    close() {
        this.modal.dismiss();
    }
    ngOnInit() {
       
    }
}
