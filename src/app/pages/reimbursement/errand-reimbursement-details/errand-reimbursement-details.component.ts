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
            });
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
