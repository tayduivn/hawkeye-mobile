import { StorageService } from 'src/app/services/storage.service';
import { Component, OnInit } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { InspectionService } from 'src/app/services/inspection.service';
import { Router } from '@angular/router';
import { PageEffectService } from 'src/app/services/page-effect.service';

@Component({
    selector: 'app-implement-inspection',
    templateUrl: './implement-inspection.page.html',
    styleUrls: ['./implement-inspection.page.scss'],
    animations: [
        trigger('openClose', [
            state(
                'open',
                style({
                    opacity: 1,
                    right: 0,
                }),
            ),
            state(
                'closed',
                style({
                    opacity: 0,
                    right: '100%',
                }),
            ),
            state(
                'back',
                style({
                    opacity: 0,
                    right: '-100%',
                }),
            ),
            transition('open => closed', [ animate('0.3s ease-in-out')] ),
            transition('back => open', [ animate('0.3s ease-out')] ),
            transition('open => back', [ animate('0.3s ease-in-out')] ),
            transition('closed => open', [ animate('0.3s ease-out')] ),
        ]),
    ],
})
export class ImplementInspectionPage implements OnInit {
    active: string = 'factory';
    inspectTask: any[] = [];
    metaInspectTask: any[] = [];
    task: any[] = [];
    factory: any = '';
    contract: any = '';
    contractList: any[] = [];
    currentFactory: string;
    getListParams: any = {
        page: 1,
        keywords: 'factory_name',
        value: '',
    };
    constructor(
        private inspectService: InspectionService,
        private effectCtrl: PageEffectService,
        private storage: StorageService,
        private router: Router,
    ) {}

    ngOnInit() {}

    toInspect(contractNo: string, inspectId: string) {
        console.log(contractNo, inspectId);
        this.router.navigate(['/inspect-factory', contractNo, inspectId]);
    }

    ionViewWillEnter() {
        this.getListParams.page = 1;
        this.inspectService.getInspectTaskList(this.getListParams).subscribe(res => {
            this.metaInspectTask = res.data;
            this.inspectTask = JSON.parse(JSON.stringify(res.data));
            this.task = res;
            this.getListParams.page = res.current_page + 1;
            this.storage.set('IMPLEMENT-INSPECTION-META-DATA', this.inspectTask);
        });
    }

    get apply_id(): number {
        if (!this.task.length) return;
        let rVal: number;
        this.task.forEach(res => {
            res.forEach(task => {
                task.contract.id == this.factory && (rVal = task.id);
            });
        });
        return rVal;
    }

    keywords: string = '';
    factoryChange() {
        this.getListParams.page = 1;
        this.inspectService.getInspectTaskList(this.getListParams).subscribe(res => {
            if (res.data && res.data.length) {
                this.inspectTask = res.data;
                this.getListParams.page = res.current_page + 1;
                this.storage.set('IMPLEMENT-INSPECTION-META-DATA', this.inspectTask);
            } else {
                this.inspectTask = [];
            }
        });
    }

    page: number = 1;
    loadData(event) {
        this.inspectService.getInspectTaskList(this.getListParams).subscribe(res => {
            if (res.data && res.data.length) {
                this.inspectTask = this.inspectTask.concat(res.data);
                this.getListParams.page = res.current_page + 1;
                this.storage.set('IMPLEMENT-INSPECTION-META-DATA', this.inspectTask);
            } else {
                this.effectCtrl.showToast({
                    message: '别刷了，没有数据啦！',
                    color: 'danger',
                });
            }
            event.target.complete();
        });
    }
}
