import { HttpService } from './http.service';
import { contracts } from './task.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class TaskService {
    constructor(public http: HttpService) {}

    getTaskList(): Observable<contracts> {
        //通过用户信息获取任务列表
        return this.http.get({ url: '/task' });
    }

    getContractList(search?: contractListParams): Observable<any> {
        return this.http.get({ url: '/schedule/contract-list', params: search }); //合同列表
    }

    delTaskById(params: inspecParams) {
        //通过任务id删除任务
        return this.http.delete({ url: '/task/task-delete', params: { id: params.id } });
    }

    upDateTask(params: upDateTaskParams) {
        //修改任务
        return this.http.post({
            url: '/task/task-update',
            params: {
                id: params.id,
                user_id: params.user_id,
                contract_id: params.contract_id,
                date: params.date,
                count: params.count,
            },
        });
    }

    addTask(params: upDateTaskParams) {
        //添加任务
        return this.http.post({
            url: '/task/task-add',
            params: {
                user_id: params.user_id,
                contract_id: params.contract_id,
                date: params.date,
                count: params.count,
            },
        });
    }

    getTaskById(taskId: number): Observable<contracts> {
        //通过任务id获取任务详情  sku-列表
        return this.http.get({ url: '/task/task-sku-list', params: { task_id: taskId } });
    }

    toInspection(params: inspecParams): Observable<contracts> {
        //验货  （sku）
        return this.http.get({
            url: '/task/task-sku-view',
            params: { task_id: params.id, sku: params.sku, contract_id: params.contract_id },
        });
    }

    getAccessbyTaskAndFac(params: getPoParams): Observable<Array<any>> {
        //验货   （acc）
        return this.http.get({
            url: '/task/task-acc-view',
            params: { task_id: params.task_id, contract_id: params.contract_id },
        });
    }

    getPoListByTaskAndFactory(params: getPoParams): Observable<contracts> {
        //po列表
        return this.http.get({
            url: '/task/task-factory-contract',
            params: { task_id: params.task_id, factory_group: params.factory_group },
        });
    }

    getSkuListByPoAndTask(task_id: number, contract_id: number) {
        return this.http.get({
            url: '/task/contract-sku-list',
            params: { task_id: task_id, contract_id: contract_id },
        });
    }

    uploadTask(data: any): Observable<any> {
        //上传任务
        return this.http.post({ url: '/task/task-add', params: data });
    }

    getScheduleList(contract_id: number): Observable<any> {
        //进度列表
        return this.http.get({ url: '/schedule/' + contract_id });
    }

    updateSchedule(update: any) {
        //更新进度
        return this.http.post({ url: '/schedule', params: update });
    }

    updateNeedSchedule(needScheduleParams: needScheduleParams): Observable<any> {
        return this.http.post({ url: '/schedule/update_schedule-isneed', params: needScheduleParams });
    }

    getNeedSchedule(contract_id: number): Observable<Array<any>> {
        return this.http.get({ url: '/schedule/schedule-isneed', params: { contract_id: contract_id } });
    }

    getHistoryList(contract_id: number): Observable<contracts> {
        return this.http.get({ url: '/schedule/history', params: { contract_id: contract_id } });
    }

    getHistoryDetailByContract(id: number): Observable<contracts> {
        return this.http.get({ url: '/schedule/history-view', params: { id: id } });
    }

    delayTrack(id: number): Observable<any> {
        return this.http.get({ url: '/schedule/delay-track', params: { contract_id: id } });
    }

    recoveryDelay(id: number): Observable<any> {
        return this.http.get({ url: '/schedule/set-track', params: { contract_id: id } });
    }

    //////////////////////////////////////////////////////////////////////////////// 冗余api
    getDoneTaskList() {
        return this.http.get({ url: '/task/inspection-result-task-list' });
    }

    getDoneContractByTask(task_id: number) {
        return this.http.get({ url: '/task/inspection-result-contract-list', params: { task_id: task_id } });
    }

    getDoneSkuByTaskAndContract(getPoParams: getPoParams) {
        return this.http.get({ url: '/task/inspection-result-contract-sku-list', params: getPoParams });
    }

    getDoneSkuDetailByTaCaS(params: inspecParams) {
        return this.http.get({ url: '/task/sku-view', params: params });
    }

    //////////////////////////////////////////////////////////////////////////////// 冗余api
}

export interface getPoParams {
    task_id: number;
    factory_group?: number | string;
    contract_id?: number;
}

export interface inspecParams {
    id?: number;
    sku?: string;
    task_id?: number;
    contract_id: number;
}

export interface upDateTaskParams {
    id: number;
    user_id: number;
    contract_id: number;
    date: string;
    count: skuObject;
}

export interface skuObject {
    string: string;
}

export interface contracts {
    data: any;
    message: string;
    status: string;
}

export interface taskPage {
    current_page: number;
    data: Array<taskInfo>;
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

export interface taskInfo {
    created_at: string;
    id: number;
    task_no: string;
    task_id: number;
    updated_at: string;
    user_id: number;
    user_name?: string;
    factory: Array<any>;
    user_task: Array<any>;
    choiceFactoryId: number; //在任务列表选中的工厂id
}

export interface project {
    sku_sys: sku_sys;
    sku_other?: Array<sku_other>;
    sku_acc?: Array<any>;
}

export interface sku_other {
    InspectionRequiremen?: string; //验证内容
    IsNeedPic?: string; //是否需要拍照
    is_standard?: number; //是否通过
    remark?: string; //失败原因
    description?: string; //描述
    pic: Array<string>;
}

export interface sku_sys {
    BarCode?: string;
    contract_id?: number;
    ChineseDescription?: string;
    ChineseName?: string;
    Count?: number;
    DetailCount?: number;
    net_weight?: number;
    NetWeight?: number;
    OutsideBarCode?: string;
    outside_bar_code?: string;
    PackingSizeHight?: number;
    PackingSizeLength?: number;
    PackingSizeWidth?: number;
    PackingTypestring?: string;
    PackingWeight?: number;
    ProductCode?: string;
    ProductSizeHeight?: string;
    ProductSizeLength?: string;
    ProductSizeWidth?: string;
    RateContainer?: string;
    RoughWeight?: number;
    SinglePacking?: number;
    SinglePackingSizeHight?: number;
    SinglePackingSizeLength?: number;
    SinglePackingSizeWidth?: number;
    TextTure?: string;
    quantity?: number;
    rate_container?: number;
    rough_weight?: number;
    packing_size?: Array<string | number>;
    pic?: Array<string>;
}

export interface pagination {
    page: number;
}

export interface contractListParams extends pagination {
    type?: '' | 'create_user' | 'contract_no' | 'manufacturer' | 'sku';
    keywords?: string;
    is_update?: any;
    start_time?: string;
    end_time?: string;
    order_sign?: '' | 'asc' | 'desc';
    order_progress?: '' | 'asc' | 'desc';
    order_delivery?: '' | 'asc' | 'desc';
    is_delay_order?: '' | 1 | 2;
    is_out_shedule?: '' | 1 | 2;
    break_update?: '' | 1 | 2;
}

export interface needScheduleParams {
    contract_id: number;
    need_params: Array<any>;
}
