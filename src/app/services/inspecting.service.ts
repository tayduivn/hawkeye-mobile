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
    saveGeneralInformation(params: saveGeneralInformation): Observable<any> {
        return this.http.post({
            url: '/factory/add-factory-inspect-info',
            params,
        });
    }

    // 获取工厂详情
    getFactoryXQ(params: GetFactoryDetails): Observable<any> {
        return this.http.get({
            url: '/factory/factory-inspect-by-id',
            params,
        });
    }

    // 保存产品的信息接口
    saveProductInformation(params): Observable<any> {
        return this.http.post({
            url: '/factory/add-factory-inspect-product',
            params,
        });
    }
}
export interface FactoryListQueryInfo {
    page?: number;
    name?: string;
}
export interface SaveFactoryInfo {
    factory_id?: number; //工厂id
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

export interface GetFactoryDetails {
    factory_id: number;
}

// 保存工厂基本信息的接口
export interface saveGeneralInformation {
    factory_id?: number; //工厂 的id
    acreage: number; //工厂面积
    people_num: number; //工厂人数
    manning: string; //人员组成
    department: string; //部门组成
    production_equipment: string; //生产设备
    production_capacity: number; //生产能力
    quality?: number; //研发质检能力
    production_cycle: string; //生产周期
    sales_market: string; //主要销售市场
    customer?: string; //主要客户
    authentication?: string; //产品想换认证
    pay_type: string; //付款方式
    third_party: number; //是否接受过第三方验厂
    third_name?: string; //第三方名称
}
