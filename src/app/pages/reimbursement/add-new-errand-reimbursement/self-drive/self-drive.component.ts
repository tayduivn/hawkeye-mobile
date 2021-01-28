import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import _ from 'loadsh';
import { QueueComponent } from 'src/app/pages/implement-inspection/queue/queue.component';
import { PageEffectService } from 'src/app/services/page-effect.service';
import { TravelReimbursementService } from 'src/app/services/travel-reimbursement.service';
import { SaveOnlyOneService } from 'src/app/widget/photo-evection/save-only-one.service';
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
    total: any = '0.00';
    toolsObject: any = {};
    disabled: boolean = false;
    constructor(
        private es: PageEffectService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private travel: TravelReimbursementService,
        private acRoute: ActivatedRoute,
        private onlyOne: SaveOnlyOneService,
    ) {}
    alreadyUpProgress: boolean;

    showModal() {
        this.es.showModal({
            component: QueueComponent,
        });
        this.alreadyUpProgress = true;
    }
    ngOnDestroy(): void {
        this.obs$.unsubscribe();
    }
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

        this.es.showAlert({
            message: '确认提交信息?',
            buttons: [
                {
                    text: '取消',
                },
                {
                    text: '确定',
                    handler: () => {
                        this.toolsObject = _.cloneDeep(this.currentBigObject);
                        this.toolsObject.travel_sum_cost = this.total - 0;
                        console.log(this.toolsObject);
                        this.toolsObject.fuel_charge_list.forEach(item => {
                            if (item.trans_expenses_no) {
                            } else {
                                item.trans_expenses_no = null;
                            }
                        });
                        this.travel.add_travel_reimbursement(this.toolsObject).subscribe(res => {
                            console.log(res);
                            if (res.status != 1)
                                return this.es.showToast({
                                    message: res.message,
                                    color: 'danger',
                                    duration: 1500,
                                });
                            this.es.showToast({
                                message: res.message,
                                color: 'success',
                                duration: 1500,
                            });
                            this.disabled = true;
                            setTimeout(() => {
                                this.router.navigate(['/errand-reimbursement']);
                            }, 1500);
                        });
                    },
                },
            ],
        });
    }
    obs$: any;
    stay_invoice_title_params: any[] = [];
    ngOnInit() {
        this.obs$ = this.onlyOne.onlyOneNumber$.subscribe(res => {
            console.log(res);
            this.currentBigObject.fuel_charge_list[res.index].trans_expenses_no =
                res.trans_expenses_no.trans_expenses_no;
        });
        this.acRoute.url.subscribe(res => {
            if (res[0].path == 'self-drive') {
                console.log('self-drive');

                this.getInitQueryParams();
                this.travel.getPrepositionData().subscribe(res => {
                    // res.vehicle_params;
                    console.log(res);

                    this.stay_invoice_title_params = res.stay_invoice_title_params;
                });
            }
        });
    }
    getInitQueryParams() {
        this.activatedRoute.queryParams.subscribe(queryParam => {
            this.currentBigObject.travel_reimbursement_no = queryParam.travel_reimbursement_no;
            this.currentBigObject.travel_id = queryParam.travel_id;
            this.currentBigObject.travel_type = '2';
        });
    }
    moneyChanged(): void {
        let total: number = 0;
        console.log(11);
        this.currentBigObject.fuel_charge_list.forEach(item => {
            total += item.cost - 0;
        });
        total += this.currentBigObject.road_toll_cost - 0;
        total += this.currentBigObject.parking_cost - 0;
        total += this.currentBigObject.stay_cost - 0;
        total += this.currentBigObject.travel_subsidy_cost - 0;
        this.total = total.toFixed(2);
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
    deleteProduct(index: number, trans_expenses_no: any) {
        if (trans_expenses_no) {
            // 如果存在那么就调用接口删除
            // 删除卡片项
            this.es.showAlert({
                message: '确认删除?',
                buttons: [
                    {
                        text: '取消',
                    },
                    {
                        text: '确认',
                        handler: () => {
                            // 执行删除操作删除视图层
                            this.currentBigObject.fuel_charge_list.splice(index, 1);
                            // 调用接口删除数据库
                            this.travel
                                .deleteOilOrTrafficCost({
                                    trans_expenses_no: trans_expenses_no,
                                })
                                .subscribe(res => {
                                    console.log(res);
                                    if (res.status != 1)
                                        return this.es.showToast({
                                            message: res.message,
                                            color: 'danger',
                                            duration: 1500,
                                        });
                                    this.es.showToast({
                                        message: res.message,
                                        color: 'success',
                                        duration: 1500,
                                    });
                                    this.moneyChanged();
                                });
                        },
                    },
                ],
            });
        } else {
            this.es.showAlert({
                message: '确认删除?',
                buttons: [
                    {
                        text: '取消',
                    },
                    {
                        text: '确认',
                        handler: () => {
                            // 执行删除操作删除视图层
                            this.currentBigObject.fuel_charge_list.splice(index, 1);
                            this.es.showToast({
                                message: '删除成功',
                                color: 'success',
                                duration: 1500,
                            });
                            this.moneyChanged();
                        },
                    },
                ],
            });
        }
    }
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
        let m: any = date.getMonth() + 1;
        m = m < 10 ? '0' + m : m;
        let d: any = date.getDate();
        d = d < 10 ? '0' + d : d;
        return `${y}-${m}-${d}`;
    }
    startTimeChanged(index: number) {
        this.currentBigObject.fuel_charge_list[index].departure_time = this.handleTime(
            this.currentBigObject.fuel_charge_list[index].departure_time,
        );
    }
    endTimeChanged(index: number) {
        this.currentBigObject.fuel_charge_list[index].arrival_time = this.handleTime(
            this.currentBigObject.fuel_charge_list[index].arrival_time,
        );
    }

    backToMainList(): void {
        // 返回主要列表;
        this.router.navigate(['/errand-reimbursement']);
    }
}
