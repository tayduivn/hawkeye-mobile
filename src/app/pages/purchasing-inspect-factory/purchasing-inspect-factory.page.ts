import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
    selector: 'app-purchasing-inspect-factory',
    templateUrl: './purchasing-inspect-factory.page.html',
    styleUrls: ['./purchasing-inspect-factory.page.scss'],
})
export class PurchasingInspectFactoryPage implements OnInit {
    constructor(private router: Router) {}
    ngOnInit() {}
    // 跳转新增页面，信息部回填
    toAddNew() {
        this.router.navigate(['/add-new-inspect-factory']);
    }
    // 跳转详情页，信息自动回填且不可编辑
    gotoDetails() {
        this.router.navigate(['/add-new-inspect-factory']);
    }
    // 跳转编辑页面，信息自动回填且可编辑
    gotoCompile() {
        this.router.navigate(['/add-new-inspect-factory']);
    }
}
