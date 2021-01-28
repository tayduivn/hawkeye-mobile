import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import _ from 'loadsh';
import { QueueComponent } from 'src/app/pages/implement-inspection/queue/queue.component';
import { PageEffectService } from 'src/app/services/page-effect.service';
import { TravelReimbursementService } from 'src/app/services/travel-reimbursement.service';
import { SaveOnlyOneService } from 'src/app/widget/photo-evection/save-only-one.service';
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
    // initObject: any = {};
    toolsObject: any = {};
    alreadyUpProgress: boolean;
    total: any = '0.00';
    // 前置数据
    vehicleArray: any[] = [];
    vehicleIndex: any[] = [];
    // 发票抬头
    stay_invoice_title_params: any[] = [];
    city_cost_type_paramsArray: any[] = [];
    city_cost_type_paramsIndex: any[] = [];
    constructor(
        private es: PageEffectService,
        private router: Router,
        private travel: TravelReimbursementService,
        private activatedRoute: ActivatedRoute,
        private acRoute: ActivatedRoute,
        private onlyOne: SaveOnlyOneService,
    ) {}
    showModal() {
        this.es.showModal({
            component: QueueComponent,
        });
        this.alreadyUpProgress = true;
    }
    notAccord: any[] = [];
    disabled: boolean = false;
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
        let m: any = date.getMonth() + 1;
        m = m < 10 ? '0' + m : m;
        let d: any = date.getDate();
        d = d < 10 ? '0' + d : d;
        return `${y}-${m}-${d}`;
    }
    // startTimeChanged(index: number) {
    //     this.currentBigObject.traffic_expense_list[index].departure_time = this.handleTime(
    //         this.currentBigObject.traffic_expense_list[index].departure_time,
    //     );
    // }
    // endTimeChanged(index: number) {
    //     this.currentBigObject.traffic_expense_list[index].arrival_time = this.handleTime(
    //         this.currentBigObject.traffic_expense_list[index].arrival_time,
    //     );
    // }
    obs$: any;
    ngOnDestroy(): void {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.
        this.obs$.unsubscribe();
    }
    ngOnInit() {
        this.obs$ = this.onlyOne.onlyOneNumber$.subscribe(res => {
            console.log(res);
            this.currentBigObject.traffic_expense_list[res.index].trans_expenses_no =
                res.trans_expenses_no.trans_expenses_no;
        });
        console.log('重新刷新');

        this.acRoute.url.subscribe(res => {
            if (res[0].path == 'normal') {
                console.log('normal');

                this.getInitQueryParams();
                // 获取前置数据
                this.travel.getPrepositionData().subscribe(res => {
                    // res.vehicle_params;
                    console.log(res);

                    this.vehicleArray = [];
                    this.vehicleIndex = [];
                    this.stay_invoice_title_params = [];
                    this.city_cost_type_paramsArray = [];
                    this.city_cost_type_paramsIndex = [];
                    this.stay_invoice_title_params = res.stay_invoice_title_params;
                    for (let key in res.vehicle_params) {
                        this.vehicleArray.push(res.vehicle_params[key]);
                        this.vehicleIndex.push(key);
                    }
                    for (let key in res.city_cost_type_params) {
                        this.city_cost_type_paramsArray.push(res.city_cost_type_params[key]);
                        this.city_cost_type_paramsIndex.push(key);
                    }
                });
            }
        });
    }
    getInitQueryParams() {
        this.activatedRoute.queryParams.subscribe(queryParam => {
            this.currentBigObject.travel_reimbursement_no = queryParam.travel_reimbursement_no;
            this.currentBigObject.travel_id = queryParam.travel_id;
            this.currentBigObject.travel_type = '1';
            console.log(this.currentBigObject);
        });
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
                        this.toolsObject.traffic_expense_list.forEach(item => {
                            if (item.trans_expenses_no) {
                            } else {
                                item.trans_expenses_no = null;
                            }
                        });
                        console.log(this.toolsObject);
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
                            // 成功后禁用按钮
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
    moneyChanged(): void {
        let total: number = 0;
        console.log(11);
        this.currentBigObject.traffic_expense_list.forEach(item => {
            total += item.cost - 0;
        });
        total += this.currentBigObject.stay_cost - 0;
        total += this.currentBigObject.city_cost - 0;
        total += this.currentBigObject.travel_subsidy_cost - 0;
        this.total = total.toFixed(2);
        console.log(this.total);
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
    deleteProduct(index: number, trans_expenses_no: any): void {
        console.log(trans_expenses_no);
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
                            this.currentBigObject.traffic_expense_list.splice(index, 1);
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
                            this.currentBigObject.traffic_expense_list.splice(index, 1);
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
    backToMainList(): void {
        // 返回主要列表;
        this.router.navigate(['/errand-reimbursement']);
    }
}
