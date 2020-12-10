import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ArrayingItem, ArrayingService } from 'src/app/services/arraying.service';
import { Paging } from 'src/app/services/inspection.service';
import { PageEffectService } from 'src/app/services/page-effect.service';
import { AlertInstalledModalComponent } from './alert-installed-modal/alert-installed-modal.component';
import { DetailsModelComponent } from './details-model/details-model.component';
import _ from 'loadsh';
export interface InstallData {
    id: number; //组的id
    truely_loading_time: string; // 实际装柜时间
    on_board_date: string; // 开船日期
    seal_no: string; // 铅封号
    container_no: string; // 柜号
    estimated_arrival_time: string; //预计到港时间
    sku_data: Array<{ id: number; truly_arraying_container_num: number }>;
}
@Component({
    selector: 'app-installed-cabinets',
    templateUrl: './installed-cabinets.component.html',
    styleUrls: ['./installed-cabinets.component.scss'],
})
export class InstalledCabinetsComponent implements OnInit {
    data: Array<ArrayingItem> = [];
    paramsData: any = {
        name: '',
    };
    queryInfo: any = {
        page: 1,
    };
    constructor(
        private router: Router,
        private es: PageEffectService,
        private arraying: ArrayingService,
        private activatedRoute: ActivatedRoute,
    ) {}
    gotoStayList() {
        this.router.navigate(['/arraying-container']);
    }
    gotoDoneList() {
        this.router.navigate(['/done-array-list']);
    }
    gotoFinalCabinets() {
        this.router.navigate(['/final-cabinets']);
    }
    // 展示弹出层
    onshowInstalledModal(item: any) {
        this.onshowModal(item);
    }
    onshowModal(item) {
        console.log(item);

        this.es.showModal(
            {
                component: AlertInstalledModalComponent,
                componentProps: {
                    item: item,
                },
            },
            res => {
                console.log(res);
                // 重载页面
            },
        );
    }
    ngOnInit() {
        this.activatedRoute.url.subscribe(res => {
            this.init();
        });
    }
    onRemove(item: any) {
        this.paramsData.name = item.name;
        this.alertTest(this.paramsData);
    }
    alertTest(data: any) {
        this.es.showAlert({
            message: '确定要撤销吗?',
            buttons: [
                {
                    text: '确定',
                    handler: () => {
                        this.arraying.postRevocationInstalled(data).subscribe(res => {
                            console.log(res);
                            if (res.status === 1) {
                                this.es.showToast({
                                    color: 'success',
                                    duration: 2000,
                                    message: '撤销成功',
                                });
                                setTimeout(() => {
                                    this.init();
                                }, 1000);
                            } else {
                                this.es.showToast({
                                    color: 'danger',
                                    duration: 2000,
                                    message: '撤销失败',
                                });
                            }
                        });
                    },
                },
                {
                    text: '取消',
                },
            ],
        });
    }
    lookDetails(item: any, item1: any) {
        let currentItem = _.cloneDeep(item1);
        currentItem = JSON.stringify(currentItem);
        this.router.navigate(['/installed-cabinets-details'], {
            queryParams: {
                currentItem,
                name: item.name,
                shipping_room: item.shipping_room,
                estimate_loading_time: item.estimate_loading_time,
                bl_no: item.bl_no,
                desc: item.desc,
            },
        });
    }
    // 获取初始化数据
    init() {
        this.arraying.getLoadingData(this.queryInfo).subscribe(res => {
            const { data } = res;
            console.log(res);
            this.data = data;
            console.log(this.data);
        });
    }
    // 展示详情的组件
    onshowDetailsModal(item: any) {
        this.onshowModel(item);
    }
    onshowModel(item) {
        this.es.showModal({
            component: DetailsModelComponent,
            componentProps: { item },
        });
    }

    loadData(event) {
        this.queryInfo.page++;
        this.arraying.getLoadingData(this.queryInfo).subscribe(res => {
            if (res.data && res.data.length) {
                this.data = this.data.concat(res.data);
            } else {
                this.queryInfo.page--;
                this.es.showToast({
                    message: '别刷了，没有数据啦！',
                    color: 'danger',
                });
            }
            event.target.complete();
        });
    }
}
