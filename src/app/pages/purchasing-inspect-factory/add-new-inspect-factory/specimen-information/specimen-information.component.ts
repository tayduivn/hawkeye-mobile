import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import _ from 'loadsh';
import { Observable } from 'rxjs';
import { combineLatest, takeWhile } from 'rxjs/operators';
import { inspectingService } from 'src/app/services/inspecting.service';
import { PageEffectService } from 'src/app/services/page-effect.service';
import { UserInfoService } from '../user-info.service';
import { environment } from 'src/environments/environment';
import { EmitService } from '../emit.service';
import { IsSaveServiceService } from '../../is-save-service.service';
import { IsDisabledService } from '../factory-base-information/is-disabled.service';

@Component({
    selector: 'app-specimen-information',
    templateUrl: './specimen-information.component.html',
    styleUrls: ['./specimen-information.component.scss'],
})
export class SpecimenInformationComponent implements OnInit {
    constructor(
        private activatedRoute: ActivatedRoute,
        private es: PageEffectService,
        private infoCtrl: EmitService,
        private inspecting: inspectingService,
        private userInfo: UserInfoService,
        private isSave: IsSaveServiceService,
        private isDisable: IsDisabledService,
    ) {}
    imgOrigin = environment.usFileUrl;
    isDisabled: boolean;
    // 定义一个必填项的双向绑定的对象
    originObject: any = {};
    toolsObj: any = {};
    normal: any = {
        // factory_id: '', //工厂id
        amount: '', //样品费情况
        readiness_time: '', //准备时间
        payment: '', //付款情况
        have_sample: '', //是否谈到样品
        will_supply: '', //是否愿意提供样品
    };
    destroy = false;
    DETAILS: any = {};
    sample_pic: any[] = [];
    showroom_video: any[] = [];
    flag: any;
    jinyong: boolean;
    factory_id: any;
    inspect_no: any;
    obs$: any;
    ngOnInit() {
        this.obs$ = this.isSave.isSave$.subscribe(res => {
            if (res.index == '3') {
                // 此时是编辑的时候  编辑的时候需要传递的有工厂的id(只在这个页面是这个样子)
                //这里可以拿到头部的信息  那么拿到后在这里面调用保存的方法
                if (this.flag == '2') {
                    // 如果是编辑的话传递的工厂id应该就是点击编辑传递进来的详情的id
                    const newOriginObj = _.cloneDeep(this.originObject);
                    const newNormalObj = _.cloneDeep(this.normal);
                    Object.assign(newOriginObj, newNormalObj);
                    newOriginObj.factory_id = this.DETAILS.id;
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
                        this.initData();
                        return this.es.showToast({
                            message: '请先添加工厂基本信息',
                            color: 'danger',
                            duration: 1500,
                        });
                    }
                }
            }
        });

        // const infoChange$: Observable<any> = this.userInfo.userInfo$;
        // // pipe(takeWhile(() => !this.destroy))
        // infoChange$
        //     .pipe(
        //         combineLatest(this.isSave.isSave$),
        //         takeWhile(() => !this.destroy),
        //     )
        //     .subscribe(res => {
        //         // debugger;
        //         // console.log(res);
        //     });

        this.getInitQueryParams();

        // 回填数据
        if (this.flag == '0' && window.sessionStorage.getItem('FACTORY_ID') != 'undefined') {
            // console.log('新增的时候回显数据');
            this.inspecting
                .getFactoryXQ({ factory_id: (window.sessionStorage.getItem('FACTORY_ID') as any) - 0 })
                .subscribe(res => {
                    if (res.data.rework_sample_pic && res.data.rework_sample_pic.length != 0) {
                        res.data.rework_sample_pic.forEach(item => {
                            this.sample_pic.push(item);
                        });
                    } else {
                        this.sample_pic = [];
                    }
                    if (res.data.inspect_showroom_video && res.data.inspect_showroom_video.length != 0) {
                        res.data.inspect_showroom_video.forEach(item => {
                            this.showroom_video.push(item);
                        });
                    } else {
                        this.showroom_video = [];
                    }

                    this.normal.have_sample = res.data.sample.have_sample - 0;
                    this.normal.will_supply = res.data.sample.will_supply - 0;
                    this.normal.amount = res.data.sample.amount;
                    this.normal.readiness_time = res.data.sample.readiness_time;
                    this.normal.payment = res.data.sample.payment;

                    // 编辑刚进来设置为已经保存
                    window.localStorage.setItem('flag', '已保存');
                    const newOriginObj = _.cloneDeep(this.originObject);
                    const newNormalObj = _.cloneDeep(this.normal);
                    Object.assign(newOriginObj, newNormalObj);
                    this.toolsObj = newOriginObj;
                    // console.log(this.toolsObj);
                });
        }

