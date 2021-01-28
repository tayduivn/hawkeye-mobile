import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PageEffectService } from 'src/app/services/page-effect.service';
import { TravelReimbursementService } from 'src/app/services/travel-reimbursement.service';
import _ from 'loadsh';
import { FlashPageService } from './flash-page.service';
@Component({
    selector: 'app-reimbursement',
    templateUrl: './reimbursement.page.html',
    styleUrls: ['./reimbursement.page.scss'],
})
export class ReimbursementPage implements OnInit {
    constructor(
        private router: Router,
        private travel: TravelReimbursementService,
        private es: PageEffectService,
        private acRoute: ActivatedRoute,
        private flash: FlashPageService,
    ) {
        this.obs$ = this.flash.flashPage$.subscribe(res => {
            // this
            this.ngOnInit();
        });
    }
    params: any = {};
    start_time: any = '';
    end_time: any = '';
    queryInfo: any = {
        page: 1,
        paginate: 20,
        user_id: '',
    };
    obs$: any;
    list: any[] = [];
    user_id: any;
    ngOnInit() {
        this.user_id = JSON.parse(window.sessionStorage.getItem('USER_INFO')).id;
        this.queryInfo.user_id = JSON.parse(window.sessionStorage.getItem('USER_INFO')).id;
        // 获取出差报告列表
        // this.getReportListMethod(this.queryInfo);
        this.acRoute.url.subscribe(res => {
            if (res[0].path == 'errand-reimbursement') {
                this.getReportListMethod(this.queryInfo);
            }
        });
        console.log(this.start_time);
        console.log(this.end_time);
    }
    ngOnDestroy(): void {
        this.obs$.unsubscribe();
    }
    reset(): void {
        this.start_time = '';
        this.end_time = '';
        this.flag1 = !this.flag1;
        this.flash.flashPage$.next();
    }
    getReportListMethod(params): void {
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
    flag: boolean = false;
    flag1: boolean = false;
    // 查询;
    toSearch() {
        this.params = {};
        if (Boolean(this.start_time) == false && Boolean(this.end_time) == false) {
            return this.es.showToast({
                message: '请输入查询条件',
                color: 'danger',
                duration: 1500,
            });
        }
        // 点击查询  设置flag为查询
        this.flag = true;
        console.log(this.thinkTime);

        const $thinkTime = this.thinkTime();
        if ($thinkTime) {
            return this.es.showToast({
                message: '出差开始时间不能晚于结束时间!',
                color: 'danger',
                duration: 1500,
            });
        }

        // 这里查询

        this.params.page = 1;
        this.params.paginate = 20;
        this.params.user_id = this.user_id;
        this.params.type = 'pad';
        console.log(this.start_time);
        console.log(this.end_time);

        if (this.start_time != '') {
            this.params.start_time = this.start_time;
        }
        if (this.end_time != '') {
            this.params.end_time = this.end_time;
        }
        console.log(this.params);
        // 调用接口
        this.getReportListMethod(this.params);
    }
    // 判断时间
    thinkTime(): boolean {
        if (this.start_time != '' && this.end_time != '') {
            if (+new Date(this.start_time) > +new Date(this.end_time)) {
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
        let m: any = date.getMonth() + 1;
        m = m < 10 ? '0' + m : m;
        let d: any = date.getDate();
        d = d < 10 ? '0' + d : d;
        return `${y}-${m}-${d}`;
    }
    startTimeChanged() {
        this.start_time = this.handleTime(this.start_time);
    }
    endTimeChanged() {
        this.end_time = this.handleTime(this.end_time);
    }
    // 新增 add-new-errand-reimbursement
    toAdd(): void {
        this.router.navigate(['/add-new-errand-reimbursement']);
    }
    // reset(): void {
    //     this.params.start_time = '';
    //     this.params.end_time = '';
    //     // 重新发起请求请求全部的数据
    // }
    // 去详情; errand-reimbursement-details
    gotoDetails(id: any): void {
        console.log(id);

        let currentObj = {
            travel_id: id,
        };
        this.router.navigate(['/errand-reimbursement-details'], { queryParams: currentObj });
    }
    // 去编辑
    gotoCompile(id: any): void {
        let currentObj = {
            travel_id: id,
        };
        this.router.navigate(['/compile-errand-reimbursement'], { queryParams: currentObj });
    }
    // 下拉刷新
    loadData(event): void {
        this.queryInfo.page++;
        let newObj: any = {};
        // 查询的时候下拉
        if (this.flag) {
            newObj = _.cloneDeep(this.queryInfo);
            // 如果有东西  那么就要和并查询参数
            if (Boolean(this.start_time) == true) {
                newObj.start_time = this.start_time;
            }
            if (Boolean(this.end_time) == true) {
                newObj.end_time = this.end_time;
            }
            newObj.type = 'pad';
            this.travel.getReportList(newObj).subscribe(res => {
                console.log(res);
                if (res.data.travelReimbursement && res.data.travelReimbursement.length != 0) {
                    this.list = this.list.concat(res.data.travelReimbursement);
                } else {
                    this.queryInfo.page--;
                    this.es.showToast({
                        message: '别刷了，没有数据啦！',
                        color: 'danger',
                        duration: 1500,
                    });
                }
                event.target.complete();
            });
        } else {
            //非查询的时候下拉
            newObj = _.cloneDeep(this.queryInfo);
            this.travel.getReportList(newObj).subscribe(res => {
                if (res.data.travelReimbursement && res.data.travelReimbursement.length != 0) {
                    this.list = this.list.concat(res.data.travelReimbursement);
                } else {
                    this.queryInfo.page--;
                    this.es.showToast({
                        message: '别刷了，没有数据啦！',
                        color: 'danger',
                        duration: 1500,
                    });
                }
                event.target.complete();
            });
        }
    }
}
