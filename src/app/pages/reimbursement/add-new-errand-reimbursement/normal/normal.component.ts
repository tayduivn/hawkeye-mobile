import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import _ from 'loadsh';
import { QueueComponent } from 'src/app/pages/implement-inspection/queue/queue.component';
import { PageEffectService } from 'src/app/services/page-effect.service';
import { TravelReimbursementService } from 'src/app/services/travel-reimbursement.service';
@Component({
    selector: 'app-normal',
    templateUrl: './normal.component.html',
    styleUrls: ['./normal.component.scss'],
})
export class NormalComponent implements OnInit {
    // 定义数据源
    currentBigObject: any = {
        traffic_expense_list: [
            {
                vehicle: '', //交通工具
                departure_place: '', //'出发地点
                arrival_place: '', //到达地点
                departure_time: '', //出发时间
                arrival_time: '', //到达时间
                bill_num: '', //单据张数
                cost: '', //金额
            },
        ], //交通费的数组
        // quarterage：住宿费前缀
        stay_bill_num: '', //住宿费单据
        stay_invoice_title: '', //住宿费发票抬头
        stay_cost: '', //住宿费金额
        city_bill_num: '', //车费单据
        city_cost_type: '', //车类型
        city_cost: '', //车费
        travel_day_num: '', //出差天数
        travel_subsidy_cost: '', //出差金额
    };
    // isSaveFlag: boolean = false;
    // obs$: any;

    tools: any = {};

    toolsObject: any = {};
    alreadyUpProgress: boolean;
    constructor(private es: PageEffectService, private router: Router, private travel: TravelReimbursementService) {}
    showModal() {
        this.es.showModal({
            component: QueueComponent,
        });
        this.alreadyUpProgress = true;
    }
    notAccord: any[] = [];
    // 判断时间
    thinkTime(): boolean {
        this.notAccord = [];
        // 找到有哪些时间不符合规定
        this.currentBigObject.traffic_expense_list.forEach((item, index) => {
            if (+new Date(item.departure_time) > +new Date(item.arrival_time)) {
                // 这里是不符合规定的时间
                this.notAccord.push(index);
            }
        });
        let flag = this.currentBigObject.traffic_expense_list.some(item => {
            if (+new Date(item.departure_time) > +new Date(item.arrival_time)) {
                // 这里是不符合规定的时间
                return true;
            } else {
                return false;
            }
        });
        // debugger;

        return flag;
    }
    handleTime(time: string): string {
        const date = new Date(time);
        const y = date.getFullYear();
        const m = date.getMonth() + 1;
        const d = date.getDate();
        return `${y}-${m}-${d}`;
    }
    startTimeChanged(index: number) {
        this.currentBigObject.traffic_expense_list[index].departure_time = this.handleTime(
            this.currentBigObject.traffic_expense_list[index].departure_time,
        );
    }
    endTimeChanged(index: number) {
        this.currentBigObject.traffic_expense_list[index].arrival_time = this.handleTime(
            this.currentBigObject.traffic_expense_list[index].arrival_time,
        );
    }
    ngOnInit() {}
    ngOnDestroy(): void {}
    saveInformation() {
        const $thinkTime = this.thinkTime();
        if ($thinkTime) {
            return this.es.showToast({
                message: '出发时间不能晚于到达时间!',
                color: 'danger',
                duration: 1500,
            });
        }
        // 调用接口保存

        this.toolsObject = _.cloneDeep(this.currentBigObject);
        console.log(this.toolsObject);
        this.travel.add_travel_reimbursement(this.toolsObject).subscribe(res => {
            console.log(res);
        });
    }
    // // 离开路由的时候触发
    // confirm(): boolean {
    //     let flag = true;
    //     // 如果是未保存的    里面只要有东西那么就提示
    //     const newObj = _.cloneDeep(this.currentBigObject);
    //     const tools = _.cloneDeep(this.toolsObject);
    //     if (!this.isSaveFlag) {
    //         for (let key in newObj) {
    //             // 如果正在遍历的是数组;
    //             if (newObj[key] instanceof Array) {
    //                 newObj[key].forEach(item => {
    //                     // 数组里面可能是普通的字符 也可能是对象
    //                     if (item instanceof Object) {
    //                         for (let key1 in item) {
    //                             if (item[key1] != '') {
    //                                 flag = false;
    //                             }
    //                         }
    //                     } else {
    //                         if (item != '') {
    //                             flag = false;
    //                         }
    //                     }
    //                 });
    //             } else {
    //                 // 如果遍历的不是数组  而是普通字符
    //                 if (newObj[key] != '') {
    //                     flag = false;
    //                 }
    //             }
    //         }
    //     } else {
    //         if (tools.traffic_expense_list.length != newObj.traffic_expense_list.length) {
    //             flag = false;
    //         } else {
    //             // 如果已经保存的情况下  就对比 保存时候的对象  和现在的对象是否有不一样的地方  如果有不一样的地方  那么就直接判断false
    //             for (let key in newObj) {
    //                 // 如果是数组的情况下
    //                 if (newObj[key] instanceof Array) {
    //                     newObj[key].forEach((item, index) => {
    //                         if (item instanceof Object) {
    //                             for (let key1 in item) {
    //                                 if (item[key1] != tools[key][index][key1]) {
    //                                     flag = false;
    //                                 }
    //                             }
    //                         } else {
    //                             if (item != tools[key][index]) {
    //                                 flag = false;
    //                             }
    //                         }
    //                     });
    //                 } else {
    //                     if (newObj[key] != tools[key]) {
    //                         flag = false;
    //                     }
    //                 }
    //             }
    //         }
    //     }
    //     if (!flag) {
    //         return false;
    //     } else {
    //         return true;
    //     }
    // }
    // 添加卡片项
    addItem(): void {
        this.currentBigObject.traffic_expense_list.push({
            vehicle: '', //交通工具
            departure_place: '', //'出发地点
            arrival_place: '', //到达地点
            departure_time: '', //出发时间
            arrival_time: '', //到达时间
            bill_num: '', //单据张数
            cost: '', //金额
        });
    }
    deleteProduct(index: number): void {
        // 删除卡片项
    }
    backToMainList(): void {
        // 返回主要列表;
        this.router.navigate(['/errand-reimbursement']);
    }
}
