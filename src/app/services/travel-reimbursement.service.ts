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
            url: '/travel/add_travel_reimbursement',
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
}
