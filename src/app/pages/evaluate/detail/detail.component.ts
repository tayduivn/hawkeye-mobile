import { PageEffectService } from './../../../services/page-effect.service';
import { ActivatedRoute, Router } from '@angular/router';
import { InspectEvaluateService, InspectAppraisementParams } from './../../../services/inspect-evaluate.service';
import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../../services/storage.service';
import { Route } from '@angular/compiler/src/core';

@Component({
    selector: 'app-detail',
    templateUrl: './detail.component.html',
    styleUrls: ['./detail.component.scss'],
})
export class DetailComponent implements OnInit {
    data: any = {
        inspection_cooperation_level: 0, //验货配合度
        inspection_cooperation_level_desc: '', //验货配合度描述
        storage_condition_appraisement: '', //仓储条件
        storage_condition_desc: '',
        production_type: '', //产品情况
        remaining_storage_space_condition: 0, //剩余仓储情况
        factory_situation: '', //工厂情况
        sku_appraisement: [], //sku评价列表
    };
    sku_appraisement: any[] = [];
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
    inspection_appraisement_id: number = null;
    constructor(
        private evalService: InspectEvaluateService,
        private es: PageEffectService,
        private activeRoute: ActivatedRoute,
        private storage: StorageService,
        private router:Router
    ) {}

    ngOnInit() {
        this.activeRoute.params.subscribe(res => {
            this.apply_inspection_id = res.applyId;
            this.inspection_appraisement_id = res.id;
        });
        let data = this.storage.get('EVALUATE_DETAIL_SKU');
        data && data.forEach(elem => {
            this.sku_appraisement.push({ sku: elem });
        });
        if (!this.inspection_appraisement_id) return;
        this.getData()
    }

    getData(){
        this.evalService.getEvaluateById(this.inspection_appraisement_id).subscribe(res => {
            if (!res.status) return;
            this.data = res.data;
            this.storage_condition_ary.forEach((elem, i) => {
                this.data.storage_condition.indexOf(i) != -1 && (this.storage_condition_ary[i].value = 1);
            });

            if (this.data.sku_appraisement && this.data.sku_appraisement.length)
                this.sku_appraisement = this.data.sku_appraisement;
        });
    }

    ionViewDidLeave() {
        this.storage.remove('EVALUATE_DETAIL_SKU');
    }

    submit() {
        this.data.apply_inspection_id = this.apply_inspection_id;
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
                color:'success',
                message: res.message,
            });
            let route=location.hash.indexOf('detail') != -1 ? 'reload' : 'detail'
            this.router.navigate(['/evaluate/' + route,res.data.inspection_appraisements_id,this.apply_inspection_id])
        });
    }

    skuAppraisementChange(e: any, i: number) {
        this.sku_appraisement[i].appraisement = e.detail.value;
        console.log(this.sku_appraisement);
    }
}
