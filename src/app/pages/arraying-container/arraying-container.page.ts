import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { tap, map } from 'rxjs/operators';
import { ArrayingService } from 'src/app/services/arraying.service';
// 依赖注入
import { PageEffectService } from 'src/app/services/page-effect.service';
import { AlertStatisticsModalComponent } from './alert-statistics-modal/alert-statistics-modal.component';
@Component({
    selector: 'app-arraying-container',
    templateUrl: './arraying-container.page.html',
    styleUrls: ['./arraying-container.page.scss'],
})
export class ArrayingContainerPage implements OnInit {
    arrayingList: any[] = [];
    isAllDisplayDataChecked: boolean = false;
    mapOfCheckedId: { [key: number]: boolean } = {};
    checkedboxArray: any[] = [];
    countData: any = {
        arraying_container_sku_arr: [],
    };
    queryInfo: any = {
        page: 1,
    };
    constructor(
        private arraying: ArrayingService,
        private router: Router,
        private es: PageEffectService,
        private activatedRoute: ActivatedRoute,
    ) {}
    ngOnInit() {
        this.activatedRoute.url.subscribe(res => {
            window.localStorage.setItem('isPai', null);
            this.init();
            this.isAllDisplayDataChecked = false;
        });
    }
    get rowIsSelected() {
        let val = false;
        for (const key in this.mapOfCheckedId) {
            if (this.mapOfCheckedId.hasOwnProperty(key)) {
                this.mapOfCheckedId[key] && (val = this.mapOfCheckedId[key]);
            }
        }
        return val;
    }

    get skuIds(): Array<{ arraying_container_num: number; id: number }> {
        let ids: string[] = [];
        let val: Array<{ arraying_container_num: number; id: number }> = [];
        for (const key in this.mapOfCheckedId) {
            if (this.mapOfCheckedId.hasOwnProperty(key)) {
                this.mapOfCheckedId[key] && ids.push(key);
            }
        }

        this.arrayingList.forEach(res => {
            if (ids.indexOf(String(res.id)) != -1) {
                val.push({
                    arraying_container_num: (res as any).arraying_container_num,
                    id: res.id,
                });
            }
        });
        return val;
    }

    init() {
        this.arraying
            .getWaitingContainerData(this.queryInfo)
            .pipe(
                tap(res => {
                    console.log(res);
                }),
                map(res => res.data),
            )
            .subscribe(res => {
                this.arrayingList = res;
                // console.log(res);
                res.map(sku => {
                    console.log(sku.id);

                    this.mapOfCheckedId[sku.id] = false;
                });
            });
    }

    onBlur(e: Event, data: any) {
        console.log('xian');
        console.log((e.target as any).value - 0);
        console.log(this.mapOfCheckedId[data.id]);
        if ((e.target as any).value - 0 > data.able_container_num) {
            this.es.showToast({
                color: 'danger',
                duration: 2000,
                message: '不能大于最大排柜数量，请重试',
            });
            window.localStorage.setItem('isPai', 'big');
            (e.target as any).value = '';
        } else if (data.arraying_container_num <= 0) {
            this.es.showToast({
                color: 'danger',
                duration: 2000,
                message: '输入的数量必须大于0',
            });
            (e.target as any).value = '';
            window.localStorage.setItem('isPai', 'No0');
        } else if (Math.round(data.arraying_container_num) !== data.arraying_container_num) {
            this.es.showToast({
                color: 'danger',
                duration: 2000,
                message: '输入的数量必须是整数',
            });
            (e.target as any).value = '';
            window.localStorage.setItem('isPai', 'NoZ');
        } else {
            window.localStorage.setItem('isPai', null);
            
            setTimeout(() => {
                if (!this.mapOfCheckedId[data.id]) {
                    (e.target as any).value = '';
                }
            }, 0);
        }
    }

    checkAll() {
        for (const key in this.mapOfCheckedId) {
            if (this.mapOfCheckedId.hasOwnProperty(key)) {
                this.mapOfCheckedId[key] = this.isAllDisplayDataChecked;
            }
        }
    }

