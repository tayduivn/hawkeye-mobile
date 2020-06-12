import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DownloadQueueService, DownPayload } from '../download-queue.service';

@Component({
    selector: 'app-queue',
    templateUrl: './queue.component.html',
    styleUrls: ['./queue.component.scss'],
})
export class QueueComponent implements OnInit {
    queue: Array<DownPayload> = []
    constructor(private modal: ModalController, private dQueue: DownloadQueueService) {
      this.queue = dQueue.queue
    }
    ary: DownPayload[] = [
        {
            type: 'video',
            size: 1,
        },
        {
            type: 'video',
            size: 2,
        },
        {
            type: 'video',
            size: 3,
        },
        {
            type: 'video',
            size: 4,
        },
    ];
    close() {
        this.modal.dismiss();
    }

    ngOnInit() {
        this.ary.map(res => this.dQueue.push(res));
        this.dQueue.push({
          type:'img',
          size:333
        })
       
        console.log(this.dQueue.queue);
    }
}
