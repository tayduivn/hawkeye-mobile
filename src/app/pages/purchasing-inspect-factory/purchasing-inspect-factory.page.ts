import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FactoryListQueryInfo, inspectingService } from 'src/app/services/inspecting.service';
import { PageEffectService } from 'src/app/services/page-effect.service';
import _ from 'loadsh';
import { FlahListService } from './add-new-inspect-factory/flah-list.service';
import { takeWhile } from 'rxjs/operators';
@Component({
    selector: 'app-purchasing-inspect-factory',
    templateUrl: './purchasing-inspect-factory.page.html',
    styleUrls: ['./purchasing-inspect-factory.page.scss'],
})
export class PurchasingInspectFactoryPage implements OnInit {
    // 查询参数
    queryInfo: FactoryListQueryInfo = {
        page: 1,
        paginate: 25,
    };
    searchQueryInfo: FactoryListQueryInfo = {
        name: null,
    };
    factoryList: any[] = [];
    constructor(
        private router: Router,
        private acRoute: ActivatedRoute,
        private inspecting: inspectingService,
        private es: PageEffectService,
        private flash: FlahListService,
    ) {}
    destroy: boolean = false;

    ngOnInit() {
        // 一开始就获取列表获取到的列表进行渲染
        // this.getList(this.queryInfo);
        // this.flash.flash$.subscribe(res => {
        //     if (res == 'flash') {
        //         console.log('主页面刷新了');
        //         this.getList(this.queryInfo);
        //     }
        // });

        this.acRoute.url.subscribe(res => {
            if (res[0].path === 'purchasing-factory') {
                this.getList(this.queryInfo);
            }
            console.error(res);
        });
    }

    // dest:boolean=false
    // 获取列表
    getList(params: FactoryListQueryInfo) {
        this.inspecting.getFactoryList(params).subscribe(res => {
            console.log(res);

            if (res.status !== 1)
                return this.es.showToast({
                    message: res.message,
                    color: 'danger',
                    duration: 1500,
                });
            // 解构出数据
            const { data } = res;
            console.log(data);
            // 工厂列表
            this.factoryList = data.factory;
        });
    }
    ngOnDestroy(): void {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.
        console.log('purchasing销毁');
        this.destroy = true;
    }
    // 跳转新增页面，信息不回填
    toAddNew() {
        // 如果没有任何的标志位那么就不回填不禁用
        this.router.navigate(['/add-new-inspect-factory'], { queryParams: { flag: 0 } });
    }
    // 跳转详情页，信息自动回填且不可编辑
    gotoDetails(id: number) {
        this.getFactoryDetails(
            {
                factory_id: id,
            },
            1,
        );
    }
    // 跳转编辑页面，信息自动回填且可编辑
    gotoCompile(id: number, item: any) {
        console.log(item);
        if (item.hava_evaluate == '1') {
            return this.es.showToast({
                message: '工厂已评估，不可修改！',
                color: 'danger',
                duration: 1500,
            });
        }
        // 跳转编辑的时候携带一个特定的标志位  在另一个页面一加载的时候判断是否有这个标志位  有标志位那么就回填信息但是可以编辑
        this.getFactoryDetails(
            {
                factory_id: id,
            },
            2,
        );
    }
    // 输入框产生变化的时候  调用接口合并查询参数
    handlerSearch(): void {
        const QUERY = _.cloneDeep(this.queryInfo);
        const SEARCH = _.cloneDeep(this.searchQueryInfo);
        const NEWOBJ = Object.assign(QUERY, SEARCH);
        this.getList(NEWOBJ);
    }

    getFactoryDetails(params, flag): void {
        if (flag == 1) {
            this.inspecting.getFactoryXQ(params).subscribe(res => {
                // 解构出data数据
                const { data } = res;
                console.log(data);
                const currentObj = _.cloneDeep(data);
                const str = JSON.stringify(currentObj);
                this.router.navigate(['/add-new-inspect-factory'], {
                    queryParams: { flag: 1, details: str },
                });
            });
        } else {
            this.inspecting.getFactoryXQ(params).subscribe(res => {
                // 解构出data数据
                const { data } = res;
                console.log(data);
                const currentObj = _.cloneDeep(data);
                const str = JSON.stringify(currentObj);
                this.router.navigate(['/add-new-inspect-factory'], {
                    queryParams: { flag: 2, details: str, factory_id: params.factory_id },
                });
            });
        }
    }
    loadData(event) {
        this.queryInfo.page++;
        let newObj = {};
        if (Boolean(this.searchQueryInfo.name) == true) {
            // 如果有东西  那么就要和并查询参数
            const QUERY = _.cloneDeep(this.queryInfo);
            const SEARCH = _.cloneDeep(this.searchQueryInfo);
            newObj = Object.assign(QUERY, SEARCH);
        } else {
            newObj = _.cloneDeep(this.queryInfo);
        }
        this.inspecting.getFactoryList(newObj).subscribe(res => {
            console.log(res);
            // 如果还存在data.factory以及res.data.factory.length不等于0  那么就继续拼接获取到的数据
            if (res.data.factory && res.data.factory.length) {
                this.factoryList = this.factoryList.concat(res.data.factory);
                console.log(this.factoryList);
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
