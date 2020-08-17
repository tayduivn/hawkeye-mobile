import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { InspectionService } from 'src/app/services/inspection.service';
import { environment } from 'src/environments/environment';
import { PageEffectService } from 'src/app/services/page-effect.service';
import { VideoPlayComponent } from 'src/app/widget/video-play/video-play.component';

@Component({
    selector: 'app-feedback',
    templateUrl: './feedback.component.html',
    styleUrls: ['./feedback.component.scss'],
})
export class FeedbackComponent implements OnInit {
    imgOrigin: string = environment.usFileUrl;
    @Input() apply_inspection_no: string;

    @Input() sku: string;

    @Input() contract_no: string;

    data: {
      desc: string;
      review_summary_img: string;
      review_summary_video: string;
    } = {
      desc: '',
      review_summary_img: '',
      review_summary_video: ''
    }
    constructor(private modal: ModalController, private es: PageEffectService, private inspectCtrl: InspectionService) {}

    ngOnInit() {
        this.inspectCtrl.getReworkTaskContent({
            apply_inspection_no: this.apply_inspection_no,
            sku: this.sku,
            contract_no: this.contract_no,
        }).subscribe(res => {
          console.log(res)
          this.data = res.data
        })
    }

    close() {
        this.modal.dismiss();
    }

    play(p: string) {
      this.es.showModal({
          component: VideoPlayComponent,
          componentProps: { source: p },
      });
  }
}
