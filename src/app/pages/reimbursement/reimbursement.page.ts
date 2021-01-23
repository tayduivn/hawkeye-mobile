import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PageEffectService } from 'src/app/services/page-effect.service';
import { TravelReimbursementService } from 'src/app/services/travel-reimbursement.service';
import _ from 'loadsh';
@Component({
    selector: 'app-reimbursement',
    templateUrl: './reimbursement.page.html',
    styleUrls: ['./reimbursement.page.scss'],
})
export class ReimbursementPage implements OnInit {
    constructor(private router: Router, private travel: TravelReimbursementService, private es: PageEffectService) {}
    params: any = {
        travel_start_time: '',
        travel_end_time: '',
    };
    queryInfo: any = {
        page: 1,
        pageSize: 10,
    };
    list: any[] = [];
    ngOnInit() {
        // 获取出差报告列表
        this.getReportListMethod(this.queryInfo);
    }
    getReportListMethod(params): void {
        // console.log(this.queryInfo);

        this.travel.getReportList(params).subscribe(res => {
            console.log(res);
            if (res.status != 1)
                return this.es.showToast({
                    message: res.message,
                    color: 'danger',
                    duration: 1500,
                });
            // 获取成功的时候
            const {
                data: { travelReimbursement },
            } = res;
            console.log(travelReimbursement);
            this.list = travelReimbursement;
        });
    }
    // 查询;
    toSearch() {
        const $thinkTime = this.thinkTime();
        if ($thinkTime) {
            return this.es.showToast({
                message: '出差开始时间不能晚于结束时间!',
                color: 'danger',
                duration: 1500,
            });
        }

        // 这里查询
        // const newQuery = _.cloneDeep(this.queryInfo);
        // const newParams = _.cloneDeep(this.params);
        // Object.assign(newQuery, newParams);
        this.params.page = 1;
        this.params.pageSize = 10;
        console.log(this.params);
    }
    // 判断时间
    thinkTime(): boolean {
        if (this.params.travel_start_time != '' && this.params.travel_end_time != '') {
            if (+new Date(this.params.travel_start_time) > +new Date(this.params.travel_end_time)) {
                return true; //禁止
            } else {
                return false; //正常
            }
        } else {
            return false; //正常
        }
    }
    handleTime(time: string): string {
        const date = new Date(time);
        const y = date.getFullYear();
        const m = date.getMonth() + 1;
        const d = date.getDate();
        return `${y}-${m}-${d}`;
    }
    startTimeChanged() {
        this.params.travel_start_time = this.handleTime(this.params.travel_start_time);
    }
    endTimeChanged() {
        this.params.travel_end_time = this.handleTime(this.params.travel_end_time);
    }
    // 新增 add-new-errand-reimbursement
    toAdd(): void {
        this.router.navigate(['/add-new-errand-reimbursement']);
    }
    // reset(): void {
    //     this.params.travel_start_time = '';
    //     this.params.travel_end_time = '';
    //     // 重新发起请求请求全部的数据
    // }
    // 去详情; errand-reimbursement-details
    gotoDetails(): void {
        this.router.navigate(['/errand-reimbursement-details']);
    }
    // 去编辑
    gotoCompile(): void {
        this.router.navigate(['/compile-errand-reimbursement']);
    }
}
