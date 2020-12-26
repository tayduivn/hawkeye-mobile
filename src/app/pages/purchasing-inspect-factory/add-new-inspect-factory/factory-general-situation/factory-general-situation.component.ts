import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PageEffectService } from 'src/app/services/page-effect.service';
import _ from 'loadsh';
import { inspectingService } from 'src/app/services/inspecting.service';
import { EmitService } from '../emit.service';
import { takeWhile } from 'rxjs/operators';
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
    ) {}
    isDisabled: boolean;
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
    ngOnInit() {
        this.getInitQueryParams();
        this.infoCtrl.info$.pipe(takeWhile(() => !this.destroy)).subscribe(res => {
            console.log(res); //这里可以拿到头部的信息  那么拿到后在这里面调用保存的方法
            this.saveInformation();
        });
    }
    getInitQueryParams() {
        this.activatedRoute.queryParams.subscribe(queryParam => {
            console.log(queryParam); //flag等于0不做任何操作  等于1那么回填加禁用编辑  等于2那么回填可编辑
            if (queryParam.flag === '0') {
                this.isDisabled = false;
            } else if (queryParam.flag === '1') {
                this.isDisabled = true;
            } else {
                this.isDisabled = false;
            }
        });
    }

    // 点击保存
    saveInformation() {
        this.notFilled = [];
        let flag = true;
        for (let key in this.originObject) {
            if (!this.originObject[key]) {
                flag = false;
                this.notFilled.push(key);
            }
        }
        if (this.notFilled.length) {
            // 不为0说明有必填项没有填
            // 先拼接字符串
            let str = '';
            this.notFilled.forEach(item => {
                str += this.obj[item] + ' ';
            });
            console.log(str + '是必填项');
            this.es.showToast({
                message: str + '是必填项',
                duration: 1500,
                color: 'danger',
            });
        } else {
            this.es.showToast({
                message: '保存成功',
                duration: 1500,
                color: 'success',
            });
            const newOriginObj = _.cloneDeep(this.originObject);
            const newNormalObj = _.cloneDeep(this.normal);
            Object.assign(newOriginObj, newNormalObj);
            this.toolsObj = newOriginObj;
            // 存储保存的flag
            // 保存的时候发送请求
            // 先合并传递的参数

            // this.inspecting.saveGeneralInfomation(QUERY).subscribe(res => {
            //     console.log(res);
            // });
            window.localStorage.setItem('flag', '已保存');
        }
    }

    ngOnDestroy(): void {
        window.localStorage.setItem('flag', '未保存');
        this.destroy = true;
    }

    confirm() {
        const newOriginObj = _.cloneDeep(this.originObject);
        const newNormalObj = _.cloneDeep(this.normal);
        Object.assign(newOriginObj, newNormalObj);
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
                    if (newOriginObj[key] !== this.toolsObj[key]) {
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
