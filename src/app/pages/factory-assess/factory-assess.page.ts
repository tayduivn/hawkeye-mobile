import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-factory-assess',
    templateUrl: './factory-assess.page.html',
    styleUrls: ['./factory-assess.page.scss'],
})
export class FactoryAssessPage implements OnInit {
    constructor(private router:Router) {}
    btnItemClicked(item: any) {
        console.log(item);
        if(item==='待评估'){
          // 跳转路由  传入当前的id等数据在另一边进行提交  注入路由服务
          this.router.navigate(['/assess-details'])
        }
    }
    ngOnInit() {}
}
