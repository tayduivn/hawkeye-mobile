// 工厂考察pad端接口文件
import { HttpService } from './http.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
@Injectable({
    providedIn: 'root',
})
export class inspectingService {
    constructor(private http: HttpService) {}
    getFactoryList(params: FactoryListQueryInfo): Observable<any> {
        return this.http.get({
            url: '/factory/factory-inspect-list',
            params,
        });
    }

    // 保存工厂基本信息的时候请求的接口
    saveFactoryBaseInformation(params: SaveFactoryInfo): Observable<any> {
        return this.http.post({
            url: '/factory/add-factory-inspect',
            params,
        });
    }

    // 保存工厂概况的信息
    saveGeneralInfomation(params): Observable<any> {
        return this.http.post({
            url: '/factory/add-factory-inspect-info',
            params,
        });
    }
}
export interface FactoryListQueryInfo {
    page?: number;
    name?: string;
}
export interface SaveFactoryInfo {
    user_id: number; //用户编号（考察人员）
    name: string; //工厂名称（考察对象）
    add_time: string; //创建时间（考察日期）
    address_one: string; //地址1
    address_two?: string; //地址2
    contacts: string; //联系人
    position: string; //职位
    phone: string; //联系方式
    legaler: string; //法人
    registered_capital?: string; //注册资本
    annual_sales?: string; //年销售额
    company_nature: string; //公司性质
    create_time?: string; //成立时间
    product_type: string; //产品类型
}