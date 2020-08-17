import { Component, OnInit } from '@angular/core';
import { UploadQueueService } from '../upload-queue.service';
import { PageEffectService } from 'src/app/services/page-effect.service';
import { QueueComponent } from '../queue/queue.component';

@Component({
  selector: 'app-inspect-parts',
  templateUrl: './inspect-parts.component.html',
  styleUrls: ['./inspect-parts.component.scss'],
})
export class InspectPartsComponent implements OnInit {

  constructor(private uQueue: UploadQueueService,private es: PageEffectService) { }

  alreadyUpProgress: boolean = this.uQueue.alreadyUpProgress;
  showModal() {
      this.es.showModal({
          component: QueueComponent,
      });
      this.uQueue.alreadyUpProgress = true;
  }
  ngOnInit() {}

  descEnter(e: string[], type: string, boxType: 'inner' | 'outer') {
   
  }

}
