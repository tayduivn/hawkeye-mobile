import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PageEffectService } from 'src/app/services/page-effect.service';
import { TravelReimbursementService } from 'src/app/services/travel-reimbursement.service';
import { QueueComponent } from '../../implement-inspection/queue/queue.component';
import _ from 'loadsh';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SaveOnlyOneService } from 'src/app/widget/photo-evection/save-only-one.service';
@Component({
    selector: 'app-compile-errand-reimbursement',
    templateUrl: './compile-errand-reimbursement.component.html',
    styleUrls: ['./compile-errand-reimbursement.component.scss'],
})
export class CompileErrandReimbursementComponent implements OnInit {
    constructor(
        private es: PageEffectService,
        private activatedRoute: ActivatedRoute,
        private travel: TravelReimbursementService,
        private router: Router,
        private onlyOne: SaveOnlyOneService,
    ) {}
    alreadyUpProgress: boolean;
    originObj: any = {
        factory_name_and_serial: [],
    };
    isShow: boolean = true;
    // 工厂流水号下拉选择器的双向绑定对象
    factory_name_and_serial = '';
    reason: any[] = [];
    reasonIndex: any[] = [];
    vehicleArray: any[] = [];
    vehicleIndex: any[] = [];
    stay_invoice_title_params: any[] = [];
    city_cost_type_paramsArray: any[] = [];
    city_cost_type_paramsIndex: any[] = [];
    factoryArray: any[] = [];
    disabled: boolean = false;
    obs$: any;
    ngOnInit() {
        this.obs$ = this.onlyOne.onlyOneNumber$.subscribe(res => {
            console.log(res);
            // 如果是普通的类型
            if (this.originObj.travel_type == '1') {
                this.originObj.traffic_expense_list[res.index].trans_expenses_no =
                    res.trans_expenses_no.trans_expenses_no;
            } else {
                // 如果是自驾
                this.originObj.fuel_charge_list[res.index].trans_expenses_no = res.trans_expenses_no.trans_expenses_no;
            }
        });

        this.getInitQueryParams();
        this.travel.getPrepositionData().subscribe(res => {
            // res.vehicle_params;
            console.log(res);
            this.vehicleArray = [];
            this.vehicleIndex = [];
            this.reason = [];
            this.reasonIndex = [];
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

            for (let key in res.travel_reason_params) {
                this.reason.push(res.travel_reason_params[key]);
                this.reasonIndex.push(key);
            }
        });
    }
    moneyChanged() {
        // 普通
        if (this.originObj.travel_type == '1') {
            let total: number = 0;
            console.log(11);
            this.originObj.traffic_expense_list.forEach(item => {
                total += item.cost - 0;
            });
            total += this.originObj.stay_cost - 0;
            total += this.originObj.city_cost - 0;
            total += this.originObj.travel_subsidy_cost - 0;
            this.originObj.travel_sum_cost = total.toFixed(2);
        } else {
            let total: number = 0;
            console.log(11);
            this.originObj.fuel_charge_list.forEach(item => {
                total += item.cost - 0;
            });
            total += this.originObj.road_toll_cost - 0;
            total += this.originObj.parking_cost - 0;
            total += this.originObj.stay_cost - 0;
            total += this.originObj.travel_subsidy_cost - 0;
            this.originObj.travel_sum_cost = total.toFixed(2);
        }
    }
    getInitQueryParams() {
        this.activatedRoute.queryParams.subscribe(queryParam => {
            console.log(queryParam);
            this.getDetail(queryParam.travel_id - 0);
        });
    }

