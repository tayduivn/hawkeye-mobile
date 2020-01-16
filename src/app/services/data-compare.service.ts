import { HttpService } from './http.service';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

export interface SkuCompareParams {
    contract_id: number;
    apply_inspection_no: string;
    sku: string;
}

@Injectable({
    providedIn: 'root',
})
export class DataCompareService {
    constructor(private http: HttpService) {}

    getCompareBasicList(): Observable<any> {
        return this.http.get({ url: '/task/get_compare_apply_inspection_data' });
    }

    getCompareDetail(params: SkuCompareParams): Observable<any> {
        return this.http.get({ url: '/task/get_compare_sku_data_for_basic_inspector', params: params });
    }
}