        this.infoCtrl.info$.pipe(takeWhile(() => !this.destroy)).subscribe(res => {
            //这里可以拿到头部的信息  那么拿到后在这里面调用保存的方法
            if (this.flag == '2') {
                // 如果是编辑的话传递的工厂id应该就是点击编辑传递进来的详情的id
                const newOriginObj = _.cloneDeep(this.originObject);
                const newNormalObj = _.cloneDeep(this.normal);
                Object.assign(newOriginObj, newNormalObj);
                newOriginObj.factory_id = this.DETAILS.id;
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
                    this.initData();
                    return this.es.showToast({
                        message: '请先添加工厂基本信息',
                        color: 'danger',
                        duration: 1500,
                    });
                }
            }
        });
    }
    initData() {
        this.originObject = {};
        this.normal = {
            // factory_id: '', //工厂id
            amount: '', //样品费情况
            readiness_time: '', //准备时间
            payment: '', //付款情况
            have_sample: '', //是否谈到样品
            will_supply: '', //是否愿意提供样品
        };
        this.toolsObj = {};
    }
    getInitQueryParams() {
        this.activatedRoute.queryParams.subscribe(queryParam => {
            // console.log(queryParam); //flag等于0不做任何操作  等于1那么回填加禁用编辑  等于2那么回填可编辑
            const { details } = queryParam;
            this.flag = queryParam.flag;
            if (details) {
                // 把传递进来的详情数据存一份
                this.DETAILS = JSON.parse(details);
                const DETAILS = JSON.parse(details);
                // this.DETAILS.rework_sample_pic.forEach(item => {});
                // console.log(this.DETAILS);
                this.inspecting.getFactoryXQ({ factory_id: this.DETAILS.id }).subscribe(res => {
                    if (res.data.rework_sample_pic && res.data.rework_sample_pic.length != 0) {
                        res.data.rework_sample_pic.forEach(item => {
                            this.sample_pic.push(item);
                        });
                    } else {
                        this.sample_pic = [];
                    }
                    if (res.data.inspect_showroom_video && res.data.inspect_showroom_video.length != 0) {
                        res.data.inspect_showroom_video.forEach(item => {
                            this.showroom_video.push(item);
                        });
                    } else {
                        this.showroom_video = [];
                    }

                    this.normal.have_sample = res.data.sample.have_sample - 0;
                    this.normal.will_supply = res.data.sample.will_supply - 0;
                    this.normal.amount = res.data.sample.amount;
                    this.normal.readiness_time = res.data.sample.readiness_time;
                    this.normal.payment = res.data.sample.payment;
                    if (queryParam.flag === '2') {
                        // 编辑刚进来设置为已经保存
                        window.localStorage.setItem('flag', '已保存');
                        const newOriginObj = _.cloneDeep(this.originObject);
                        const newNormalObj = _.cloneDeep(this.normal);
                        Object.assign(newOriginObj, newNormalObj);
                        this.toolsObj = newOriginObj;
                        // console.log(this.toolsObj);
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
    saveInformation(params) {
        // console.log(params.have_sample);
        if (params.have_sample == '0' || params.will_supply == '0') {
            params.amount = null;
            params.payment = null;
            params.readiness_time = null;
        }
        const newOriginObj = _.cloneDeep(this.originObject);
        const newNormalObj = _.cloneDeep(this.normal);
        Object.assign(newOriginObj, newNormalObj);
        this.toolsObj = newOriginObj;
        // 存储保存的flag
        // 保存的时候发送请求
        // 先合并传递的参数
        this.inspecting.saveSpecimenInformation(params).subscribe(res => {
            if (res.status !== 1)
                return this.es.showToast({
                    message: '保存失败',
                    duration: 1500,
                    color: 'danger',
                });
            this.es.showToast({
                message: '保存成功',
                duration: 1500,
                color: 'success',
            });
            window.localStorage.setItem('flag', '已保存');
        });
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
        // console.log(newNormalObj);
        // console.log(this.toolsObj);

        if (this.isDisabled) {
            return true;
        } else {
            let flag = true;
            if (window.localStorage.getItem('flag') !== '已保存') {
                for (let key in newOriginObj) {
                    if (newOriginObj[key] != '' && newOriginObj[key] != null) {
                        flag = false;
                    }
                }
            } else if (window.localStorage.getItem('flag') === '已保存') {
                newOriginObj.have_sample = newOriginObj.have_sample - 0;
                newOriginObj.will_supply = newOriginObj.will_supply - 0;
                this.toolsObj.have_sample = this.toolsObj.have_sample - 0;
                this.toolsObj.will_supply = this.toolsObj.will_supply - 0;
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

    selectChange1() {
        if (this.normal.have_sample == '' || this.normal.have_sample == '0' || this.normal.have_sample == null) {
            this.normal.amount = null;
            this.normal.readiness_time = null;
            this.normal.payment = null;
            this.normal.will_supply = null;
        }
        // console.log(this.normal);
        // console.log(this.toolsObj);
    }
    selectChange2() {
        if (this.normal.will_supply == '' || this.normal.will_supply == '0' || this.normal.will_supply == null) {
            this.normal.amount = null;
            this.normal.readiness_time = null;
            this.normal.payment = null;
        }
        // console.log(this.normal);
    }
}
