import { BaseDataService } from './base-data.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class JurdnService {
    getJurdnList(): Observable<Array<jurdnInfo>> {
        //获取全部权限
        return this.baseData.get({ url: '/permissions/all-permission', params: {} });
    }

    getChildJurdnById(jurId: number) {
        //根据id显示子权限
        return this.baseData.get({ url: '/permissions/show-permission', params: { pid: jurId } });
    }

    getJurdnById(jurId: number) {
        //根据id显示权限
        return this.baseData.get({ url: '/permissions/current-permission', params: { id: jurId } });
    }

    addJurdn(jurdnInfo: jurdnInfo) {
        //添加权限
        return this.baseData.post({ url: '/permissions', params: jurdnInfo });
    }

    removeJurdn(jurId: number) {
        //根据id删除权限
        return this.baseData.delete({ url: '/permissions', params: jurId });
    }

    modifyJurdn(modifyJurdn: jurdnInfo) {
        //修改权限
        return this.baseData.post({ url: '/permissions/update-permission', params: modifyJurdn });
    }

    gaveJurdn(modifyUserjur: modifyUserjur) {
        //给用户分配权限
        return this.baseData.post({ url: '/permissions/gave-permission', params: modifyUserjur });
    }

    getJurdn(params: getJurdnListParams) {
        //显示用户权限
        return this.baseData.get({ url: '/permissions/user-role-permission', params: params });
    }

    //设置权限session
    doCheckCache(jurdnCache: jurdnCache) {
        let jurdnList = sessionStorage.getItem('JURDN_SET_ALL_JURDN');
        //遍历列表 找出jurdnCache.item
        if (jurdnList && jurdnList.length) {
            for (var i = 0; i < jurdnList.length; i++) {}
            //判断type为del还是modify
            //setCache
        }
    }

    constructor(public baseData: BaseDataService) {}
}

export class modifyUserjur {
    constructor(
        public type: 'user' | 'role',
        public permission_id: Array<number | string>,
        public role_id?: number,
        public user_id?: number,
    ) {}
}

export interface jurdnInfo {
    api_route: string;
    display?: boolean | number;
    display_name: string;
    user_limit: string;
    parent_id: number;
    id: number;
    showChild?: boolean;
    child: Array<jurdnInfo>;
}

export interface jurdnCache {
    type: string;
    item: jurdnInfo;
}

export interface getJurdnListParams {
    type: string;
    role_id?: number;
    user_id?: number;
}
