import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ArrayingItem, ArrayingService } from 'src/app/services/arraying.service';
import { PageEffectService } from 'src/app/services/page-effect.service';
import _ from 'loadsh';
@Component({
    selector: 'app-final-cabinets',
    templateUrl: './final-cabinets.component.html',
    styleUrls: ['./final-cabinets.component.scss'],
})
// 类似于格式的嵌套
export class FinalCabinetsComponent implements OnInit {
    data: ArrayingItem[] = [];
    // 定义查询参数
    queryParams: any = {
        page: 1,
        search_key: 'factory_name',
        search_value: '',
    };
    controllShow: boolean = true;
    constructor(
        private router: Router,
        private arraying: ArrayingService,
        private es: PageEffectService,
        private activatedRoute: ActivatedRoute,
    ) {}
    gotoStayList() {
        this.router.navigate(['/arraying-container']);
    }
    gotoDoneList() {
        this.router.navigate(['/done-array-list']);
    }
    gotoInstalledCabinets() {
        this.router.navigate(['/installed-cabinets']);
    }
    ngOnInit() {
        this.activatedRoute.url.subscribe(res => {
            this.init();
        });
    }
    handler() {
        console.log(this.queryParams);
        // 发送请求请求数据 把请求到的数据覆盖渲染数据  为了避免多次发送请求  需要做防抖的处理
        this.arraying.getFinalData(this.queryParams).subscribe(res => {
            if (res.status === 1) {
                // 把数据结构出来赋值
                const { data } = res;
                this.data = data.data;
                console.log(data);
                console.log(res);
            } else {
                this.es.showToast({
                    message: '请求数据失败',
                });
            }
        });
    }
    // 初始化数据
    init() {
        this.arraying.getFinalData(this.queryParams).subscribe(res => {
            if (res.status === 1) {
                // 把数据结构出来赋值
                const { data } = res;
                this.data = data.data;
                console.log(data);
                console.log(res);
            } else {
                this.es.showToast({
                    message: '请求数据失败',
                });
            }
        });
    }
    // 撤销
    onRemove(item: any) {
        console.log(item.name);
        const params = {
            name: item.name,
        };
        this.alertTest(params);
    }
    alertTest(data: any) {
        this.es.showAlert({
            message: '确定要撤销吗?',
            buttons: [
                {
                    text: '确定',
                    handler: () => {
                        this.arraying.postRevocationFinalCabnets(data).subscribe(res => {
                            if (res.status === 1) {
                                this.es.showToast({
                                    message: res.message,
                                });
                                setTimeout(() => {
                                    this.init();
                                }, 1000);
                            } else {
                                this.es.showToast({
                                    message: res.message,
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
        console.log(item);
        console.log(item1);
        const currentObj = {
            currentItem: item1,
            name: item.name,
            shipping_room: item.shipping_room,
            estimate_loading_time: item.estimate_loading_time,
            bl_no: item.bl_no,
            container_no: item.container_no,
            seal_no: item.seal_no,
            truely_loading_time: item.truely_loading_time,
            on_board_date: item.on_board_date,
            estimated_arrival_time: item.estimated_arrival_time,
        };
        // const currentData=_.cloneDeep(currentObj)
        currentObj.currentItem = JSON.stringify(currentObj.currentItem);
        this.router.navigate(['/final-cabinets-details'], { queryParams: currentObj });
    }

    loadData(event) {
        this.controllShow = true;
        this.queryParams.page++;
        this.arraying.getFinalData(this.queryParams).subscribe(res => {
            console.log(res);
            console.log(this.queryParams.page);
            console.log(res.data);

            if (res.data.length == 0) {
                this.controllShow = false;
            }
            if (res.data && res.data.length) {
                this.data = this.data.concat(res.data);
            } else {
                this.queryParams.page--;
                this.es.showToast({
                    message: '别刷了，没有数据啦！',
                    color: 'danger',
                });
            }
            event.target.complete();
        });
    }
}
