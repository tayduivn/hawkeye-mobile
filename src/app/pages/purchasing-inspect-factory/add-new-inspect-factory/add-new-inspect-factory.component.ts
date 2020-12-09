import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ResolveEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { TabStatusService } from '../tab-status.service';
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
    ) {}
    ngOnInit() {
        this.getInitQueryParams();
        this.activatedRoute.url.subscribe(res => {
            this.activeIndex = window.localStorage.getItem('index')
                ? (window.localStorage.getItem('index') as any) - 0
                : 0;
        });
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
        });
    }
    tabsItemClicked(i: any) {
        setTimeout(() => {
            if (this.flag) {
                this.activeIndex = i;
                window.localStorage.setItem('index', `${i}`);
                // console.log(this.activeIndex);
            }
        }, 0);
    }
    ngAfterViewInit() {}
    ngOnDestroy() {
        window.localStorage.setItem('index', '0');
    }
    // 在这个页面可以获取到所有的信息  所有的信息获取到后路由跳转的时候传到子组件
    getData() {}
}
