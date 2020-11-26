import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface CurrencyResponse<T> {
    status: number;
    message: string;
    data: T;
}

export interface PartsInfo {
    accessory_gross_weight: { text: string; pic: Array<string>; desc: Array<string> };
    accessory_list: Array<Accessory>;
    accessory_shipping_mark: { pic: Array<string>; desc: Array<string> };
    accessory_size: {
        size_height: { pic: Array<string>; desc: Array<string>; text: string };
        size_length: { pic: Array<string>; desc: Array<string>; text: string };
        size_width: { pic: Array<string>; desc: Array<string>; text: string };
        desc: Array<{ text: string; desc: string }>;
    };
    accessory_size_desc: Array<string>;
    is_empty: boolean;
}

export interface Accessory {
    AccessoryCode: string;
    AccessoryName: string;
    BarCode: string;
    ChineseDescription: string;
    PackingType: string;
    ProductCode: string;
    StockDetailNum: number;
}

@Injectable({
    providedIn: 'root',
})
export class PartService {
    constructor(private http: HttpService) {}

    getPartsInfo(params: {
        apply_inspection_no: string;
        contract_no: string;
    }): Observable<CurrencyResponse<PartsInfo>> {
        return this.http.get({ url: '/task/get_accessory_info', params });
    }

    saveAccessoryInfo(params: any): Observable<CurrencyResponse<null>> {
        return this.http.post({ url: '/task/post_accessory_info', params });
    }

    saveAccessory(params: any): Observable<CurrencyResponse<null>> {
        return this.http.post({ url: '/task/post_accessory_sku_info', params });
    }

    getPartSkuInfo(params: {
        apply_inspection_no: string;
        contract_no: string;
        sku: string;
    }): Observable<any> {
        return this.http.get({ url: '/task/get_accessory_sku_info', params }).pipe(map(res => res.data));
    }
}
