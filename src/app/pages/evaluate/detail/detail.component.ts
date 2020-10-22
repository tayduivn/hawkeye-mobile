import { PageEffectService } from './../../../services/page-effect.service';
import { ActivatedRoute, Router } from '@angular/router';
import { InspectEvaluateService } from './../../../services/inspect-evaluate.service';
import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../../services/storage.service';

export interface SkuEvaluator {
    sku: string;
    appraisement?: string;
    desc?: Array<{ text: string; level: string }>;
}
@Component({
    selector: 'app-detail',
    templateUrl: './detail.component.html',
    styleUrls: ['./detail.component.scss'],
})
export class DetailComponent implements OnInit {
    type: 'rework' | 'default' = 'default';
    data: any = {
        inspection_cooperation_level: 0, //验货配合度
        reworkMark: 0, //返工痕迹
        inspection_cooperation_level_desc: '', //验货配合度描述
        storage_condition_appraisement: '', //仓储条件
        storage_condition_desc: '',
        rework_mark_level:0,
        production_type: '', //产品情况
        remaining_storage_space_condition: 0, //剩余仓储情况
        factory_situation: '', //工厂情况
        sku_appraisement: [], //sku评价列表
    };

    sku_appraisement: SkuEvaluator[] = [];
    storage_condition_ary: any[] = [
        {
            key: '使用托盘',
            value: 0,
        },
        {
            key: '场地干燥',
            value: 0,
        },
        {
            key: '堆放整齐',
            value: 0,
        },
        {
            key: '有管理员',
            value: 0,
        },
    ];

    other: boolean = false;
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
            this.type = res.data.is_rework ? 'rework' : 'default';
            this.data =JSON.parse(JSON.stringify(res.data)) ;
            console.log(this.data )
            if (this.data.storage_condition) {
                this.storage_condition_ary.forEach((elem, i) => {
                    this.data.storage_condition.indexOf(i) != -1 && (this.storage_condition_ary[i].value = 1);
                });
            }

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
        this.storage_condition_ary.forEach((elem, i) => {
            elem.value && this.data.storage_condition.push(i);
        });
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
                let route = location.hash.indexOf('detail') != -1 ? 'reload' : 'detail';
                this.router.navigate([
                    '/evaluate/' + route,
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
