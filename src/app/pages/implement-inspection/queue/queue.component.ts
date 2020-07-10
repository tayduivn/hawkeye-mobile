import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { QueueNode, UploadQueueService } from '../upload-queue.service';
import { InspectField } from '../class';
import { Subscription } from 'rxjs';
import { Network } from '@ionic-native/network/ngx';
import { PageEffectService } from 'src/app/services/page-effect.service';

@Component({
    selector: 'app-queue',
    templateUrl: './queue.component.html',
    styleUrls: ['./queue.component.scss'],
    changeDetection: ChangeDetectionStrategy.Default
})
export class QueueComponent implements OnInit {
    uploadStatus: 'uploading' | 'uploaded' = 'uploading';
    queue: Array<QueueNode<any>> = [];
    inspectFieldMap: any = InspectField;
    destroy: boolean = false;
    isSuspend: boolean = false;
    statusSub: Subscription = null;
    alreadyUploadQueue: Array<QueueNode<any>> = []; //已上传的项目
    constructor(
        private modal: ModalController,
        public uQueue: UploadQueueService,
        private ref: ChangeDetectorRef,
        private network: Network,
        private es: PageEffectService,
    ) {
        this.queue = uQueue.queue;
        this.alreadyUploadQueue = uQueue.alreadyUploadQueue;
        this.statusSub = uQueue.onChangeUploadStatus.subscribe(res => {
            this.queue = uQueue.queue;
            this.alreadyUploadQueue = uQueue.alreadyUploadQueue;
            this.isSuspend = res;
        });
        //网络变化的时候触发
        network.onChange().subscribe(res => {
            let msg: string = '',
                color: string = 'success';
            if (!this.queue || !this.queue.length) return;
          
            switch (network.type) {
                case '2g':
                    msg = `当前网络环境为2g,系统判定暂停上传任务。`;
                    color = 'warning';
                    document.getElementById('suspend').click();
                    break;
                case '3g':
                    msg = `当前网络环境为3g,系统判定暂停上传任务。`;
                    color = 'warning';
                    document.getElementById('suspend').click();
                    break;
                case '4g':
                    msg = `当前网络环境为4g,上传任务自动进行。`;
                    color = 'success';
                    document.getElementById('restart').click();
                    this.queue = uQueue.queue;
                    break;
                case 'wifi':
                    msg = `当前网络环境为wifi,上传任务自动进行。`;
                    color = 'success';
                    document.getElementById('restart').click();
                    this.queue = uQueue.queue;
                    break;
                default: {
                    msg = `当前没有网络连接,系统暂停上传任务。`;
                    color = 'danger';
                    document.getElementById('suspend').click();
                }
            }
            this.es.showToast({
                message: msg,
                color: color,
            });
        });
    }

    close() {
        this.modal.dismiss();
        this.uQueue.alreadyUpProgress = false;
    }

    ngOnInit() {
    }

    async upload() {}

    segmentChanged(e: Event): void {}

    ngDestroy() {
        this.destroy = true;
        this.statusSub.unsubscribe();
    }
}
