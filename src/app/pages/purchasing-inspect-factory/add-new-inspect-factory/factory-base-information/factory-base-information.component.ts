import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PageEffectService } from 'src/app/services/page-effect.service';
import _ from 'loadsh';
import { combineLatest, takeWhile } from 'rxjs/operators';
import { inspectingService } from 'src/app/services/inspecting.service';
import { EmitService } from '../emit.service';
import { PhotoMiniComponent } from 'src/app/widget/photo-mini/photo-mini.component';
import { IsSaveServiceService } from '../../is-save-service.service';
import { from, Observable } from 'rxjs';
// import { UserInfoService } from 'src/app/services/user-info.service';
import { UserInfoService } from '../user-info.service';
import { IsDisabledService } from './is-disabled.service';

@Component({
    selector: 'app-factory-base-information',
    templateUrl: './factory-base-information.component.html',
    styleUrls: ['./factory-base-information.component.scss'],
})
export class FactoryBaseInformationComponent implements OnInit {
    // 定义一个必填项的双向绑定的对象
    originObject: any = {
        addresses: [
            {
                address: '',
            },
        ],
        contacts: '',
        position: '',
        phone: '',
        legaler: '',
        company_nature: '',
        product_type: '',
    };
    // 对应的键名
    obj: any = {
        contacts: '工厂联系人',
        position: '联系人职位',
        phone: '联系方式',
        legaler: '法人代表',
        company_nature: '企业性质',
        product_type: '生产产品类型',
    };
    // 普通项的数据绑定对象
    normal: any = {
        user_id: '',
        create_time: '',
        registered_capital: '',
        annual_sales: '',
        name: '',
        add_time: '',
    };
    notFilled: any[] = [];
    toolsObj: any = {};
    isDisabled: boolean;

    factoryDetails: any = {};
    flag: any;
    factory_id: any;
    inspectObj: string;
    factory_inspect_no: any;

