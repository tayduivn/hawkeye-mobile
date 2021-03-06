import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import _ from 'loadsh';
import { takeWhile } from 'rxjs/operators';
import { inspectingService } from 'src/app/services/inspecting.service';
import { PageEffectService } from 'src/app/services/page-effect.service';
import { EmitService } from '../emit.service';
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
    ) {}
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
    flag: any;
    ngOnInit() {
        this.getInitQueryParams();
        this.infoCtrl.info$.pipe(takeWhile(() => !this.destroy)).subscribe(res => {
            // console.log(res); //这里可以拿到头部的信息  那么拿到后在这里面调用保存的方法
            // this.saveInformation();
            if (this.flag == '2') {
                // 如果是编辑的话传递的工厂id应该就是点击编辑传递进来的详情的id
                const newOriginObj = _.cloneDeep(this.originObject);
                const newNormalObj = _.cloneDeep(this.normal);
                Object.assign(newOriginObj, newNormalObj);
                newOriginObj.factory_id = this.DETAILS.id;
                // console.log(this.DETAILS.id);
                this.saveInformation(newOriginObj);
                console.log(newOriginObj);
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
                    console.log(newOriginObj);
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
                this.normal.have_sample = DETAILS.have_sample - 0;
                this.normal.will_supply = DETAILS.will_supply - 0;
                this.normal.amount = DETAILS.sample.amount;
                this.normal.readiness_time = DETAILS.sample.readiness_time;
                this.normal.payment = DETAILS.sample.payment;
                // console.log(this.normal);
                if (queryParam.flag === '2') {
                    // 编辑刚进来设置为已经保存
                    window.localStorage.setItem('flag', '已保存');
                    const newOriginObj = _.cloneDeep(this.originObject);
                    const newNormalObj = _.cloneDeep(this.normal);
                    Object.assign(newOriginObj, newNormalObj);
                    this.toolsObj = newOriginObj;
                }
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
    saveInformation(params) {
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
    }

    confirm() {
        const newOriginObj = _.cloneDeep(this.originObject);
        const newNormalObj = _.cloneDeep(this.normal);
        Object.assign(newOriginObj, newNormalObj);
        // console.log(newOriginObj);
        // console.log(this.toolsObj);

        if (this.isDisabled) {
            return true;
        } else {
            let flag = true;
            if (window.localStorage.getItem('flag') !== '已保存') {
                for (let key in newOriginObj) {
                    if (newOriginObj[key] !== '') {
                        flag = false;
                    }
                }
            } else if (window.localStorage.getItem('flag') === '已保存') {
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
}
