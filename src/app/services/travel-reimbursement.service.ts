import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from './http.service';

@Injectable({
    providedIn: 'root',
})
export class TravelReimbursementService {
    constructor(private http: HttpService) {}
    // 添加出差报销记录
    add_travel_reimbursement(params): Observable<any> {
        return this.http.post({
            url: '/travel/add_travel_reimbursement_deatils',
            params,
        });
    }

    // 获取详情
    // 获取出差报告列表
    getReportList(params): Observable<any> {
        // debugger;
        return this.http.get({
            url: '/travel/get_travel_reimbursement_list',
            params,
        });
    }
    // /travel/get_factory_and_serial
    // 获取出差工厂及流水号列表;
    getFactoryAndSerial(params): Observable<any> {
        return this.http.get({
            url: '/travel/get_factory_and_serial',
            params,
        });
    }

    // 保存基本信息的接口
    saveBaseInformation(params): Observable<any> {
        return this.http.post({
            url: '/travel/add_travel_reimbursement',
            params,
        });
    }

    // 获取详情
    getDetails(params): Observable<any> {
        return this.http.get({
            url: '/travel/get_travel_reimbursement_details',
            params,
        });
    }

    // 获取前置数据
    // /travel/get_preposition_data
    getPrepositionData(): Observable<any> {
        return this.http.get({
            url: '/travel/get_preposition_data',
        });
    }

    // 提交编辑
    compileDetails(params): Observable<any> {
        return this.http.post({
            url: '/travel/upd_travel_reimbursement',
            params,
        });
    }

    // 删除图片
    ///travel/del_travel_reimbursement_img
    deletePic(params): Observable<any> {
        return this.http.post({
            url: '/travel/del_travel_reimbursement_img',
            params,
        });
    }

    // /travel/del_transportation_expenses
    // 删除油费交通费的唯一标识
    // /travel/del_transportation_expenses
    deleteOilOrTrafficCost(params): Observable<any> {
        return this.http.post({
            url: '/travel/del_transportation_expenses',
            params,
        });
    }

    // 更新报销总额
    updBxTotal(params): Observable<any> {
        return this.http.post({
            url: '/travel/update_travel_sum_cost',
            params,
        });
    }
}
