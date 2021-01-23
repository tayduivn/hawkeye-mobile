import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import _ from 'loadsh';
import { QueueComponent } from 'src/app/pages/implement-inspection/queue/queue.component';
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

    // 基本信息的对象
    baseInformation: any = {
        travel_type: '差旅费类型', //差旅费类型
        factory_name_and_serial: 'sku和工厂', //选择的sku和工厂
        travel_reason: '出差事由', //出差事由
        travel_start_time: '开始时间', //开始时间
        travel_end_time: '结束时间', //结束时间
    };

    toolsObject: any = {};
    constructor(private es: PageEffectService, private router: Router) {}
    alreadyUpProgress: boolean;

    showModal() {
        this.es.showModal({
            component: QueueComponent,
        });
        this.alreadyUpProgress = true;
    }
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
    }
    ngOnInit() {}

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
    notAccord: any[] = [];
    thinkTime(): boolean {
        this.notAccord = [];
        this.currentBigObject.fuel_charge_list.forEach((item, index) => {
            if (+new Date(item.departure_time) > +new Date(item.arrival_time)) {
                // 这里是不符合规定的时间
                this.notAccord.push(index);
            }
        });

        let flag = this.currentBigObject.fuel_charge_list.some(item => {
            if (+new Date(item.departure_time) > +new Date(item.arrival_time)) {
                return true;
            } else {
                return false;
            }
        });
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

    backToMainList(): void {
        // 返回主要列表;
        this.router.navigate(['/errand-reimbursement']);
    }
}
