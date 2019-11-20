import { Observable } from 'rxjs';
import { PoModal } from './../pages/implement-inspection/inspect-po/inspect-po.component';
import { HttpService } from './http.service';
import { Injectable } from '@angular/core';
import { FactoryModel } from '../pages/implement-inspection/inspect-factory/inspect-factory.component';
import { SkuUploadData } from '../pages/implement-inspection/inspect-sku/inspect-sku.component';
import { FieldType } from '../widget/videotape/videotape.component';

export interface InspectFactoryParam {
    factory_data?: FactoryModel;
    apply_inspection_no: string;
    contract_data?: PoModal;
}

export interface SkuParams {
    apply_inspection_no: string;
    sku: string;
    is_inner_box?: 1 | 2;
}

export interface RemovePicParams {
    apply_inspection_no: string;
    type: FieldType;
    filename: string;
    contract_no?: string;
    sku?: string;
}

@Injectable({
    providedIn: 'root',
})
export class ImplementInspectService {
    constructor(private http: HttpService) {}

    inspectFactory(params: InspectFactoryParam) {
        return this.http.post({
            url: '/task/task-inspection-post',
            params: params,
        });
    }

    getInspectData(no: string) {
        return this.http.get({
            url: '/task/get_inspection_task_posted_data',
            params: { apply_inspection_no: no },
        });
    }

    submitSkuData(params: SkuUploadData, sku: string, apply_inspection_no: string, is_inner_box: number) {
        params.sku = sku;
        params.apply_inspection_no = apply_inspection_no;
        params.is_inner_box = is_inner_box;
        return this.http.post({
            url: '/task/post_inspection_post_for_product',
            params: params,
        });
    }

    getBeforeBoxData(params: SkuParams) {
        // params = {
        //     apply_inspection_no: 'YH-191000101111111112222',
        //     sku: 'sfaaaaaaaaaaa11112222333311',
        //     is_inner_box: 1,
        // };

        return this.http.get({
            url: '/task/get_inspection_task_posted_data_for_sku_before_unbox',
            params: params,
        });
    }

    getAfterBoxData(params: SkuParams) {
        // params = {Electro🐴Electron
        //     apply_inspection_no: 'YH-191000101111111112222',
        //     sku: 'sfaaaaaaaaaaa111122223333',
        //     is_inner_box: 1,
        // };
        return this.http.get({
            url: '/task/get_inspection_task_posted_data_for_sku_after_unbox',
            params: params,
        });
    }

    removeFactoryPic(params: RemovePicParams) {
        return this.http.post({
            url: '/task/del_inspection_task_image_for_factory',
            params: params,
        });
    }

    removeContractPic(params: RemovePicParams) {
        return this.http.post({
            url: '/task/del_inspection_task_image_for_contract',
            params: params,
        });
    }

    removeSkuPic(params: RemovePicParams): Observable<any> {
        return this.http.post({
            url: '/task/del_inspection_task_image_for_sku',
            params: params,
        });
    }

    removeSkuVideo(params: RemovePicParams): Observable<any> {
        return this.http.post({
            url: '/task/del_inspection_task_video_for_sku',
            params: params,
        });
    }
}
