import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { inspectingService } from 'src/app/services/inspecting.service';
import { TabStatusService } from '../tab-status.service';
import { EmitService } from './emit.service';
import _ from 'loadsh';
import { PageEffectService } from 'src/app/services/page-effect.service';
import { QueueComponent } from '../../implement-inspection/queue/queue.component';
import { map, mergeAll, mergeMap, switchMap, switchMapTo } from 'rxjs/operators';
import { from, Observable } from 'rxjs';

@Component({
    selector: 'app-add-new-inspect-factory',
    templateUrl: './add-new-inspect-factory.component.html',
    styleUrls: ['./add-new-inspect-factory.component.scss'],
})
export class AddNewInspectFactoryComponent implements OnInit {
    activeIndex: any = 0;
    _flag: boolean = true;
    // 控制禁用还是不禁用  1代表禁用回填  0代表不做操作 2代表回填不禁用
    flag1: number;
    factoryDetails: any = {};
    factoryDetailsStr: string;
    alreadyUpProgress: boolean;
    i: number;
    constructor(
        private activatedRoute: ActivatedRoute,
        private tab: TabStatusService,
        private infoCtrl: EmitService,
        private es: PageEffectService,
        private router: Router,
    ) {}

    get flag() {
        return this._flag;
    }

    set flag(input: boolean) {
        this._flag = input;
    }

    ngOnInit() {
        this.getInitQueryParams();
        this.activatedRoute.url.subscribe(res => {
            this.activeIndex = window.sessionStorage.getItem('index')
                ? (window.sessionStorage.getItem('index') as any) - 0
                : 0;
        });
        window.sessionStorage.setItem('index', '0');
        //在这里进行订阅流（服务）那边发送服务  这边订阅服务;
        this.tab.canClick$.subscribe(res => {
            // 如果res时true则允许切换
            console.log('流');
            this.flag = res;
            if (this.flag) {
                this.activeIndex = this.i;
                window.sessionStorage.setItem('index', `${this.i}`);
            }
        });
    }
    showModal() {
        this.es.showModal({
            component: QueueComponent,
        });
        this.alreadyUpProgress = true;
    }
    getInitQueryParams() {
        this.activatedRoute.queryParams.subscribe(queryParam => {
            console.log(queryParam);
            const { flag, details } = queryParam;
            if (details) {
                //如果是详情和编辑进去的
                this.factoryDetails = _.cloneDeep(JSON.parse(details));
                this.factoryDetailsStr = details;
            } else {
                //如果是新增页面进去的从本地存储获取考察人员的id和名字
                const USER_INFO = window.sessionStorage.getItem('USER_INFO');
                console.log(JSON.parse(USER_INFO));
                this.factoryDetails.user_name = JSON.parse(USER_INFO).name;
                this.factoryDetails.user_id = JSON.parse(USER_INFO).id;
            }

            this.flag1 = flag - 0;
            console.log(this.flag1);

            // 这里面的flag的值代表的是是从哪里进来的  应该调用哪一个接口  从详情和编辑过来的  就获取数据  然后定义一个变量保存起来传递给几个子组件，子组件回填  如果是新增进来的  那么就什么也不传
        });
    }
    tabsItemClicked(i: number, url: string) {
        console.log('点击事件');
        this.i = i;
        this.router.navigate([url], {
            queryParams: { flag: this.flag1, details: this.factoryDetailsStr },
        });
    }
    ngOnDestroy() {
        window.sessionStorage.setItem('index', '0');
        window.sessionStorage.setItem('FACTORY_ID', undefined);
        window.sessionStorage.setItem('inspect_no', undefined);
    }
    // 在这个页面可以获取到所有的信息  所有的信息获取到后路由跳转的时候传到子组件
    saveInformation() {
        const currentObj = _.cloneDeep(this.factoryDetails);
        this.infoCtrl.info$.next(currentObj);
    }
}
