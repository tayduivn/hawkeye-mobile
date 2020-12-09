import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { InstallData } from '../pages/arraying-container/installed-cabinets/installed-cabinets.component';

export interface Response<T> {
    status: number;
    message: string;
    data: T;
}

export interface Paging<T> {
    map(arg0: (sku: any) => void);
    current_page: number;
    data: T;
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    next_page_url: string;
    path: string;
    per_page: number;
    prev_page_url: string;
    to: number;
    total: number;
}

export interface ArrayingContainerData {
    shipping_room: string;
    estimate_loading_time: string;
    bl_no: string;
    desc: string;
    id: number;
}

export interface AlreadyArrayingData {
    shipping_rooms: Array<{ id: number; name: string; name_chinese: string }>;
    data: Paging<Array<ArrayingItem>>;
}

export interface ArrayingItem {
    id: number;
    name: string;
    shipping_room: string;
    arraying_container_num: number;
    truely_loading_time: string;
    estimated_arrival_time: string;
    on_board_date: string;
    estimate_loading_time: string;
    seal_no: string;
    container_no: string;
    bl_no: string;
    desc: string;
    status: number;
    created_at: string;
    updated_at: string;
    arraying_container_sku: any;
}

@Injectable({
    providedIn: 'root',
})
export class ArrayingService {
    constructor(private http: HttpService) {}

    /**
     * 获得待排柜sku列表
     */

    getWaitingContainerData(data): Observable<Paging<any[]>> {
        return this.http
            .get({ url: `/arrayingContainer/get_waiting_distribution_container_data`, params: data })
            .pipe(map(res => res.data));
    }

    /**
     * 提交排柜数据
     */
    postContainerData(skuIds: Array<{ arraying_container_num: number; id: number }>): Observable<Response<string>> {
        return this.http.post({
            url: '/arrayingContainer/post_distribution_container',
            params: { arraying_container_sku_arr: skuIds },
        });
    }

    /**
     * 获得已排柜数据
     */
    getAlreadyContainerData(data): Observable<AlreadyArrayingData> {
        return this.http
            .get({ url: '/arrayingContainer/get_distribution_container_data', params: data })
            .pipe(map(res => res.data));
    }

    /**
     * 提交排柜清单数据
     */
    postArrayingContainerData(data: ArrayingContainerData): Observable<Response<any>> {
        return this.http.post({ url: '/arrayingContainer/post_arraying_container_data', params: data });
    }

    /**
     * 待装柜列表
     */
    getLoadingData(data): Observable<Paging<ArrayingItem[]>> {
        return this.http.get({ url: '/arrayingContainer/get_loading_data', params: data }).pipe(map(res => res.data));
    }

    /**提交装柜数据 */
    postLoadingData(data: InstallData) {
        return this.http.post({ url: '/arrayingContainer/post_loading_data', params: data });
    }
    // 获取统计数据
    // /api/v1/arrayingContainer/count_distribution_container_data  统计数据接口
    getCountData(data) {
        return this.http.post({ url: '/arrayingContainer/count_distribution_container_data', params: data });
    }
    // 撤销已排柜数据
    // /api/v1/arrayingContainer/reset_arrayinged_container_data
    postRevocationDoneList(data) {
        return this.http.post({ url: '/arrayingContainer/reset_arrayinged_container_data', params: data });
    }
    // 撤销待装柜的接口
    // /api/v1/arrayingContainer/reset_loading_arraying_container_data
    postRevocationInstalled(data) {
        return this.http.post({ url: '/arrayingContainer/reset_loading_arraying_container_data', params: data });
    }

    // 撤销最终装柜列表
    postRevocationFinalCabnets(data) {
        return this.http.post({ url: '/arrayingContainer/reset_final_loading_data', params: data });
    }
    /**
     * 获取最终数据
     */
    getFinalData(data?: any) {
        return this.http.get({
            url: '/arrayingContainer/get_final_loading_data',
            params: data,
        });
    }
}
