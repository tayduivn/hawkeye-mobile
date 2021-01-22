import { Component, OnInit } from '@angular/core';
import _ from 'loadsh';
import { PageEffectService } from 'src/app/services/page-effect.service';
import { DisabledService } from '../disabled.service';
import { SaveService } from '../save.service';
@Component({
    selector: 'app-self-drive',
    templateUrl: './self-drive.component.html',
    styleUrls: ['./self-drive.component.scss'],
})
export class SelfDriveComponent implements OnInit {
    // 定义数据源
    currentBigObject: any = {
        fuel_charge_list: [
            {
                departure_place: '', //'出发地点
                arrival_place: '', //'到达地点
                departure_time: '', //出发时间
                arrival_time: '', //到达时间
                theory_miles: '', //理论公里数
                actual_miles: '', //实际公里数
                cost: '', //金额
            },
        ], //油费数组
        road_toll_bill_num: '', //过路费单据张数
        road_toll_cost: '', //过路费金额
        parking_bill_num: '', //停车费单据张数
        parking_cost: '', //停车费金额
        stay_bill_num: '', //住宿费单据
        stay_invoice_title: '', //住宿费发票抬头
        stay_cost: '', //住宿费金额
        travel_day_num: '', //出差天数
        travel_subsidy_cost: '', //出差金额
    };
    isSaveFlag: boolean = false;
    obs$: any;

    // 基本信息的对象
    baseInformation: any = {
        travel_type: '差旅费类型', //差旅费类型
        factory_name_and_serial: 'sku和工厂', //选择的sku和工厂
        travel_reason: '出差事由', //出差事由
        travel_start_time: '开始时间', //开始时间
        travel_end_time: '结束时间', //结束时间
    };
    tools: any = {};
    notFilledToolsArray: any[] = [];
    toolsObject: any = {};
    constructor(private disabled: DisabledService, private es: PageEffectService, private save: SaveService) {}
    ngOnDestroy(): void {
        this.obs$.unsubscribe();
    }
    saveInformation(params: any): void {
        // 调用接口保存
        console.log(params);
        // debugger;
        // 保存成功的情况下
        this.isSaveFlag = true;
        // 保存成功的情况下拿到一个工具对象来做对比
        this.toolsObject = _.cloneDeep(this.currentBigObject);
        // 禁用父组件的东西 true代表禁用
        this.disabled.disabled$.next(true);
    }
    ngOnInit() {
        this.obs$ = this.save.save$.subscribe(res => {
            // 开始保存
            // res就是拿到的父组件的基本信息
            console.log(res);
            const newObj = _.cloneDeep(this.currentBigObject);
            Object.assign(newObj, res);
            this.saveInformation(newObj);
        });
    }
    // 离开路由的时候触发
    confirm(): boolean {
        let flag = true;
        // 如果是未保存的    里面只要有东西那么就提示
        const newObj = _.cloneDeep(this.currentBigObject);
        const tools = _.cloneDeep(this.toolsObject);
        console.log(newObj);
        if (!this.isSaveFlag) {
            for (let key in newObj) {
                // 如果正在遍历的是数组;
                if (newObj[key] instanceof Array) {
                    newObj[key].forEach(item => {
                        // 数组里面可能是普通的字符 也可能是对象
                        if (item instanceof Object) {
                            for (let key1 in item) {
                                if (item[key1] != '') {
                                    flag = false;
                                }
                            }
                        } else {
                            if (item != '') {
                                flag = false;
                            }
                        }
                    });
                } else {
                    // 如果遍历的不是数组  而是普通字符
                    if (newObj[key] != '') {
                        flag = false;
                    }
                }
            }
        } else {
            if (newObj.fuel_charge_list.length != tools.fuel_charge_list.length) {
                flag = false;
            } else {
                // 如果已经保存的情况下  就对比 保存时候的对象  和现在的对象是否有不一样的地方  如果有不一样的地方  那么就直接判断false
                for (let key in newObj) {
                    // 如果是数组的情况下
                    if (newObj[key] instanceof Array) {
                        newObj[key].forEach((item, index) => {
                            if (item instanceof Object) {
                                for (let key1 in item) {
                                    if (item[key1] != tools[key][index][key1]) {
                                        flag = false;
                                    }
                                }
                            } else {
                                if (item != tools[key][index]) {
                                    flag = false;
                                }
                            }
                        });
                    } else {
                        if (newObj[key] != tools[key]) {
                            flag = false;
                        }
                    }
                }
            }
        }
        if (!flag) {
            return false;
        } else {
            return true;
        }
    }
    addItem(): void {
        this.currentBigObject.fuel_charge_list.push({
            departure_place: '', //'出发地点
            arrival_place: '', //'到达地点
            departure_time: '', //出发时间
            arrival_time: '', //到达时间
            theory_miles: '', //理论公里数
            actual_miles: '', //实际公里数
            cost: '', //金额
        });
    }
    deleteProduct(index: number) {}
}