    gotoDoneList() {
        this.router.navigate(['/done-array-list']);
    }
    gotoInstalledCabinets() {
        this.router.navigate(['/installed-cabinets']);
    }
    gotoFinalCabinets() {
        this.router.navigate(['/final-cabinets']);
    }
    gotoDetails(id: number) {
        // 查找符合条件的项传过去
        const item = this.arrayingList.find(item => item.id === id);
        item && this.router.navigate(['/list-detail'], { queryParams: item });
    }
    onSort() {
        console.log('hou');
        const result = window.localStorage.getItem('isPai');
        if (result === 'big') {
            this.es.showToast({
                color: 'danger',
                duration: 2000,
                message: '不能大于最大排柜数量，请重试',
            });
            window.localStorage.setItem('isPai', null);
            return;
        } else if (result === 'No0') {
            this.es.showToast({
                color: 'danger',
                duration: 2000,
                message: '请输入合法的排柜数量',
            });
            window.localStorage.setItem('isPai', null);
            return;
        } else if (result === 'NoZ') {
            this.es.showToast({
                color: 'danger',
                duration: 2000,
                message: '输入的数量必须是整数',
            });
            window.localStorage.setItem('isPai', null);
            return;
        }
        // 点击的时候先判断输入数字没有
        console.log(this.mapOfCheckedId);
        this.checkedboxArray = [];
        for (let key in this.mapOfCheckedId) {
            if (this.mapOfCheckedId[key]) {
                this.checkedboxArray.push(key);
            }
        }
        console.log(this.checkedboxArray);

        const flag = this.checkedboxArray.some(key => {
            const item = this.arrayingList.find(item => item.id + '' === key);
            if (!item.arraying_container_num) {
                this.es.showToast({
                    message: '请输入合法的排柜数量',
                    duration: 2000,
                    color: 'danger',
                });
                return true;
            }
        });
        if (!flag) {
            this.countData.arraying_container_sku_arr = [];
            this.checkedboxArray.forEach(key => {
                const item = this.arrayingList.find(item => item.id + '' === key);
                this.countData.arraying_container_sku_arr.push({
                    arraying_container_num: item.arraying_container_num,
                    id: key - 0,
                });
            });
            this.checkedboxArray = [];
            console.log(this.countData);
            // 点击排柜弹出弹出层  渲染数据
            this.arraying.getCountData(this.countData).subscribe(res => {
                if (res.status === 1) {
                    const { data } = res;
                    this.onShowModal(data);
                }
            });
        }
    }
    // 显示弹出层
    onShowModal(obj: any) {
        // 展示弹出层之前获取要传递过去的数据
        this.es.showModal(
            {
                component: AlertStatisticsModalComponent,
                componentProps: {
                    data: obj,
                },
            },
            res => {
                // 关闭的回调函数
                console.log(res);
                if (res === 'submit') {
                    // 开始排柜
                    this.arraying.postContainerData(this.skuIds).subscribe(res => {
                        this.es.showToast({
                            color: 'success',
                            duration: 2000,
                            message: res.message,
                        });
                        setTimeout(() => {
                            this.router.navigate(['/arraying-container/done-array-list']);
                            window.localStorage.setItem('active', '1');
                        }, 1500);
                    });
                }
            },
        );
    }

    loadData(event) {
        this.queryInfo.page++;
        this.arraying.getWaitingContainerData(this.queryInfo).subscribe(res => {
            if (res.data && res.data.length) {
                this.arrayingList = this.arrayingList.concat(res.data);
            } else {
                this.queryInfo.page--;
                this.es.showToast({
                    message: '别刷了，没有数据啦！',
                    color: 'danger',
                    duration: 2000,
                });
            }
            event.target.complete();
        });
    }

    onclick(bool: boolean) {
        console.log(bool);
        if (!bool) {
            this.es.showToast({
                color: 'danger',
                duration: 2000,
                message: '请先勾选复选框再输入排柜数量',
            });
        }
    }
}
