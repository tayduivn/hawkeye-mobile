import { Component, OnInit } from '@angular/core';
import { FeedbackComponent } from '../feedback/feedback.component';
import { PageEffectService } from 'src/app/services/page-effect.service';
import { ActivatedRoute } from '@angular/router';
import { ReworkService, ReworkContract } from '../rework.service';

@Component({
    selector: 'app-inspect-po',
    templateUrl: './inspect-po.component.html',
    styleUrls: ['./inspect-po.component.scss'],
})
export class InspectPoComponent implements OnInit {
    factory_name = '天府三街新希望国际';
    list: Array<ReworkContract> = [];
    apply_inspect_no = ""
    constructor(private es: PageEffectService, router: ActivatedRoute, private reworkCtrl: ReworkService) {
        router.params.subscribe(res => {
            this.apply_inspect_no = res.factory_id;
            this.getData()            
        });
    }

    ngOnInit() {}

    feedback(p: any, sku: any) {
        this.es.showModal({
            component: FeedbackComponent,
            componentProps: { apply_inspection_no: this.apply_inspect_no, sku: sku.sku, contract_no: p.contract_no },
        });
    }

    getData(){
      this.reworkCtrl.getReworkContractForApplyId(this.apply_inspect_no)
          .subscribe(res => {
            this.list = res.data;
          })
    }

}
