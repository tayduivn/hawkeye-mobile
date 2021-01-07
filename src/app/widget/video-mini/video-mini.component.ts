import { Component, Input, OnInit } from '@angular/core';
import { PageEffectService } from 'src/app/services/page-effect.service';
import { VideoPlayComponent } from '../video-play/video-play.component';
import { ActionSheetOptions } from '@ionic/core';
import { File } from '@ionic-native/file/ngx';
import { MediaCapture } from '@ionic-native/media-capture/ngx';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { UploadQueueService, UploadVideoNamespace } from 'src/app/pages/implement-inspection/upload-queue.service';
import { filter } from 'rxjs/operators';

@Component({
    selector: 'app-video-mini',
    templateUrl: './video-mini.component.html',
    styleUrls: ['./video-mini.component.scss'],
})
export class VideoMiniComponent implements OnInit {
    // 回流的数组
    _up_data: string[] = [];
    constructor(
        private ec: PageEffectService,
        private file: File,
        public mediaCapture: MediaCapture,
        private fileChooser: FileChooser,
        private filePath: FilePath,
        private uQueue: UploadQueueService,
    ) {}
    @Input() type: string;
    @Input() set apply_inspection(input: string[]) {
        if (!!input) {
            console.log(1);
            this.factory_inspect_no = input;
            console.log(this.factory_inspect_no);
            if (this.factory_inspect_no == undefined) {
                this.flagChoose = false;
            } else {
                this.flagChoose = true;
            }
        }
    }
    @Input() set videos(input: string[]) {
        this._up_data = input;
    }
    factory_id: any;
    factory_inspect_no: any;
    flagChoose: boolean = true;
    // 点击播放的play按钮
    play(p: string) {
        this.ec.showModal({
            component: VideoPlayComponent,
            componentProps: { source: p },
        });
    }

    testHandle(e) {
        const file = e.target.files[0];
        if (this.type == 'inspect_facade_video') {
            window.sessionStorage.setItem('facade_picFalg', '1');
        } else if (this.type == 'inspect_plant_video') {
            window.sessionStorage.setItem('plant_picFlag', '1');
        }
        console.log(file);
        console.log(this.factory_inspect_no);
        console.log(typeof this.factory_inspect_no);
        if (this.factory_inspect_no == undefined) {
            // 如果是undefined 说明是新增的
            console.log(1);
        }
        let params: any = {
            type: this.type,
            factory_inspect_no: this.factory_inspect_no,
            factory_id: this.factory_id,
        };
        console.log(params);

        this.uQueue.add(
            {
                type: 'video',
                size: file.size,
                blob: file,
                payload: params,
            },
            UploadVideoNamespace.factory_inspect,
        );
    }
    // 拍摄视频
    videotape() {
        if (!this.flagChoose) {
            return this.ec.showToast({
                message: '请先保存工厂信息再上传视频！',
                color: 'danger',
                duration: 1500,
            });
        }
        const option: ActionSheetOptions = {
            header: '上传方式',
            buttons: [
                {
                    text: '录像',
                    role: '',
                    icon: 'camera',
                    handler: () => {
                        this.tape();
                    },
                },
                {
                    text: '选择文件',
                    icon: 'folder',
                    handler: () => {
                        this.fileChoose();
                    },
                },
            ],
            mode: 'ios',
        };
        this.ec.showActionSheet(option);
    }
    testHandleClick() {
        // console.log(1);
        if (!this.flagChoose) {
            return this.ec.showToast({
                message: '请先上传图片或保存工厂信息再上传视频！',
            });
        }
    }
    // 删除视频
    remove() {}

    async tape() {
        const mediaFiles = await this.mediaCapture.captureVideo({ limit: 1, quality: 30 });
        if (mediaFiles) {
            this.getFileEntry(mediaFiles[0].fullPath).then(res => {
                this.ec.clearEffectCtrl();
                this.ec.showAlert({
                    message: '获取ArrayBuffer完毕',
                });
                const blob = new Blob([res]);

                let params: any = {
                    type: this.type,
                    factory_inspect_no: this.factory_inspect_no,
                    factory_id: this.factory_id,
                };

                this.uQueue.add({
                    type: 'video',
                    size: blob.size,
                    blob: blob,
                    payload: params,
                });
            });
        } else {
            this.ec.showToast({
                message: '没有拍摄视频',
                color: 'danger',
            });
        }
    }

    async fileChoose() {
        const uri = await this.fileChooser.open({ mime: 'video/mp4' });
        const url = await this.filePath.resolveNativePath(uri);
        if (url && uri) {
            this.ec.showLoad({
                message: '请耐心等待…',
            });
            this.getFileEntry(url).then(res => {
                this.ec.clearEffectCtrl();
                const blob = new Blob([res]);
                let params: any = {
                    type: this.type,
                    factory_inspect_no: this.factory_inspect_no,
                    factory_id: this.factory_id,
                };

                this.uQueue.add({
                    type: 'video',
                    size: blob.size,
                    blob: blob,
                    payload: params,
                });
            });
        } else {
            this.ec.showToast({
                message: '没有选中文件',
                color: 'danger',
            });
        }
    }
    async getFileEntry(url: string): Promise<any> {
        let dirPath = url.substring(0, url.lastIndexOf('/'));
        let fileName = url.substring(url.lastIndexOf('/') + 1, url.length);
        return await this.file.readAsArrayBuffer(dirPath, fileName);
    }
    ngOnInit() {
        this.uQueue.alreadyUploadPayload$
            .asObservable()
            .pipe(
                filter(
                    node =>
                        node.type === 'video' &&
                        (node.payload as any).factory_id === this.factory_id &&
                        (node.payload as any).factory_inspect_no === this.factory_inspect_no &&
                        node.payload.type === this.type,
                ),
            )
            .subscribe(res => {
                console.log('----------- 视频路径回流 ----------');
                console.log((res as any).path);

                this._up_data.push((res as any).path);
            });

        if (
            this.type == 'inspect_facade_video' ||
            this.type == 'inspect_plant_video' ||
            this.type == 'inspect_showroom_video'
        ) {
            console.log('工厂外观照片或生产车间照片或样品间图片');
            this.factory_id = (window.sessionStorage.getItem('FACTORY_ID') as any) - 0;
            this.factory_inspect_no = window.sessionStorage.getItem('inspect_no');
        } else {
            this.factory_id = (window.sessionStorage.getItem('FACTORY_ID') as any) - 0;
            console.log(this.factory_inspect_no);
        }
        if (this.factory_inspect_no == undefined) {
            this.flagChoose = false;
        } else {
            this.flagChoose = true;
        }
    }
}
