import { PlatformLocation } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ResolveEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

export enum ArrayCabinetMap {
    'done-array-list' = '已排柜',
    'installed-cabinets' = '待装柜',
    'final-cabinets' = '最终列表',
    'arraying-container' = '待排柜',
}
@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
    currentPage: {
        title: string;
        path: string;
    } = {
        title: window.localStorage.getItem('tabName') ? window.localStorage.getItem('tabName') : '待排柜',
        path: '',
    };
    activeIndex: any = window.localStorage.getItem('active') ? (window.localStorage.getItem('active') as any) - 0 : 0;
    destroy: boolean = false;
    pageMap: any = ArrayCabinetMap;
    constructor(
        private route: Router,
        private activatedRoute: ActivatedRoute,
        private platformLocation: PlatformLocation,
    ) {
        route.events.pipe(filter(res => res instanceof ResolveEnd)).subscribe((res: ResolveEnd) => {
            console.log(res);
            switch (res.url) {
                case '/arraying-container/done-array-list':
                    window.localStorage.setItem('tabName', '已排柜');
                    window.localStorage.setItem('active', '1');
                    break;
                case '/arraying-container':
                    window.localStorage.setItem('tabName', '待排柜');
                    window.localStorage.setItem('active', '0');
                    break;
                case '/arraying-container/installed-cabinets':
                    window.localStorage.setItem('tabName', '待装柜');
                    window.localStorage.setItem('active', '2');
                    break;
                case '/arraying-container/final-cabinets':
                    window.localStorage.setItem('tabName', '最终列表');
                    window.localStorage.setItem('active', '3');
                    break;
            }
            this.currentPage = {
                path: res.url,
                title: this.pageMap[res.url.substr(res.url.lastIndexOf('/') + 1, res.url.length - 1)],
            };
        });
    }
    activeChange(index: any) {
        window.localStorage.setItem('active', `${index}`);
    }
    ngOnDestroy(): void {
        this.destroy = !this.destroy;
    }
    ngOnInit() {
        if (
            this.platformLocation.href.split('/')[this.platformLocation.href.split('/').length - 1] ===
            'arraying-container'
        ) {
            window.localStorage.setItem('tabName', '待排柜');
            window.localStorage.setItem('active', '0');
        }
        this.activatedRoute.url.subscribe(res => {
            this.activeIndex = window.localStorage.getItem('active')
                ? (window.localStorage.getItem('active') as any) - 0
                : 0;
        });
    }
}
