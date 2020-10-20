import { Injectable } from '@angular/core';
import { FieldType, UploadParams } from 'src/app/widget/videotape/videotape.component';
import { ImageOther } from 'src/app/services/file-upload.service';

@Injectable({
    providedIn: 'root',
})
export class InspectCacheService {
    //验货全局缓存
    constructor() {
        // this.getOffLinePath()
    }

    //文字缓存
    cacheInspectText(obj: any) {
        localStorage.setItem('CURRENT_INSPECT_META_DATA_TEXT', JSON.stringify(obj));
    }

    getInspectText(): any {
        return JSON.parse(localStorage.getItem('CURRENT_INSPECT_META_DATA_TEXT'));
    }
 
    //图片/视频路径
    cacheInspectPath(elem: any) {
        //type : ImageOther | UploadParams
        //console.log(elem)
        let cache: Array<ImageOther> = JSON.parse(localStorage.getItem('CURRENT_INSPECT_META_DATA_PATH'));
        cache ? cache.push(elem) : (cache = [elem]);
        //增加用户判断 防止添加到别的用户的缓存里。
        localStorage.setItem('CURRENT_INSPECT_META_DATA_PATH', JSON.stringify(cache));
    }

    //提取图片/视频缓存
    getImagePath(): Array<ImageOther> {
        return JSON.parse(localStorage.getItem('CURRENT_INSPECT_META_DATA_PATH'));
    }

    //删除缓存
    removeCache(elem: ImageOther) {
        let cache: Array<ImageOther> = JSON.parse(localStorage.getItem('CURRENT_INSPECT_META_DATA_PATH')),
            currentIndex: number;
        if (!cache || !cache.length) return;
        cache.forEach((item, index) => {
            if (item.hash === elem.hash) {
                currentIndex = index;
            }
        });
        cache.splice(currentIndex, 1);
        //从新塞进缓存
        localStorage.setItem('CURRENT_INSPECT_META_DATA_PATH', JSON.stringify(cache));
    }
}

export interface ImageCacheElem {
    //此类与ImageOther类似
    type: FieldType;
    apply_inspection_no: string;
    contract_no: string;
    sku: string;
    path: string;
    is_inner_box: 0 | 2;
    user_id?: number;
    sort_index?: number;
}

export interface InspectSkuCache {
    apply_inspection_no: string;
    factory: string;
    contract: InspectSkuContract;
}

export interface InspectSkuContract {
    contract_no: string;
    sku: InspectSkuData;
}

export interface InspectSkuData {
    inner_box: InspectSkuDataField;
    outer_box: InspectSkuDataField;
}

export interface InspectSkuDataField {
    throw_box_video: Array<string>;
    appearance_video: Array<string>;
    functions_video: Array<string>;
    bearing_test_video: Array<string>;
    water_content_test_video: Array<string>;
    factory_sample_room: Array<string>;
    outer_box_pic: Array<string>;
    bar_code_pic: Array<string>;
    factory_other: Array<string>;
    gross_weight_pic: Array<string>;
    product_detail_pic: Array<string>;
    instructions_pic: Array<string>;
    screws_pic: Array<string>;
    product_wholes_pic: Array<string>;
    product_size_pic: Array<string>;
    appearance_pic: Array<string>;
    functions_pic: Array<string>;
    summary_pic: Array<string>;
    inspection_require_pic: Array<string>;
    throw_box: Array<string>;
    size_pic: Array<string>;
    size_pic_length: Array<string>;
    size_pic_width: Array<string>;
    size_pic_height: Array<string>;
    packing_pic: Array<string>;
    product_place_pic: Array<string>;
    instructions_and_accessories_pic: Array<string>;
    over_all_pic: Array<string>;
    net_weight_pic: Array<string>;
    bearing_test_pic: Array<string>;
    water_content_test_pic: Array<string>;
    inspection_complete_pic: Array<string>;
    contract_sku_pic: Array<string>;
    factory_environment_pic: Array<string>;
    factory_sample_room_pic: Array<string>;
    factory_other_pic: Array<string>;
}
