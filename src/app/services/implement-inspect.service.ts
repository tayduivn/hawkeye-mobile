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
    inspection_group_id?: string;
    contract_data?: PoModal;
}

export interface SkuParams {
    apply_inspection_no: string;
    sku: string;
    is_inner_box?: 1 | 2;
    contract_no: string;
}

export interface RemovePicParams {
    apply_inspection_no: string;
    type: FieldType;
    filename: string;
    contract_no?: string;
    sku?: string;
    is_inner_box?: number;
    sort_index?: number;
}

export interface CopySkuParams {
    apply_inspection_no: string;
    sku: string;
    contract_no: string;
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

    getInspectData(no: string, inspection_group_id?: string) {
        return this.http.get({
            url: '/task/get_inspection_task_posted_data',
            params: { apply_inspection_no: no, inspection_group_id: inspection_group_id },
        });
    }

    submitSkuData(
        params: SkuUploadData,
        sku: string,
        apply_inspection_no: string,
        data_type: 'before' | 'after',
        is_inner_box: number,
        contract_no: string,
    ) {
        params.data_type = data_type;
        params.sku = sku;
        params.apply_inspection_no = apply_inspection_no;
        params.is_inner_box = is_inner_box;
        params.contract_no = contract_no;
        return this.http.post({
            url: '/task/post_inspection_post_for_product',
            params: params,
        });
    }

    getBeforeBoxData(params: SkuParams) {
        return this.http.get({
            url: '/task/get_inspection_task_posted_data_for_sku_before_unbox',
            params: params,
        });
    }

    getAfterBoxData(params: SkuParams) {
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

    copySku(params: CopySkuParams): Observable<any> {
        return this.http.get({
            url: '/task/copy_inspection_task_data',
            params: params,
        });
    }
}