    getDetail(params): void {
        console.log(params);

        this.travel
            .getDetails({
                travel_id: params,
            })
            .subscribe(res => {
                console.log(res);
                if (res.status != 1)
                    return this.es.showToast({
                        message: res.message,
                        color: 'danger',
                        duration: 1500,
                    });
                // 获取成功结构出数据
                const { data } = res;
                const obj = _.cloneDeep(data);
                this.originObj = obj;
                console.log(this.originObj);
                this.getFactoryAndSku(this.originObj.travel_reason);
                this.moneyChanged();
            });

        // this.originObj$ = this.travel
        //     .getDetails({
        //         travel_id: params,
        //     })

        //     .pipe(map(res => _.cloneDeep(res.data)));
    }
    // 获取工厂列表
    getFactoryAndSku(params): void {
        this.travel.getFactoryAndSerial({ type: params }).subscribe(res => {
            console.log(res);
            this.factoryArray = res.factory_list;
        });
    }
    reasonChanged() {
        console.log(1);
        this.originObj.factory_name_and_serial = [];
        this.getFactoryAndSku(this.originObj.travel_reason);
    }
    // originObj$: Observable<any> = null;
    showModal() {
        this.es.showModal({
            component: QueueComponent,
        });
        this.alreadyUpProgress = true;
    }
    toAdd(): void {
        this.originObj.traffic_expense_list.push({
            vehicle: null,
            departure_place: null,
            arrival_place: null,
            departure_time: null,
            arrival_time: null,
            bill_num: null,
            cost: null,
            hash_arr: [],
            trans_expenses_no: null,
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
        console.log(this.originObj);
        this.originObj.travel_id = this.originObj.id;
        // 调用接口保存
        this.travel.compileDetails(this.originObj).subscribe(res => {
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
            // 保存成功跳转前禁用按钮
            this.disabled = true;
            setTimeout(() => {
                this.router.navigate(['/errand-reimbursement']);
            }, 1500);
        });
    }

    deleteProduct(index: number, trans_expenses_no: any) {
        if (trans_expenses_no) {
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
                            this.originObj.traffic_expense_list.splice(index, 1);
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
                                    // this.travel
                                    //     .updBxTotal({
                                    //         travel_reimbursement_no: this.originObj.travel_reimbursement_no,
                                    //         travel_sum_cost: this.originObj.travel_sum_cost,
                                    //     })
                                    //     .subscribe(res => {
                                    //         console.log(res);
                                    //     });
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
                            this.originObj.traffic_expense_list.splice(index, 1);
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
    factory_name_and_serialSelectChange(event) {
        event == '' ? 0 : this.originObj.factory_name_and_serial.push(event);
        this.originObj.factory_name_and_serial = [...new Set(this.originObj.factory_name_and_serial)];
        // 延后清空下拉框
        setTimeout(() => {
            this.clear();
        }, 0);
    }
    clear() {
        this.factory_name_and_serial = '';
    }
    removeClicked(index: number) {
        // 唤起弹出层
        this.es.showAlert({
            message: '确定删除该流水号及工厂名吗?',
            buttons: [
                {
                    text: '取消',
                },
                {
                    text: '确定',
                    handler: () => {
                        this.originObj.factory_name_and_serial.splice(index, 1);
                    },
                },
            ],
        });
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
    startTimeChanged() {
        this.originObj.travel_start_time = this.handleTime(this.originObj.travel_start_time);
    }
    endTimeChanged() {
        this.originObj.travel_end_time = this.handleTime(this.originObj.travel_end_time);
    }

    notAccord: any[] = [];
    thinkTime(): boolean {
        this.notAccord = [];
        // 找到有哪些时间不符合规定
        if (this.originObj.travel_type == '1') {
            this.originObj.traffic_expense_list.forEach((item, index) => {
                if (+new Date(item.departure_time) > +new Date(item.arrival_time)) {
                    // 这里是不符合规定的时间
                    this.notAccord.push(index);
                }
            });
            let flag = this.originObj.traffic_expense_list.some(item => {
                if (+new Date(item.departure_time) > +new Date(item.arrival_time)) {
                    // 这里是不符合规定的时间
                    return true;
                } else {
                    return false;
                }
            });
            // debugger;

            return flag;
        } else {
            // 如果是自驾
            this.originObj.fuel_charge_list.forEach((item, index) => {
                if (+new Date(item.departure_time) > +new Date(item.arrival_time)) {
                    // 这里是不符合规定的时间
                    this.notAccord.push(index);
                }
            });
            let flag = this.originObj.fuel_charge_list.some(item => {
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
    }
    toAdd1() {
        this.originObj.fuel_charge_list.push({
            departure_place: null,
            arrival_place: null,
            departure_time: null,
            arrival_time: null,
            theory_miles: null,
            actual_miles: null,
            cost: null,
            hash_arr: [],
            trans_expenses_no: null,
        });
    }
    deleteProduct1(index: number, trans_expenses_no: any) {
        if (trans_expenses_no) {
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
                            this.originObj.fuel_charge_list.splice(index, 1);
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
                                    // this.travel
                                    //     .updBxTotal({
                                    //         travel_reimbursement_no: this.originObj.travel_reimbursement_no,
                                    //         travel_sum_cost: this.originObj.travel_sum_cost,
                                    //     })
                                    //     .subscribe(res => {
                                    //         console.log(res);
                                    //     });
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
                            this.originObj.fuel_charge_list.splice(index, 1);
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
}
