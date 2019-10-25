import { PageEffectService } from 'src/app/services/page-effect.service';
import { StorageService } from 'src/app/services/storage.service';
import { Sku } from './../../../widget/sku-info/sku-info.component';
import { Component, OnInit } from '@angular/core';
import { InspectTask } from '../inspect-contract/inspect-contract.page';
import { Router } from '@angular/router';
import { ModalOptions } from '@ionic/core';
import { InspectSettingBoxComponent } from 'src/app/widget/inspect-setting-box/inspect-setting-box.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-sku-description',
  templateUrl: './sku-description.component.html',
  styleUrls: ['./sku-description.component.scss'],
})
export class SkuDescriptionComponent implements OnInit {
  data:InspectTask

  constructor(private storage:StorageService,private router:Router,private effectCtrl:PageEffectService) { }
  imgOrigin: string = environment.fileUrlPath;
  ngOnInit() {
    this.data = this.storage.get('CURRENT_INSPECT_CONTRACT')
  }

  toSkuDetail(p:Sku){
    this.storage.set('SKU_INFO',p)
    this.router.navigate(['sku-detail'])
  }

  inspectOp(p:Sku,i:number) {
    let option: ModalOptions = {
      component: InspectSettingBoxComponent,
      cssClass: "custom-modal-sku",
      mode: "ios",
      componentProps: { contract: p,type:'skuList' }
    };

    this.effectCtrl.showModal(option, (data: any) => {
      this.data.sku_desc[i] = data
      console.log(data);
    });
  }
}