    constructor(
        private route: Router,
        private es: PageEffectService,
        private activatedRoute: ActivatedRoute,
        private infoCtrl: EmitService,
        private inspecting: inspectingService,
        private isSave: IsSaveServiceService,
        private userInfo: UserInfoService,
        private isDis: IsDisabledService,
    ) {}
    obs$: any;
    ngOnInit() {
        this.obs$ = this.isSave.isSave$.subscribe(res => {
            console.log(res);
            if (res.index == '0') {
                this.inspectObj = res.currentObj.name;
                console.log(this.flag);

                if (this.flag == '2') {
                    const newOriginObj = _.cloneDeep(this.originObject);
                    const newNormalObj = _.cloneDeep(this.normal);
                    Object.assign(newOriginObj, newNormalObj);
                    newOriginObj.factory_id = (window.sessionStorage.getItem('FACTORY_ID') as any) - 0;
                    newOriginObj.user_id = res.currentObj.user_id - 0;
                    newOriginObj.name = res.currentObj.name;
                    newOriginObj.add_time = res.currentObj.add_time;
                    this.saveInformation(newOriginObj);
                } else {
                    console.log('保存事件再次被触发了');
                    // 此时不是编辑  不是编辑不传工厂id
                    const newOriginObj = _.cloneDeep(this.originObject);
                    const newNormalObj = _.cloneDeep(this.normal);
                    Object.assign(newOriginObj, newNormalObj);
                    window.sessionStorage.getItem('FACTORY_ID') == 'undefined'
                        ? 0
                        : (newOriginObj.factory_id = (window.sessionStorage.getItem('FACTORY_ID') as any) - 0);
                    newOriginObj.user_id = res.currentObj.user_id - 0;
                    newOriginObj.name = res.currentObj.name;
                    newOriginObj.add_time = res.currentObj.add_time;
                    this.saveInformation(newOriginObj);
                }
            }
        });
        // 数据的回显
        // const infoChange$: Observable<any> = this.userInfo.userInfo$;
        // infoChange$
        //     .pipe(
        //         combineLatest(this.isSave.isSave$),
        //         takeWhile(() => !this.destroy),
        //     )
        //     .subscribe(res => {
        //         console.log(res);
        //         if (res[1] == '0') {
        //             this.inspectObj = res[0].name;
        //             // console.log(this.inspectObj);
        //             // 此时是编辑的时候  编辑的时候需要传递的有工厂的id(只在这个页面是这个样子)
        //             if (this.flag == '2') {
        //                 const newOriginObj = _.cloneDeep(this.originObject);
        //                 const newNormalObj = _.cloneDeep(this.normal);
        //                 Object.assign(newOriginObj, newNormalObj);
        //                 newOriginObj.factory_id = (window.sessionStorage.getItem('FACTORY_ID') as any) - 0;
        //                 newOriginObj.user_id = res[0].user_id - 0;
        //                 newOriginObj.name = res[0].name;
        //                 newOriginObj.add_time = res[0].add_time;
        //                 this.saveInformation(newOriginObj);
        //             } else {
        //                 console.log('保存事件再次被触发了');
        //                 // 此时不是编辑  不是编辑不传工厂id
        //                 const newOriginObj = _.cloneDeep(this.originObject);
        //                 const newNormalObj = _.cloneDeep(this.normal);
        //                 Object.assign(newOriginObj, newNormalObj);
        //                 window.sessionStorage.getItem('FACTORY_ID') == 'undefined'
        //                     ? 0
        //                     : (newOriginObj.factory_id = (window.sessionStorage.getItem('FACTORY_ID') as any) - 0);
        //                 newOriginObj.user_id = res[0].user_id - 0;
        //                 newOriginObj.name = res[0].name;
        //                 newOriginObj.add_time = res[0].add_time;
        //                 this.saveInformation(newOriginObj);
        //             }
        //         }
        //     });
        window.localStorage.setItem('flag', '未保存');
        this.getInitQueryParams();

        if (this.flag == '0' && window.sessionStorage.getItem('FACTORY_ID') != 'undefined') {
            console.log('新增的时候回显数据');
            this.inspecting
                .getFactoryXQ({ factory_id: (window.sessionStorage.getItem('FACTORY_ID') as any) - 0 })
                .subscribe(res => {
                    // console.log(res);
                    this.originObject.addresses = res.data.address_list;
                    this.originObject.contacts = res.data.contacts;
                    this.originObject.position = res.data.position;
                    this.originObject.phone = res.data.phone;
                    this.originObject.legaler = res.data.legaler;
                    this.originObject.company_nature = res.data.company_nature;
                    this.originObject.product_type = res.data.product_type;
                    this.normal.create_time = res.data.create_time;
                    this.normal.registered_capital = res.data.registered_capital;
                    this.normal.annual_sales = res.data.annual_sales;
                    // 回填后更新tools
                    const newOriginObj = _.cloneDeep(this.originObject);
                    const newNormalObj = _.cloneDeep(this.normal);
                    Object.assign(newOriginObj, newNormalObj);
                    this.toolsObj = newOriginObj;
                    window.localStorage.setItem('flag', '已保存');
                });
        }
        this.infoCtrl.info$.pipe(takeWhile(() => !this.destroy)).subscribe(res => {
            this.inspectObj = res.name;
            // 此时是编辑的时候  编辑的时候需要传递的有工厂的id(只在这个页面是这个样子)
            if (this.flag == '2') {
                const newOriginObj = _.cloneDeep(this.originObject);
                const newNormalObj = _.cloneDeep(this.normal);
                Object.assign(newOriginObj, newNormalObj);
                newOriginObj.factory_id = (window.sessionStorage.getItem('FACTORY_ID') as any) - 0;
                // console.log(newOriginObj.factory_id);
                newOriginObj.user_id = res.user_id - 0;
                newOriginObj.name = res.name;
                newOriginObj.add_time = res.add_time;
                this.saveInformation(newOriginObj);
            } else {
                // 此时不是编辑  不是编辑不传工厂id
                const newOriginObj = _.cloneDeep(this.originObject);
                const newNormalObj = _.cloneDeep(this.normal);
                Object.assign(newOriginObj, newNormalObj);
                window.sessionStorage.getItem('FACTORY_ID') == 'undefined'
                    ? 0
                    : (newOriginObj.factory_id = (window.sessionStorage.getItem('FACTORY_ID') as any) - 0);
                newOriginObj.user_id = res.user_id - 0;
                newOriginObj.name = res.name;
                newOriginObj.add_time = res.add_time;
                this.saveInformation(newOriginObj);
            }
        });
    }
    getInitQueryParams() {
        this.activatedRoute.queryParams.subscribe(queryParam => {
            // console.log(queryParam); //flag等于0不做任何操作  等于1那么回填加禁用编辑  等于2那么回填可编辑
            const { details, flag, factory_id } = queryParam;
            this.factory_id = factory_id;

            this.flag = flag;
            if (details) {
                const DETAILS = JSON.parse(details);

                window.sessionStorage.setItem('FACTORY_ID', DETAILS.id);
                window.sessionStorage.setItem('inspect_no', DETAILS.factory_inspect_no);
                //拿到地址的数组进行赋值

                this.inspecting.getFactoryXQ({ factory_id: DETAILS.id }).subscribe(res => {
                    this.originObject.addresses = res.data.address_list;
                    this.originObject.contacts = res.data.contacts;
                    this.originObject.position = res.data.position;
                    this.originObject.phone = res.data.phone;
                    this.originObject.legaler = res.data.legaler;
                    this.originObject.company_nature = res.data.company_nature;
                    this.originObject.product_type = res.data.product_type;
                    this.normal.create_time = res.data.create_time;
                    this.normal.registered_capital = res.data.registered_capital;
                    this.normal.annual_sales = res.data.annual_sales;
                    if (queryParam.flag === '2') {
                        // 编辑刚进来设置为已经保存
                        window.localStorage.setItem('flag', '已保存');
                        const newOriginObj = _.cloneDeep(this.originObject);
                        const newNormalObj = _.cloneDeep(this.normal);
                        Object.assign(newOriginObj, newNormalObj);
                        this.toolsObj = newOriginObj;
                    }
                });
            }
            if (queryParam.flag === '0') {
                this.isDisabled = false;
            } else if (queryParam.flag === '1') {
                this.isDisabled = true;
            } else {
                this.isDisabled = false;
            }
        });
    }

