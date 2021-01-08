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
import { inspectingService } from 'src/app/services/inspecting.service';

@Component({
    selector: 'app-video-mini',
    templateUrl: './video-mini.component.html',
    styleUrls: ['./video-mini.component.scss'],
})
export class VideoMiniComponent implements OnInit {
    constructor(
        private ec: PageEffectService,
        private file: File,
        public mediaCapture: MediaCapture,
        private fileChooser: FileChooser,
        private filePath: FilePath,
        private uQueue: UploadQueueService,
        private inspecting: inspectingService,
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
        if (!!input) {
            this._up_data = input;
        }
    }
    @Input() set flagStatus(input: any) {
        if (!!input) {
            this.flagIsStatus = input;
        }
    }
    // 回流的数组
    _up_data: any[] = [];
    flagIsStatus: any;
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
    ngOnDestroy(): void {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.
        window.sessionStorage.setItem('facade_picFalg', '');
        window.sessionStorage.setItem('plant_picFlag', '');
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

    // 删除视频
    remove(i: number) {
        this.ec.showAlert({
            message: '确定要删除吗？',
            buttons: [
                {
                    text: '取消',
                },
                {
                    text: '确定',
                    handler: () => {
                        let params = {
                            apply_inspection_no: this.factory_inspect_no,
                            type: this.type,
                            filename: this._up_data[i],
                        };
                        this.inspecting.deleteVideo(params).subscribe(res => {
                            console.log(res);
                            if (res.status != 1) {
                                return this.ec.showToast({
                                    message: '删除视频失败',
                                    color: 'danger',
                                    duration: 1500,
                                });
                            }
                            this.ec.showToast({
                                message: '删除视频成功',
                                color: 'success',
                                duration: 1500,
                            });
                            // 删除成功后删除渲染的视频
                            this._up_data.splice(i, 1);
                            if (this.type == 'inspect_facade_video') {
                                if (this._up_data.length == 0) {
                                    window.sessionStorage.setItem('facade_picFalg', '');
                                }
                            } else if (this.type == 'inspect_plant_video') {
                                if (this._up_data.length == 0) {
                                    window.sessionStorage.setItem('plant_picFlag', '');
                                }
                            }
                        });
                    },
                },
            ],
        });
    }

    async tape() {
        const mediaFiles = await this.mediaCapture.captureVideo({ limit: 1, quality: 30 });
        if (mediaFiles) {
            // 进来说明拍摄视频了
            this.getFileEntry(mediaFiles[0].fullPath).then(res => {
                this.ec.clearEffectCtrl();
                this.ec.showAlert({
                    message: '获取ArrayBuffer完毕',
                });
                const blob = new Blob([res]);
                if (this.type == 'inspect_facade_video') {
                    window.sessionStorage.setItem('facade_picFalg', '1');
                } else if (this.type == 'inspect_plant_video') {
                    window.sessionStorage.setItem('plant_picFlag', '1');
                }
                let params: any = {
                    type: this.type,
                    factory_inspect_no: this.factory_inspect_no,
                    factory_id: this.factory_id,
                };
                this.uQueue.add(
                    {
                        type: 'video',
                        size: blob.size,
                        blob: blob,
                        payload: params,
                    },
                    UploadVideoNamespace.factory_inspect,
                );
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
            // 进来说明选择文件了
            this.ec.showLoad({
                message: '请耐心等待…',
            });
            this.getFileEntry(url).then(res => {
                this.ec.clearEffectCtrl();
                const blob = new Blob([res]); //拿到文件
                if (this.type == 'inspect_facade_video') {
                    window.sessionStorage.setItem('facade_picFalg', '1');
                } else if (this.type == 'inspect_plant_video') {
                    window.sessionStorage.setItem('plant_picFlag', '1');
                }
                let params: any = {
                    type: this.type,
                    factory_inspect_no: this.factory_inspect_no,
                    factory_id: this.factory_id,
                };

                this.uQueue.add(
                    {
                        type: 'video',
                        size: blob.size,
                        blob: blob,
                        payload: params,
                    },
                    UploadVideoNamespace.factory_inspect,
                );
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
        if (this.type == 'inspect_facade_video') {
            if (this._up_data.length != 0) {
                window.sessionStorage.setItem('facade_picFalg', '1');
            } else {
                window.sessionStorage.setItem('facade_picFalg', '');
            }
        } else if (this.type == 'inspect_plant_video') {
            if (this._up_data.length != 0) {
                window.sessionStorage.setItem('plant_picFlag', '1');
            } else {
                window.sessionStorage.setItem('plant_picFlag', '');
            }
        }

        let that = this;
        console.log(this._up_data);
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
                console.log(that._up_data);
                that._up_data.push((res as any).path);
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
