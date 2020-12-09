import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { ArrayingItem, ArrayingService } from 'src/app/services/arraying.service';
import { PageEffectService } from 'src/app/services/page-effect.service';
import { AlertModalComponent } from './alert-modal/alert-modal.component';
import { AlertThisBatchDetailsComponent } from './alert-this-batch-details/alert-this-batch-details.component';
import _ from 'loadsh';
@Component({
    selector: 'app-done-array-list',
    templateUrl: './done-array-list.component.html',
    styleUrls: ['./done-array-list.component.scss'],
})
export class DoneArrayListComponent implements OnInit {
    list: ArrayingItem[];
    removeData: any = {
        arraying_container_sku_id: '', //sku id
        name: '', //批次号
    };
    queryInfo: any = {
        page: 1,
    };
    controllShow: boolean = true;
    constructor(
        private router: Router,
        private es: PageEffectService,
        private arraying: ArrayingService,
        private activatedRoute: ActivatedRoute,
    ) {}
    gotoStayList() {
        this.router.navigate(['/arraying-container']);
    }
    gotoInstalledCabinets() {
        this.router.navigate(['/installed-cabinets']);
    }
    gotoFinalCabinets() {
        this.router.navigate(['/final-cabinets']);
    }
    onSubmit(id: number) {
        this.onShowModal(id);
    }
    // 显示弹出层
    onShowModal(id: number) {
        // 根据id 查找到相应的项
        const item = this.list.find(item => item.id === id);
        this.es.showModal(
            {
                component: AlertModalComponent,
                componentProps: {
                    item: item,
                    id: id,
                },
            },
            res => {
                // 回调函数 重新加载页面
                // 跳转到待装柜
                this.router.navigate(['/arraying-container/installed-cabinets']);
                window.localStorage.setItem('active', '2');
            },
        );
    }
    onshowModal2(item: any) {
        this.es.showModal({
            component: AlertThisBatchDetailsComponent,
            componentProps: {
                item: item,
            },
        });
    }
    init() {
        this.arraying
            .getAlreadyContainerData(this.queryInfo)
            .pipe(
                tap(res => {}),
                map(res => res.data.data),
            )
            .subscribe(res => {
                this.list = res;
                console.log(this.list);
            });
    }
    ngOnInit() {
        this.activatedRoute.url.subscribe(res => {
            this.init();
        });
    }
    onRemove(item1: any, item: any) {
        // 处理数据
        this.removeData.arraying_container_sku_id = item1.id;
        this.removeData.name = item.name;
        console.log(this.removeData);
        this.alertTest(this.removeData);
    }
    lookDetails(item: any, item1: any) {
        let currentItem = _.cloneDeep(item1);
        currentItem = JSON.stringify(currentItem);
        this.router.navigate(['/done-array-list-details'], {
            queryParams: {
                currentItem,
                name: item.name,
            },
        });
        console.log(item);
    }
    alertTest(data: any) {
        this.es.showAlert({
            message: '确定要撤销吗?',
            buttons: [
                {
                    text: '确定',
                    handler: () => {
                        this.arraying.postRevocationDoneList(data).subscribe(res => {
                            console.log(res);
                            if (res.status === 1) {
                                this.es.showToast({
                                    message: '撤销成功',
                                });
                                this.init();
                            } else {
                                this.es.showToast({
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
    // 本批次的详情
    gotoThisbatchDetails(item: any) {
        console.log(item);
        this.onshowModal2(item);
    }

    loadData(event) {
        this.controllShow = true;
        this.queryInfo.page++;
        this.arraying
            .getAlreadyContainerData(this.queryInfo)
            .pipe(
                tap(res => {}),
                map(res => res.data),
            )
            .subscribe(res => {
                console.log(res);
                console.log(this.queryInfo.page);
                if (res.data.length == 0) {
                    this.controllShow = false;
                }
                if (res.data && res.data.length) {
                    this.list = this.list.concat(res.data);
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
