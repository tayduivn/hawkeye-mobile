import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InspectionService } from 'src/app/services/inspection.service';
import { StorageService } from 'src/app/services/storage.service';
import { PageEffectService } from 'src/app/services/page-effect.service';

@Component({
    selector: 'app-rework-inspect',
    templateUrl: './rework-inspect.page.html',
    styleUrls: ['./rework-inspect.page.scss'],
})
export class ReworkInspectPage implements OnInit {
    getListParams: any = {
        keywords: 'factory_name',
        value: '',
        page: 1,
    };
    metaInspectTask: any[] = [];
    task: any[] = [];
    inspectTask: any[] = [];
    constructor(
      private router: Router,
      private inspectService: InspectionService,
      private storage: StorageService,
      private effectCtrl: PageEffectService
    ) {}

    ngOnInit() {}

    ionViewWillEnter() {
        this.getListParams.page = 1;
        this.inspectService.getReworkInspectList(this.getListParams).subscribe(res => {
            this.metaInspectTask = res.data;
            this.inspectTask = JSON.parse(JSON.stringify(res.data));
            this.task = res;
            this.getListParams.page = res.current_page + 1;
            this.storage.set('IMPLEMENT-INSPECTION-META-DATA', this.inspectTask);
        });
    }

    factoryChange() { 
        this.getListParams.page = 1;
        this.inspectService.getReworkInspectList(this.getListParams).subscribe(res => {
            if (res.data && res.data.length) {
                this.inspectTask = res.data;
                this.getListParams.page = res.current_page + 1;
                this.storage.set('IMPLEMENT-INSPECTION-META-DATA', this.inspectTask);
            } else {
                this.inspectTask = [];
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
