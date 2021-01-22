import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-reimbursement',
    templateUrl: './reimbursement.page.html',
    styleUrls: ['./reimbursement.page.scss'],
})
export class ReimbursementPage implements OnInit {
    constructor(private router: Router) {}

    ngOnInit() {}
    // 查询;
    toSearch(): void {}
    // 新增 add-new-errand-reimbursement
    toAdd(): void {
        this.router.navigate(['/add-new-errand-reimbursement']);
    }
    // 去详情; errand-reimbursement-details
    gotoDetails(): void {
        this.router.navigate(['/errand-reimbursement-details']);
    }
    // 去编辑
    gotoCompile(): void {
        this.router.navigate(['/compile-errand-reimbursement']);
    }
}
