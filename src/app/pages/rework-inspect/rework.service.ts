import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from 'src/app/services/http.service';

export interface CustomResponse<T> {
    status: 0 | 1;
    message: string;
    data: T;
}

export interface ReworkFactory {
    factory_name: string;
    factory_contacts: string;
    data: Array<{
        factory_code: string;
        apply_inspection_no: string;
        contract_total: number;
        sku_total: number;
    }>;
}

export interface ReworkContract {
    contract_no: string;
    data: Array<{
        sku: string;
        sku_chinese_name: string;
        quantity: number;
    }>;
}

export interface ReworkSku {
    sku_info: {
        apply_inspection_no?: string;
        contract_no?: string;
        inspectionDate?: string;
        unpackingNum: number;
        unpackingPercent: number;
        photo: Array<string>;
        sku_chinese_name: string;
        sku: string;
        barCode: {
            isTrue: number;
            text: string;
            photos: [];
            desc: [{
                text: string;
                level: null;
            }];
        };
        sumUp: {
            videos: Array<string>;
            photos: Array<string>;
            desc: {
                text: string;
                level: null;
            };
        };
    };
}

@Injectable({
    providedIn: 'root',
})
export class ReworkService {
    constructor(private http: HttpService) {}

    getReworkFactoryList(params?: {keywords: string;value:string}): Observable<CustomResponse<Array<ReworkFactory>>> {
        return this.http.get({ url: '/task/inspection_task_list_rework2',params });
    }

    getReworkContractForApplyId(apply_inspection_no: string): Observable<CustomResponse<Array<ReworkContract>>> {
        return this.http.get({ url: '/task/inspection_rework_contract_info', params: { apply_inspection_no } });
    }

    getReworkSkuInfo(params: {
        apply_inspection_no: string;
        contract_no: string;
        sku: string;
    }): Observable<CustomResponse<ReworkSku>> {
        return this.http.get({ url: '/task/get_rework_sku_info', params });
    }

    submitReworkSku(params: ReworkSku): Observable<CustomResponse<null>> {
        return this.http.post({ url: '/task/post_inspection_task_rework_data', params });
    }
}
