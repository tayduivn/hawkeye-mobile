import { Observable } from 'rxjs';
import { InspectEvaluateService, InspectAppraisementItem } from './../../services/inspect-evaluate.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { StorageService } from '../../services/storage.service';
import { PageEffectService } from '../../services/page-effect.service';

@Component({
    selector: 'app-evaluate',
    templateUrl: './evaluate.page.html',
    styleUrls: ['./evaluate.page.scss'],
})
export class EvaluatePage implements OnInit {
    list: InspectAppraisementItem[] = [];
    metaList: InspectAppraisementItem[] = [];
    listLength: number;
    constructor(
        private router: Router,
        private es: PageEffectService,
        private storage: StorageService,
        private InspectEval: InspectEvaluateService,
    ) {}

    ngOnInit() {
        this.getList();
    }

    getList(){
        this.InspectEval.getEvaluateList()
        .pipe(map((res: any) => res.data))
        .subscribe(res => {
            this.list = res;
            this.metaList = JSON.parse(JSON.stringify(res));
            this.listLength = res.length ? res.length : 0;
        });
    }

    toDetail(p: any) {
        this.router.navigate([
            '/evaluate/detail',
            p.inspection_appraisement_id ? p.inspection_appraisement_id : '000',
            p.apply_inspection_id,
            p.apply_inspection_no,
        ]);
        this.storage.set('EVALUATE_DETAIL_SKU', p.sku);
    }

    cancel(p: any) {
        this.es.showAlert({
            message: '确定要取消评价吗？',
            buttons: [
                {
                    text: '确定',
                    handler: () => {
                        this.InspectEval.cancelInspectAppraisement(p.inspection_appraisement_id).subscribe(res => {
                            if (res.status) {
                                this.es.showToast({
                                    color: 'success',
                                    message: res.message,
                                });
                                setTimeout(() => {
                                    this.getList();
                                }, 1000);
                            }
                        });
                    },
                },
                {
                    text: '取消',
                },
            ],
        });
    }

    filterFactory(e: any) {
        console.log(e);
        this.list = this.metaList.filter(res => res.factory_name.indexOf(e.detail.value) != -1)
    }
}
