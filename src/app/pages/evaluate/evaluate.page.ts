import { InspectEvaluateService, InspectAppraisementItem } from './../../services/inspect-evaluate.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { StorageService } from '../../services/storage.service';
import { PageEffectService } from '../../services/page-effect.service';
import { Paging } from 'src/app/services/inspection.service';

@Component({
    selector: 'app-evaluate',
    templateUrl: './evaluate.page.html',
    styleUrls: ['./evaluate.page.scss'],
})
export class EvaluatePage implements OnInit {
    ngOnInit(): void {}
    list: InspectAppraisementItem[] = [];
    data: Paging<InspectAppraisementItem[]> = null;
    metaList: InspectAppraisementItem[] = [];
    listLength: number;
    keywords: string = '';

    getListParams: any = {
        keywords: 'factory_name',
        value: '',
        page: 1,
    };

    constructor(
        private router: Router,
        private es: PageEffectService,
        private storage: StorageService,
        private InspectEval: InspectEvaluateService,
    ) {}

    ionViewWillEnter() {
        this.getListParams.page = 1;
        this.getList();
    }

    getList() {
        this.InspectEval.getEvaluateList(this.getListParams)
            .pipe(map((res: any) => res.data))
            .subscribe(res => {
                this.list = res.data;
                this.metaList = JSON.parse(JSON.stringify(res.data));
                this.getListParams.page = res.current_page + 1;
            });
    }

    loadData(event: any) {
        this.InspectEval.getEvaluateList(this.getListParams)
            .pipe(map((res: any) => res.data))
            .subscribe(res => {
                if (res.data && res.data.length) {
                    this.list = this.list.concat(res.data);
                    this.metaList = JSON.parse(JSON.stringify(res.data));
                    this.getListParams.page = res.current_page + 1;
                } else {
                    this.es.showToast({
                        message: '别刷了，没有数据啦！',
                        color: 'danger',
                    });
                }
                event.target.complete();
            });
    }

    toDetail(p: any) {
        this.router.navigate([
            p.is_rework ? '/rework-inspect/evaluate' : '/evaluate/detail',
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
                                    this.getListParams.page = 1;
                                    this.getList();
                                }, 200);
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
        this.getListParams.page = 1;
        this.InspectEval.getEvaluateList(this.getListParams)
            .pipe(map((res: any) => res.data))
            .subscribe(res => {
                if (res.data && res.data.length) {
                    this.list = res.data;
                    this.getListParams.page = res.current_page + 1;
                } else {
                    this.es.showToast({
                        message: '暂未搜索到匹配的工厂',
                        color: 'danger',
                    });
                }
            });
    }
}