    // 点击保存的时候判断必填项是否有值
    saveInformation(params) {
        this.notFilled = [];
        let str1 = '';
        if (this.inspectObj == undefined) {
            str1 += `考察对象 `;
        }
        for (let key in this.originObject) {
            // 遍历的时候如果是数组
            if (this.originObject[key] instanceof Array) {
                this.originObject[key].forEach((item, index) => {
                    if (item.address == '') {
                        str1 += `工厂地址(${index + 1})`;
                    }
                });
            } else {
                if (!this.originObject[key]) {
                    this.notFilled.push(key);
                }
            }
        }

        if (this.notFilled.length || str1 != '') {
            let str = str1;
            this.notFilled.forEach(item => {
                str += this.obj[item] + ' ';
            });

            this.es.showToast({
                message: str + '是必填项',
                duration: 1500,
                color: 'danger',
            });
        } else {
            const newOriginObj = _.cloneDeep(this.originObject);
            const newNormalObj = _.cloneDeep(this.normal);
            Object.assign(newOriginObj, newNormalObj);
            this.toolsObj = newOriginObj;
            this.inspecting.saveFactoryBaseInformation(params).subscribe(res => {
                // 如果存在id那么说明是新增  把新增的工厂id存起来
                if (res.data && res.data.factory_id) {
                    window.sessionStorage.setItem('FACTORY_ID', res.data.factory_id);
                    window.sessionStorage.setItem('inspect_no', res.data.factory_inspect_no);
                }
                console.log(res);
                if (res.status != 1) {
                    return this.es.showToast({
                        message: '保存失败',
                        color: 'danger',
                        duration: 1500,
                    });
                }
                this.es.showToast({
                    message: '保存成功',
                    color: 'success',
                    duration: 1500,
                });
                window.localStorage.setItem('flag', '已保存');
            });
        }
    }

    onBlur(e) {
        if (isNaN(e.target.value)) {
        } else {
            if ((e.target.value as any) - 0 < 0 && (e.target.value as any) != '') {
                this.es.showToast({
                    message: '请输入大于等于0的数',
                    color: 'danger',
                    duration: 1500,
                });
                e.target.value = '';
            }
        }
    }
    destroy: boolean = false;
    ngOnDestroy(): void {
        window.localStorage.setItem('flag', '未保存');
        this.destroy = true;
        this.obs$.unsubscribe();
        // this.isSave.isSave$.unsubscribe();
    }

    confirm() {
        const newOriginObj = _.cloneDeep(this.originObject);
        const newNormalObj = _.cloneDeep(this.normal);
        Object.assign(newOriginObj, newNormalObj);
        if (this.isDisabled) {
            return true;
        } else {
            let flag = true;
            // 没有保存但是存在东西
            if (window.localStorage.getItem('flag') != '已保存') {
                for (let key in newOriginObj) {
                    if (typeof newOriginObj[key] == 'object') {
                        if (newOriginObj[key] != null) {
                            newOriginObj[key].forEach(item => {
                                for (let key in item) {
                                    if (item[key] != '') {
                                        flag = false;
                                    }
                                }
                            });
                        }
                    } else {
                        if (newOriginObj[key] != '') {
                            flag = false;
                        }
                    }
                }
            } else if (window.localStorage.getItem('flag') == '已保存') {
                if (newOriginObj.addresses && newOriginObj.addresses.length != this.toolsObj.addresses.length) {
                    flag = false;
                } else {
                    for (let key1 in newOriginObj) {
                        // 如果是数组
                        if (typeof newOriginObj[key1] == 'object' && newOriginObj[key1] != null) {
                            newOriginObj[key1].forEach((item, index) => {
                                for (let key in item) {
                                    if (typeof item[key] != 'object') {
                                        if (item[key] != this.toolsObj[key1][index][key]) {
                                            flag = false;
                                        }
                                    }
                                }
                            });
                        } else {
                            if (newOriginObj[key1] != this.toolsObj[key1]) {
                                flag = false;
                            }
                        }
                    }
                }
            } else {
                flag = true;
            }
            if (flag) {
                // 同意跳转
                return true;
            } else {
                // 不同意跳转
                return false;
            }
        }
    }
    addAddressClicked() {
        this.originObject.addresses.push({
            address: '',
        });
    }
    deleAddressClicked(index) {
        this.originObject.addresses.splice(index, 1);
    }
}
