import { Component, OnInit } from '@angular/core';
import { PageEffectService } from 'src/app/services/page-effect.service';
import { QueueComponent } from '../../implement-inspection/queue/queue.component';

@Component({
    selector: 'app-compile-errand-reimbursement',
    templateUrl: './compile-errand-reimbursement.component.html',
    styleUrls: ['./compile-errand-reimbursement.component.scss'],
})
export class CompileErrandReimbursementComponent implements OnInit {
    constructor(private es: PageEffectService) {}
    alreadyUpProgress: boolean;
    currentObj: any = {
        key: '',
    };
    isShow: boolean = true;
    ngOnInit() {}
    showModal() {
        this.es.showModal({
            component: QueueComponent,
        });
        this.alreadyUpProgress = true;
    }
    selectChange(event): void {}
    toAdd(): void {}
    saveInformation(): void {}
    getDetails(): void {}
}
