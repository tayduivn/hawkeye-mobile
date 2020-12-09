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
        // 如果没有任何的标志位那么就不回填不禁用
        this.router.navigate(['/add-new-inspect-factory'], { queryParams: { flag: 0 } });
    }
    // 跳转详情页，信息自动回填且不可编辑
    gotoDetails() {
        // 跳转详情页的时候携带一个特定的标志位  在另一个页面一加载的时候判断是否有这个标志位  有标志位那么就禁用所有的表单且回填信息
        this.router.navigate(['/add-new-inspect-factory'], { queryParams: { flag: 1 } });
    }
    // 跳转编辑页面，信息自动回填且可编辑
    gotoCompile() {
        // 跳转编辑的时候携带一个特定的标志位  在另一个页面一加载的时候判断是否有这个标志位  有标志位那么就回填信息但是可以编辑
        this.router.navigate(['/add-new-inspect-factory'], { queryParams: { flag: 2 } });
    }
}
