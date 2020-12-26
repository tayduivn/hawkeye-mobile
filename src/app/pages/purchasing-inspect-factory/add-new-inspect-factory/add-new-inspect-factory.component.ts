import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ResolveEnd, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { TabStatusService } from '../tab-status.service';
import { EmitService } from './emit.service';

@Component({
    selector: 'app-add-new-inspect-factory',
    templateUrl: './add-new-inspect-factory.component.html',
    styleUrls: ['./add-new-inspect-factory.component.scss'],
})
export class AddNewInspectFactoryComponent implements OnInit {
    activeIndex: any = 0;
    flag: Boolean = true;
    // 控制禁用还是不禁用  1代表禁用回填  0代表不做操作 2代表回填不禁用
    flag1: number;
    //   IOC  依赖注入  控制反转   VueX  private insCtrl: InspectionService
    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private route: Router,
        private tab: TabStatusService,
        private infoCtrl: EmitService,
    ) {}
    ngOnInit() {
        this.getInitQueryParams();
        this.activatedRoute.url.subscribe(res => {
            this.activeIndex = window.sessionStorage.getItem('index')
                ? (window.sessionStorage.getItem('index') as any) - 0
                : 0;
        });
        // window.sessionStorage.setItem('index', '0');
        // 在这里进行订阅流（服务）那边发送服务  这边订阅服务;
        this.tab.canClick$.subscribe(res => {
            // 如果res时true则允许切换
            this.flag = res;
        });
    }
    getInitQueryParams() {
        this.activatedRoute.queryParams.subscribe(queryParam => {
            const { flag } = queryParam;
            console.log(flag);
            this.flag1 = flag;
            // 这里面的flag的值代表的是是从哪里进来的  应该调用哪一个接口  从详情和编辑过来的  就获取数据  然后定义一个变量保存起来传递给几个子组件，子组件回填  如果是新增进来的  那么就什么也不传
        });
    }
    tabsItemClicked(i: any) {
        setTimeout(() => {
            if (this.flag) {
                this.activeIndex = i;
                window.sessionStorage.setItem('index', `${i}`);
            }
        }, 0);
    }
    ngAfterViewInit() {}

    ngOnDestroy() {
        window.sessionStorage.setItem('index', '0');
    }
    // 在这个页面可以获取到所有的信息  所有的信息获取到后路由跳转的时候传到子组件
    getData() {}

    saveInformation() {
        this.infoCtrl.info$.next('这是头部的信息');
    }
}
