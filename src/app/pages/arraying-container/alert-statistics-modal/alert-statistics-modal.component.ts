import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
    selector: 'app-alert-statistics-modal',
    templateUrl: './alert-statistics-modal.component.html',
    styleUrls: ['./alert-statistics-modal.component.scss'],
})
export class AlertStatisticsModalComponent implements OnInit {
    @Input() data: any;
    close() {
        this.modal.dismiss();
    }
    constructor(private modal: ModalController) {}

    ngOnInit() {
        console.log(this.data);
    }
    onSubmit(){
        this.modal.dismiss('submit');
    }
}
