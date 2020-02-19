import { Observable } from 'rxjs';
import { InspectEvaluateService, InspectAppraisementItem } from './../../services/inspect-evaluate.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { StorageService } from '../../services/storage.service';

@Component({
    selector: 'app-evaluate',
    templateUrl: './evaluate.page.html',
    styleUrls: ['./evaluate.page.scss'],
})
export class EvaluatePage implements OnInit {
    list: Observable<InspectAppraisementItem[]>
    listLength: number
    constructor(private router: Router,
                private storage:StorageService,
                private InspectEval:InspectEvaluateService) {}

    ngOnInit() {
        this.list = this.InspectEval.getEvaluateList().pipe(map((res:any) => res.data))
        this.list.subscribe(res => {
            this.listLength = res.length?res.length:0
        })
    }

    toDetail(p: any){
        this.router.navigate(['/evaluate/detail',p.inspection_appraisement_id?p.inspection_appraisement_id:'000',p.apply_inspection_id])
        this.storage.set('EVALUATE_DETAIL_SKU', p.sku)
    }
}
