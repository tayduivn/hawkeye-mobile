import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PageEffectService } from 'src/app/services/page-effect.service';
import { TravelReimbursementService } from 'src/app/services/travel-reimbursement.service';
import { QueueComponent } from '../../implement-inspection/queue/queue.component';

@Component({
    selector: 'app-errand-reimbursement-details',
    templateUrl: './errand-reimbursement-details.component.html',
    styleUrls: ['./errand-reimbursement-details.component.scss'],
})
export class ErrandReimbursementDetailsComponent implements OnInit {
    constructor(
        private es: PageEffectService,
        private activatedRoute: ActivatedRoute,
        private travel: TravelReimbursementService,
    ) {}
    originObj: any = {};
    alreadyUpProgress: boolean;
    travel_id: number;
    ngOnInit() {
        this.getInitQueryParams();
        // 发起请求请求详情数据
    }
    getInitQueryParams() {
        this.activatedRoute.queryParams.subscribe(queryParam => {
            // console.log(this.travel_id);
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
                console.log(data);
                this.originObj = data;
                this.originObj.travel_start_time = this.handleTime(this.originObj.travel_start_time);
                this.originObj.travel_end_time = this.handleTime(this.originObj.travel_end_time);
                if (this.originObj.travel_type == '1') {
                    //普通
                    this.originObj.traffic_expense_list.forEach(item => {
                        if (item.departure_time) {
                            item.departure_time = this.handleTime1(item.departure_time);
                        }
                        console.log(item.arrival_time);

                        if (item.arrival_time) {
                            item.arrival_time = this.handleTime1(item.arrival_time);
                        }
                    });
                }

                if (this.originObj.travel_type == '2') {
                    //自驾
                    this.originObj.fuel_charge_list.forEach(item => {
                        if (item.departure_time) {
                            item.departure_time = this.handleTime1(item.departure_time);
                        }
                        if (item.arrival_time) {
                            item.arrival_time = this.handleTime1(item.arrival_time);
                        }
                    });
                }
            });
    }
    // 处理成年月日
    handleTime(time: string): string {
        const date = new Date(time);
        const y = date.getFullYear();
        let m: any = date.getMonth() + 1;
        m = m < 10 ? '0' + m : m;
        let d: any = date.getDate();
        d = d < 10 ? '0' + d : d;
        return `${y}-${m}-${d}`;
    }
    // 处理成年月日时分
    handleTime1(time: string): string {
        const date = new Date(time);
        const y = date.getFullYear();
        let m: any = date.getMonth() + 1;
        m = m < 10 ? '0' + m : m;
        let d: any = date.getDate();
        d = d < 10 ? '0' + d : d;
        let h: any = date.getHours();
        h = h < 10 ? '0' + h : h;
        let mm: any = date.getMinutes();
        mm = mm < 10 ? '0' + mm : mm;
        return `${y}-${m}-${d} ${h}:${mm}`;
    }
    isShow: boolean = true;
    // 显示上传进度
    showModal() {
        this.es.showModal({
            component: QueueComponent,
        });
        this.alreadyUpProgress = true;
    }
    selectChange() {}
    toAdd() {}
}
