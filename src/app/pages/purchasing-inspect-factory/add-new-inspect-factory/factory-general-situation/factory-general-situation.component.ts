import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PageEffectService } from 'src/app/services/page-effect.service';
import _ from 'loadsh';
import { inspectingService } from 'src/app/services/inspecting.service';
import { EmitService } from '../emit.service';
import { combineLatest, takeWhile } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { UserInfoService } from '../user-info.service';
import { IsSaveServiceService } from '../../is-save-service.service';
import { IsDisabledService } from '../factory-base-information/is-disabled.service';
@Component({
    selector: 'app-factory-general-situation',
    templateUrl: './factory-general-situation.component.html',
    styleUrls: ['./factory-general-situation.component.scss'],
})
export class FactoryGeneralSituationComponent implements OnInit {
    constructor(
        private activatedRoute: ActivatedRoute,
        private es: PageEffectService,
        private inspecting: inspectingService,
        private infoCtrl: EmitService,
        private userInfo: UserInfoService,
        private isSave: IsSaveServiceService,
        private isDisable: IsDisabledService,
    ) {}
    imgOrigin = environment.usFileUrl;
    isDisabled: boolean;
    flagIsDisabled: boolean;
    // 定义一个必填项的双向绑定的对象
    originObject: any = {
        acreage: '',
        people_num: '',
        manning: '',
        department: '',
        production_equipment: '',
        production_capacity: '',
        production_cycle: '',
        sales_market: '',
        pay_type: '',
        third_party: '',
    };
    // 对应的键名
    obj: any = {
        acreage: '工厂面积',
        people_num: '工厂人数',
        manning: '人员组成',
        department: '部门组成',
        production_equipment: '生产设备',
        production_capacity: '生产能力',
        production_cycle: '生产周期',
        sales_market: '主要销售市场',
        pay_type: '工厂付款方式',
        third_party: '是否接受过第三方验厂',
        pic: '工厂外观照片或工厂车间照片',
    };
    toolsObj: any = {};
    // 普通项的数据绑定对象
    normal: any = {
        quality: '',
        customer: '',
        authentication: '',
        third_name: '',
    };
    destroy: boolean = false;
    notFilled: any[] = [];
    DETAILS: any = {};
    flag: any;
    plantPic: any[] = [];
    business_license_pic: any[] = [];
    facadePic: any[] = [];
    // 工厂外观视频
    facade_video: any[] = [];
    // 生产车间视频
    plant_video: any[] = [];
    jinyong: boolean;
    factory_id: any;
    inspect_no: any;
    obs$: any;
    ngOnInit() {
        // if (window.sessionStorage.getItem('FACTORY_ID') != 'undefined') {
        //     this.jinyong = false;
        // } else {
        //     this.jinyong = true;
        // }
        // this.isDisable.isDisabled$.pipe(takeWhile(() => !this.destroy)).subscribe(res => {
        //     if (res != 'undefined') {
        //         // 不等于undefined的时候说明有  有的话就不禁用
        //         this.jinyong = false;
        //         this.factory_id = res.factory_id;
        //         this.inspect_no = res.inspect_no;
        //     } else {
        //         this.jinyong = true;
        //     }
        // });
        this.obs$ = this.isSave.isSave$.subscribe(res => {
            if (res.index == '1') {
                if (this.flag == '2') {
                    // 如果是编辑的话传递的工厂id应该就是点击编辑传递进来的详情的id
                    const newOriginObj = _.cloneDeep(this.originObject);
                    const newNormalObj = _.cloneDeep(this.normal);
                    Object.assign(newOriginObj, newNormalObj);
                    newOriginObj.factory_id = this.DETAILS.id;
                    this.saveInformation(newOriginObj);
                } else {
                    const newOriginObj = _.cloneDeep(this.originObject);
                    const newNormalObj = _.cloneDeep(this.normal);
                    Object.assign(newOriginObj, newNormalObj);
                    // 如果不是编辑的话传递的id就应该是第一个新增页面保存的id
                    let id;
                    if (window.sessionStorage.getItem('FACTORY_ID') != 'undefined') {
                        id = (window.sessionStorage.getItem('FACTORY_ID') as any) - 0;
                        newOriginObj.factory_id = id;
                        this.saveInformation(newOriginObj);
                    } else {
                        this.originObject = {
                            acreage: '',
                            people_num: '',
                            manning: '',
                            department: '',
                            production_equipment: '',
                            production_capacity: '',
                            production_cycle: '',
                            sales_market: '',
                            pay_type: '',
                            third_party: '',
                        };
                        this.normal = {
                            quality: '',
                            customer: '',
                            authentication: '',
                            third_name: '',
                        };
                        this.toolsObj = {};
                        return this.es.showToast({
                            message: '请先添加工厂基本信息',
                            color: 'danger',
                            duration: 1500,
                        });
                    }
                }
            }
        });

        this.getInitQueryParams();

        // 回填数据
        if (this.flag == '0' && window.sessionStorage.getItem('FACTORY_ID') != 'undefined') {
            // console.log('新增的时候回显数据');
            this.inspecting
                .getFactoryXQ({ factory_id: (window.sessionStorage.getItem('FACTORY_ID') as any) - 0 })
                .subscribe(res => {
                    // console.log(res);

                    this.plantPic = [];
                    this.business_license_pic = [];
                    this.facadePic = [];
                    this.facade_video = [];
                    this.plant_video = [];
                    if (res.data.rework_plant_pic && res.data.rework_plant_pic.length != 0) {
                        window.sessionStorage.setItem('plant_picFlag', '1');
                        res.data.rework_plant_pic.forEach(item => {
                            this.plantPic.push(item);
                        });
                    } else {
                        this.plantPic = [];
                    }

                    if (res.data.rework_business_license_pic && res.data.rework_business_license_pic.length != 0) {
                        res.data.rework_business_license_pic.forEach(item => {
                            this.business_license_pic.push(item);
                        });
                    } else {
                        this.business_license_pic = [];
                    }

                    if (res.data.rework_facade_pic && res.data.rework_facade_pic.length != 0) {
                        window.sessionStorage.setItem('facade_picFalg', '1');
                        res.data.rework_facade_pic.forEach(item => {
                            this.facadePic.push(item);
                        });
                    } else {
                        this.facadePic = [];
                    }
                    // console.log(res.data);
                    // 工厂外观视频
                    // console.log(res.data.inspect_facade_video);

                    if (res.data.inspect_facade_video && res.data.inspect_facade_video.length != 0) {
                        window.sessionStorage.setItem('facade_picFalg', '1');
                        res.data.inspect_facade_video.forEach(item => {
                            this.facade_video.push(item);
                            // console.log(item);
                        });
                    } else {
                        this.facade_video = [];
                    }
                    // 生产车间视频
                    // inspect_plant_video
                    if (res.data.inspect_plant_video && res.data.inspect_plant_video.length != 0) {
                        window.sessionStorage.setItem('plant_picFlag', '1');

                        res.data.inspect_plant_video.forEach(item => {
                            this.plant_video.push(item);
                        });
                    } else {
                        this.plant_video = [];
                    }

                    // const DETAILS = JSON.parse(details);

                    this.originObject.acreage = res.data.acreage;
                    this.originObject.people_num = res.data.people_num;
                    this.originObject.manning = res.data.manning;
                    this.originObject.department = res.data.department;
                    this.originObject.production_equipment = res.data.production_equipment;
                    this.originObject.production_capacity = res.data.production_capacity - 0;
                    this.originObject.production_cycle = res.data.production_cycle;
                    this.originObject.sales_market = res.data.sales_market;
                    this.originObject.pay_type = res.data.pay_type;
                    this.originObject.third_party = res.data.third_party - 0;
                    this.normal.quality = res.data.quality - 0;
                    this.normal.customer = res.data.customer;
                    this.normal.authentication = res.data.authentication;
                    this.normal.third_name = res.data.third_name;

                    window.localStorage.setItem('flag', '已保存');
                    const newOriginObj = _.cloneDeep(this.originObject);
                    const newNormalObj = _.cloneDeep(this.normal);
                    Object.assign(newOriginObj, newNormalObj);
                    this.toolsObj = newOriginObj;
                });
        }

        this.infoCtrl.info$.pipe(takeWhile(() => !this.destroy)).subscribe(res => {
            // console.log(res); //这里可以拿到头部的信息  那么拿到后在这里面调用保存的方法
            if (this.flag == '2') {
                // 如果是编辑的话传递的工厂id应该就是点击编辑传递进来的详情的id
                const newOriginObj = _.cloneDeep(this.originObject);
                const newNormalObj = _.cloneDeep(this.normal);
                Object.assign(newOriginObj, newNormalObj);
                newOriginObj.factory_id = this.DETAILS.id;
                // console.log(this.DETAILS.id);
                this.saveInformation(newOriginObj);
                // console.log(newOriginObj);
            } else {
                const newOriginObj = _.cloneDeep(this.originObject);
                const newNormalObj = _.cloneDeep(this.normal);
                Object.assign(newOriginObj, newNormalObj);
                // 如果不是编辑的话传递的id就应该是第一个新增页面保存的id
                let id;
                if (window.sessionStorage.getItem('FACTORY_ID') != 'undefined') {
                    id = (window.sessionStorage.getItem('FACTORY_ID') as any) - 0;
                    newOriginObj.factory_id = id;
                    this.saveInformation(newOriginObj);
                    // console.log(newOriginObj);
                } else {
                    this.originObject = {
                        acreage: '',
                        people_num: '',
                        manning: '',
                        department: '',
                        production_equipment: '',
                        production_capacity: '',
                        production_cycle: '',
                        sales_market: '',
                        pay_type: '',
                        third_party: '',
                    };
                    this.normal = {
                        quality: '',
                        customer: '',
                        authentication: '',
                        third_name: '',
                    };
                    this.toolsObj = {};
                    return this.es.showToast({
                        message: '请先添加工厂基本信息',
                        color: 'danger',
                        duration: 1500,
                    });
                }
            }
        });
    }
    getInitQueryParams() {
        this.activatedRoute.queryParams.subscribe(queryParam => {
            // console.log(queryParam); //flag等于0不做任何操作  等于1那么回填加禁用编辑  等于2那么回填可编辑
            const { details } = queryParam;
            // console.log(queryParam);
            this.flag = queryParam.flag;
            // console.log(details);
            if (details) {
                // 把传递进来的详情数据存一份
                this.DETAILS = JSON.parse(details);
                // console.log(this.DETAILS);
                this.inspecting.getFactoryXQ({ factory_id: this.DETAILS.id }).subscribe(res => {
                    this.plantPic = [];
                    this.business_license_pic = [];
                    this.facadePic = [];
                    this.facade_video = [];
                    this.plant_video = [];
                    if (res.data.rework_plant_pic && res.data.rework_plant_pic.length != 0) {
                        window.sessionStorage.setItem('plant_picFlag', '1');
                        res.data.rework_plant_pic.forEach(item => {
                            this.plantPic.push(item);
                        });
                    } else {
                        this.plantPic = [];
                    }

                    if (res.data.rework_business_license_pic && res.data.rework_business_license_pic.length != 0) {
                        res.data.rework_business_license_pic.forEach(item => {
                            this.business_license_pic.push(item);
                        });
                    } else {
                        this.business_license_pic = [];
                    }

                    if (res.data.rework_facade_pic && res.data.rework_facade_pic.length != 0) {
                        window.sessionStorage.setItem('facade_picFalg', '1');
                        res.data.rework_facade_pic.forEach(item => {
                            this.facadePic.push(item);
                        });
                    } else {
                        this.facadePic = [];
                    }
                    // console.log(res.data);
                    // 工厂外观视频
                    // console.log(res.data.inspect_facade_video);

                    if (res.data.inspect_facade_video && res.data.inspect_facade_video.length != 0) {
                        window.sessionStorage.setItem('facade_picFalg', '1');
                        res.data.inspect_facade_video.forEach(item => {
                            this.facade_video.push(item);
                            // console.log(item);
                        });
                    } else {
                        this.facade_video = [];
                    }
                    // 生产车间视频
                    // inspect_plant_video
                    if (res.data.inspect_plant_video && res.data.inspect_plant_video.length != 0) {
                        window.sessionStorage.setItem('plant_picFlag', '1');

                        res.data.inspect_plant_video.forEach(item => {
                            this.plant_video.push(item);
                        });
                    } else {
                        this.plant_video = [];
                    }

                    this.originObject.acreage = res.data.acreage;
                    this.originObject.people_num = res.data.people_num;
                    this.originObject.manning = res.data.manning;
                    this.originObject.department = res.data.department;
                    this.originObject.production_equipment = res.data.production_equipment;
                    this.originObject.production_capacity = res.data.production_capacity - 0;
                    this.originObject.production_cycle = res.data.production_cycle;
                    this.originObject.sales_market = res.data.sales_market;
                    this.originObject.pay_type = res.data.pay_type;
                    this.originObject.third_party = res.data.third_party - 0;
                    this.normal.quality = res.data.quality - 0;
                    this.normal.customer = res.data.customer;
                    this.normal.authentication = res.data.authentication;
                    this.normal.third_name = res.data.third_name;
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
                const newOriginObj = _.cloneDeep(this.originObject);
                const newNormalObj = _.cloneDeep(this.normal);
                Object.assign(newOriginObj, newNormalObj);
                this.toolsObj = newOriginObj;
                this.isDisabled = false;
            } else if (queryParam.flag === '1') {
                this.isDisabled = true;
            } else {
                this.isDisabled = false;
            }
        });
    }
    // 点击保存
    saveInformation(params) {
        this.notFilled = [];

        for (let key in this.originObject) {
            if (!this.originObject[key]) {
                this.notFilled.push(key);
            }
        }
        // console.log(this.originObject.third_party);
        // console.log(this.notFilled);
        if (this.originObject.third_party === 0 && this.notFilled.indexOf('third_party') != -1) {
            let index = this.notFilled.indexOf('third_party');
            this.notFilled.splice(index, 1);
        }
        if (
            window.sessionStorage.getItem('facade_picFalg') != '1' ||
            window.sessionStorage.getItem('plant_picFlag') != '1'
        ) {
            this.notFilled.push('pic');
        }
        if (this.notFilled.length) {
            // 不为0说明有必填项没有填
            // 先拼接字符串
            let str = '';
            this.notFilled.forEach(item => {
                str += this.obj[item] + ' ';
            });
            // console.log(str + '是必填项');
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
            // 存储保存的flag
            // 保存的时候发送请求
            // 先合并传递的参数

            this.inspecting.saveGeneralInformation(params).subscribe(res => {
                if (res.status != 1) {
                    return this.es.showToast({
                        message: '保存失败',
                        color: 'danger',
                        duration: 1500,
                    });
                }
                this.es.showToast({
                    message: '保存成功',
                    duration: 1500,
                    color: 'success',
                });
                window.localStorage.setItem('flag', '已保存');
            });
        }
    }
    // 输入域失去焦点的时候触发
    onBlur(e) {
        // console.log((e.target.value as any) - 0);
        if ((e.target.value as any) - 0 <= 0 && (e.target.value as any) != '') {
            this.es.showToast({
                message: '请输入大于0的数',
                color: 'danger',
                duration: 1500,
            });
            e.target.value = '';
        }
    }
    // 人数输入框失焦
    onBlur1(e) {
        if (
            ((e.target.value as any) - 0 <= 0 ||
                Math.round((e.target as any).value - 0) !== (e.target as any).value - 0) &&
            (e.target.value as any) != ''
        ) {
            this.es.showToast({
                message: '请输入大于0的整数',
                color: 'danger',
                duration: 1500,
            });
            e.target.value = '';
        }
    }
    ngOnDestroy(): void {
        window.localStorage.setItem('flag', '未保存');
        this.destroy = true;
        this.obs$.unsubscribe();
    }
    confirm() {
        const newOriginObj = _.cloneDeep(this.originObject);
        const newNormalObj = _.cloneDeep(this.normal);
        Object.assign(newOriginObj, newNormalObj);
        // console.log(this.toolsObj);
        // console.log(newOriginObj);
        if (this.isDisabled) {
            return true;
        } else {
            let flag = true;
            if (window.localStorage.getItem('flag') != '已保存') {
                for (let key in newOriginObj) {
                    if (newOriginObj[key] !== '') {
                        flag = false;
                    }
                }
            } else if (window.localStorage.getItem('flag') == '已保存') {
                for (let key in newOriginObj) {
                    if (newOriginObj[key] != this.toolsObj[key]) {
                        flag = false;
                    }
                }
            } else {
                flag = true;
            }
            if (flag) {
                return true;
            } else {
                return false;
            }
        }
    }
    selectChanged() {
        this.normal.third_name = null;
    }
}
