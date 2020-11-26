import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InspectionService } from 'src/app/services/inspection.service';
import { StorageService } from 'src/app/services/storage.service';
import { PageEffectService } from 'src/app/services/page-effect.service';
import { ReworkService } from './rework.service';

@Component({
    selector: 'app-rework-inspect',
    templateUrl: './rework-inspect.page.html',
    styleUrls: ['./rework-inspect.page.scss'],
})
export class ReworkInspectPage implements OnInit {
    getListParams: any = {
        keywords: 'factory_name',
        value: '',
    };
    metaInspectTask: any[] = [];
    task: any[] = [];
    inspectTask: any[] = [];
    constructor(
      private router: Router,
      private inspectService: InspectionService,
      private storage: StorageService,
      private effectCtrl: PageEffectService,
      private reworkCtrl: ReworkService
    ) {}

    ngOnInit() {}

    ionViewWillEnter() {
        this.reworkCtrl.getReworkFactoryList()
            .subscribe(res => {
                this.metaInspectTask = res.data
                this.inspectTask = JSON.parse(JSON.stringify(res.data));
                console.log(res)
            })
    }

    factoryChange() { 
        this.reworkCtrl.getReworkFactoryList(this.getListParams).subscribe(res => {
            if (res.data && res.data.length) {
                this.metaInspectTask = res.data
                this.inspectTask = JSON.parse(JSON.stringify(res.data));
            } else {
                this.metaInspectTask = this.inspectTask = [];
            }
        });
    }

    toInspect(contractNo: string, inspectId: string) {
        console.log(contractNo, inspectId);
        this.router.navigate(['/inspect-factory', contractNo, inspectId]);
    }
    
    loadData(event) { 
      this.inspectService.getReworkInspectList(this.getListParams).subscribe(res => {
          if (res.data && res.data.length) {
              this.inspectTask = this.inspectTask.concat(res.data);
              this.getListParams.page = res.current_page + 1;
              this.storage.set('IMPLEMENT-INSPECTION-META-DATA', this.inspectTask);
          } else {
              this.effectCtrl.showToast({
                  message: '别刷了，没有数据啦！',
                  color: 'danger',
              });
          }
          event.target.complete();
      });
  }
}
