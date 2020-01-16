import { Observable } from 'rxjs';
import { HttpService } from './http.service';
import { Injectable } from '@angular/core';

export interface InspectEvaluateResponse {
    status: number;
    message: string;
    data: InspectEvaluate;
}

export interface InspectEvaluate {
    id: number;
    apply_inspection_id: number;
    inspection_cooperation_level_desc: string; //验货配合度备注
    inspection_cooperation_level: number; //验货配合度0,1,2按顺序为（'高','一般','低'）
    remaining_storage_space_condition: number; //剩余储存情况 0,1,3对应为 '充足','一般','紧张'
    storage_condition_desc: string; //储存条件备注
    storage_condition_appraisement: number; //储存条件评价（1,1,2对应---优秀、一般、不合格）
    storage_condition: Array<number>;
    production_type: string;
    factory_situation: string;
    created_at: string;
    updated_at: string;
    sku_appraisement: Array<SkuAppraisement>;
}

export interface SkuAppraisement {
    sku: string;
    appraisement: number;
}

export interface InspectAppraisementParams {
    apply_inspection_id: number;
    factory_situation: string;
    inspection_cooperation_level: number;
    inspection_cooperation_level_desc: string;
    production_type: string;
    remaining_storage_space_condition: number;
    sku_appraisement: SkuAppraisement[];
    storage_condition: Array<number>;
    storage_condition_desc: string;
}
//storage_condition_appraisement: '',             //仓储条件

export interface InspectAppraisementListResponse {
    status: number;
    message: string;
    data: Array<InspectAppraisementItem>;
}

export interface InspectAppraisementItem {
    apply_inspection_no: string;
    apply_inspection_id: number;
    contract_no: string;
    created_at: string;
    factory_name: string;
    inspection_appraisement_id: number;
    updated_at: string;
}

@Injectable({
    providedIn: 'root',
})
export class InspectEvaluateService {
    constructor(private http: HttpService) {}

    getEvaluateList(): Observable<InspectAppraisementListResponse> {
        //获取评价列表
        return this.http.get({ url: '/task/inspection_appraisement_list' });
    }

    getEvaluateById(inspection_appraisement_id: number): Observable<InspectEvaluateResponse> {
        return this.http.get({
            url: '/task/get_appraisement_data_by_id',
            params: { inspection_appraisement_id: inspection_appraisement_id },
        });
    }

    postInspectAppraisement(params: InspectAppraisementParams): Observable<any> {
        return this.http.post({ url: '/task/inspection_appraisement', params: params });
    }
}
