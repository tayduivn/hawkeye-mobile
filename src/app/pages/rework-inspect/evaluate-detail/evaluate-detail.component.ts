import { Component, OnInit } from '@angular/core';
import { SkuEvaluator } from '../../evaluate/detail/detail.component';
import { InspectEvaluateService } from 'src/app/services/inspect-evaluate.service';
import { PageEffectService } from 'src/app/services/page-effect.service';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from 'src/app/services/storage.service';

@Component({
    selector: 'app-evaluate-detail',
    templateUrl: './evaluate-detail.component.html',
    styleUrls: ['./evaluate-detail.component.scss'],
})
export class EvaluateDetailComponent implements OnInit {
    data: any = {
        inspection_cooperation_level: 0, //验货配合度
        reworkMark: 0, //返工痕迹
        inspection_cooperation_level_desc: '', //验货配合度描述
        rework_mark_level: 0,
        sku_appraisement: [], //sku评价列表
    };

    sku_appraisement: SkuEvaluator[] = [];

    apply_inspection_id: number = null;
    apply_inspection_no: number = null;
    inspection_appraisement_id: number = null;
    constructor(
        private evalService: InspectEvaluateService,
        private es: PageEffectService,
        private activeRoute: ActivatedRoute,
        private storage: StorageService,
        private router: Router,
    ) {}

    ngOnInit() {
        this.activeRoute.params.subscribe(res => {
            this.apply_inspection_id = res.applyId;
            this.inspection_appraisement_id = res.id;
            this.apply_inspection_no = res.applyNo;
        });
        let data = this.storage.get('EVALUATE_DETAIL_SKU');
        data &&
            data.forEach((elem: any) => {
                this.sku_appraisement.push({ sku: elem, desc: [{ text: '', level: '' }] });
            });
        if (!this.inspection_appraisement_id) return;
        this.getData();
    }

    getData() {
        this.evalService.getEvaluateById(this.inspection_appraisement_id).subscribe(res => {
            if (!res.status) return;
            this.data = JSON.parse(JSON.stringify(res.data));

            if (this.data.sku_appraisement && this.data.sku_appraisement.length)
                this.sku_appraisement = this.data.sku_appraisement;
        });
    }

    ionViewDidLeave() {
        this.storage.remove('EVALUATE_DETAIL_SKU');
    }

    submit() {
        this.data.apply_inspection_id = this.apply_inspection_id;
        this.data.apply_inspection_no = this.apply_inspection_no;
        this.data.storage_condition = [];

        let params = JSON.parse(JSON.stringify(this.data));
        params.sku_appraisement = JSON.parse(JSON.stringify(this.sku_appraisement));
        delete params.updated_at;
        delete params.created_at;
        this.evalService.postInspectAppraisement(params).subscribe(res => {
            this.es.showToast({
                color: res.status ? 'success' : 'danger',
                message: res.status ? res.message : '请填写完提交',
            });
            if (!res.status) return;
            setTimeout(() => {
                this.router.navigate([
                    '/rework-inspect/evaluate-reload',
                    res.data.inspection_appraisements_id,
                    this.apply_inspection_id,
                    this.apply_inspection_no,
                ]);
            }, 1000);
        });
    }

    skuAppraisementChange(e: any, i: number) {
        this.sku_appraisement[i].appraisement = e.detail.value;
    }

    descEnter(e: Array<{ text: string; level: string }>, i: number) {
        this.sku_appraisement[i].desc = e;
    }
}
