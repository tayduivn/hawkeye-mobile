import { HttpClient } from '@angular/common/http';
import { config } from '../config';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
// import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { jurdnInfo } from './jurdn.service';
 import { environment } from 'src/environments/environment';
import { menu, menuItem } from './menu';

@Injectable({
    providedIn: 'root',
})
export class BaseDataService {
    public userInfo: userInfo = new userInfo(null, '', '', ''); //用户信息
    jurdnList: jurdnInfo[] = [];
    public utilFn: any = {
        //公共方法
        toQueryString(obj) {
            let result = [];
            for (let key in obj) {
                key = encodeURIComponent(key);
                let values = obj[key];
                if (values && values.constructor == Array) {
                    let queryValues = [];
                    for (let i = 0, len = values.length, value; i < len; i++) {
                        value = values[i];
                        queryValues.push(this.toQueryPair(key, value));
                    }
                    result = result.concat(queryValues);
                } else {
                    result.push(this.toQueryPair(key, values));
                }
            }
            return result.join('&');
        },

        toQueryPair(key, value) {
            //参数序列化
            if (typeof value == 'undefined') {
                return key;
            }
            return key + '=' + encodeURIComponent(value === null ? '' : String(value));
        },

        formatData(params: any) {
            let arr: Array<any> = [];
            Object.keys(params).forEach((el) => {
                arr.push(`${el}=${params[el]}`);
            });
            return arr.join('&');
        },

        Format(fmt: string): string {
            var o = {
                'M+': new Date().getMonth() + 1, //月份
                'd+': new Date().getDate(), //日
                'H+': new Date().getHours(), //小时
                'm+': new Date().getMinutes(), //分
                's+': new Date().getSeconds(), //秒
                'q+': Math.floor((new Date().getMonth() + 3) / 3), //季度
                S: new Date().getMilliseconds(), //毫秒
            };
            if (/(y+)/.test(fmt))
                fmt = fmt.replace(RegExp.$1, (new Date().getFullYear() + '').substr(4 - RegExp.$1.length));
            for (var k in o)
                if (new RegExp('(' + k + ')').test(fmt))
                    fmt = fmt.replace(
                        RegExp.$1,
                        RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length),
                    );
            return fmt;
        },

        getPlatform(): string {
            if (
                navigator.userAgent.match(
                    /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i,
                )
            ) {
                /*window.location.href="你的手机版地址";*/
                return 'mobile';
            } else {
                /*window.location.href="你的电脑版地址";    */
                return 'pc';
            }
        },

        goBack() {
            history.go(-1);
        },

        // getSwiperPublicConfig(): SwiperConfigInterface {
        //     return {
        //         direction: 'horizontal',
        //         slidesPerView: 'auto',
        //         freeMode: true,
        //         init: true,
        //         scrollbar: {
        //             el: '.swiper-scrollbar',
        //         },
        //         mousewheel: false,
        //     };
        // },
    };

    public appPages: menuItem[] = menu;
    is_first: boolean; //是否第一次登陆
    is_Inspector: boolean; //是否是验货人
    public pageSize: number = 10;
    public apiUrl: string = environment.apiUrl;
    public usFileUrl: string = environment.usFileUrl;
    public fileUrl: string = environment.fileUrlPath;
    public notShowMenuPageArr: Array<string> = ['login', 'task-detail', 'add-jurdn']; //不显示菜单的页面。
    public printDebug: boolean = !environment.production;
    public upLoadMaxImgLength: number = config.upLoadMaxImgLength; //图片上传限量
    public renewInitRequestTime: number = config.renewInitRequestTime;
    public maxRenewInitRequest: number = config.maxRenewInitRequest;
    public loadding: boolean = false;
    valueUpdated: Subject<boolean> = new Subject<boolean>(); //为了发射loadding
    menuChanged: Subject<boolean> = new Subject<boolean>();
    autoExpandMenu: Subject<menuItem> = new Subject<menuItem>(); //自动展开菜单项

    constructor(public http: HttpClient) {}

    get(params: publicParams, showLoadding?: boolean): Observable<any> {
        //登陆后的get请求
        !showLoadding && this.setLoadding(true);
        return this.http.get(this.apiUrl + params.url, {
            headers: {
                Authorization: this.userInfo.api_token ? `Bearer ${this.userInfo.api_token}` : undefined, //this.userInfo.api_token ? `Bearer ${this.userInfo.api_token}` : undefined
            },
            params: params.params, //在此添加参数
        });
    }

    delete(params: publicParams, showLoadding?: boolean): Observable<any> {
        !showLoadding && this.setLoadding(true);
        return this.http.delete(this.apiUrl + params.url + '/' + params.params, {
            headers: {
                Authorization: this.userInfo.api_token ? `Bearer ${this.userInfo.api_token}` : undefined, //this.userInfo.api_token ? `Bearer ${this.userInfo.api_token}` : undefined
            },
        });
    }

    post(params: publicParams, showLoadding?: boolean): Observable<any> {
        !showLoadding && this.setLoadding(true);
        let obj: any = {
            'Content-Type': 'application/json;charset=UTF-8',
            Authorization: this.userInfo.api_token ? `Bearer ${this.userInfo.api_token}` : undefined, // this.userInfo.api_token ? `Bearer ${this.userInfo.api_token}` : undefined
        };
        !this.userInfo.api_token && delete obj.Authorization;
        return this.http.post(this.apiUrl + params.url, JSON.stringify(params.params), {
            //json
            headers: obj,
        });
    }

    get localOrigin() {
        return location.origin;
    }

    get isPc() {
        return window.innerWidth >= 1300 ? true : false;
    }

    setLoadding(val: boolean) {
        this.loadding = val;
        this.valueUpdated.next(this.loadding);
    }

    getLoadding(): boolean {
        return this.loadding;
    }

    setMenuChange(val: boolean) {
        this.menuChanged.next(val);
    }

    setMenuExpand(menuItem: menuItem) {
        this.autoExpandMenu.next(menuItem);
    }

    isSystemManger(): boolean {
        let some: boolean = false,
            mangerCompany: Array<string> = ['XD118', 'XD006', 'XD111', 'XD147'];
        if (mangerCompany.indexOf(this.userInfo.company_no) != -1) {
            some = true;
        }
        return some;
    }
}
export class userInfo {
    constructor(
        public id: number,
        public name: string,
        public email: string,
        public api_token: string,
        public level?: number,
        public company_no?: string,
        public department?: string,
    ) {}
}

export class publicParams {
    constructor(public url: string, public params?: any) {}
}

export default [];
