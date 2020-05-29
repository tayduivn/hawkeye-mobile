import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { PageEffectService } from 'src/app/services/page-effect.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MediaCapture, MediaFile } from '@ionic-native/media-capture/ngx';
import { ActionSheetOptions } from '@ionic/core';
import { FilePath } from '@ionic-native/file-path/ngx';
import { VideoPlayComponent } from '../video-play/video-play.component';
import { ImplementInspectService } from 'src/app/services/implement-inspect.service';
import { File } from '@ionic-native/file/ngx';
import { Chunk, FileChunkService } from 'src/app/blue-bird/service/file-chunk.service';
import { RequestService } from 'src/app/blue-bird/service/request.service';
import { FileHashService } from 'src/app/blue-bird/service/file-hash.service';
import { UserInfoService } from 'src/app/services/user-info.service';
import { Observable } from 'rxjs';
import { HttpService } from '../../services/http.service';
import { environment } from 'src/environments/environment';

export type FieldType =
    | 'throw_box_video'
    | 'appearance_video'
    | 'functions_video'
    | 'bearing_test_video'
    | 'water_content_test_video'
    | 'factory_sample_room'
    | 'factory_other'
    | 'gross_weight_pic'
    | 'throw_box'
    | 'size_pic'
    | 'packing_pic'
    | 'product_place_pic'
    | 'instructions_and_accessories_pic'
    | 'over_all_pic'
    | 'net_weight_pic'
    | 'bearing_test_pic'
    | 'water_content_test_pic'
    | 'inspection_complete_pic'
    | 'contract_sku_pic'
    | 'factory_environment_pic'
    | 'factory_sample_room_pic'
    | 'factory_other_pic';

@Component({
    selector: 'app-videotape',
    templateUrl: './videotape.component.html',
    styleUrls: ['./videotape.component.scss'],
})
export class VideotapeComponent implements OnInit {
    progress: string;
    hash: string;
    data: any[];
    container: any;
    requestList: XMLHttpRequest[] = [];
    fileChunkList: Chunk[];
    @Input() set videos(input: string[]) {
        if (!input) {
            return;
        }
        if (!!input) {
            this._up_data = input;
        }
    }

    @Input() type: FieldType;
    @Input() apply_inspection_no: string;
    @Input() contract_no: string;
    @Input() sku: string;
    @Input() box_type: 'outer' | 'inner';
    @Input() sort_index?: number;

    constructor(
        public mediaCapture: MediaCapture,
        private fileChooser: FileChooser,
        private filePath: FilePath,
        private ec: PageEffectService,
        private implement: ImplementInspectService,
        private file: File,
        private fileReq: RequestService,
        private fileHash: FileHashService,
        private fileChunk: FileChunkService,
        private userInfo: UserInfoService,
        private http: HttpService,
    ) {}

    @Output() onComplete: EventEmitter<MediaFile[][]> = new EventEmitter<MediaFile[][]>();

    get uploadPercentage(): number {
        if (!this.container || !this.container || !this.data || !this.data.length) return 0;
        const loaded = this.data.map(item => item.size * item.percentage).reduce((acc, cur) => acc + cur);
        return parseInt((loaded / this.container.size).toFixed(2));
    }

    _videos: any[][] = [];
    _up_data: string[] = [];
    ngOnInit() {}
    complete: boolean = true;

    videotape() {
        if (!this.complete) {
            this.ec.showToast({
                message: '请等待上传完毕！',
                color: 'danger',
            });
            return;
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

    async fileChoose() {
        const uri = await this.fileChooser.open({ mime: 'video/mp4' });
        const url = await this.filePath.resolveNativePath(uri);
        if (url && uri) {
            this.ec.showLoad({
                message: '获取文件ArrayBuffer中……',
            });
            this.getFileEntry(url).then(res => {
                this.ec.clearEffectCtrl();
                this.ec.showAlert({
                    message: '获取ArrayBuffer完毕',
                });
                const blob = new Blob([res]);
                this.handleFile(blob, url);
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

    async tape() {
        const mediaFiles = await this.mediaCapture.captureVideo({ limit: 1, quality: 30 });
        // let dirPath = mediaFiles[0].fullPath.substring(0, mediaFiles[0].fullPath.lastIndexOf('/'));
        // let fileName = mediaFiles[0].fullPath.substring(
        //     mediaFiles[0].fullPath.lastIndexOf('/') + 1,
        //     mediaFiles[0].fullPath.length,
        // );
        // const dirEntry = await this.file.resolveDirectoryUrl(dirPath);
        // const fileEntry = await this.file.getFile(dirEntry, fileName, {});
        if (mediaFiles) {
            this.getFileEntry(mediaFiles[0].fullPath).then(res => {
                this.ec.clearEffectCtrl();
                this.ec.showAlert({
                    message: '获取ArrayBuffer完毕',
                });
                const blob = new Blob([res]);
                this.handleFile(blob, mediaFiles[0].fullPath);
            });
        } else {
            this.ec.showToast({
                message: '没有拍摄视频',
                color: 'danger',
            });
        }
    }

    async handleFile(res?: any, filepath?: string) {
        this.container = res;
        //文件切片
        this.fileChunkList = await this.fileChunk.handleFile(res);
        //文件hash
        this.hash = await this.fileHash.initHashWorker(this.fileChunkList);
        //toPromise rxjs
        const {
            data: { uploadedList, shouldUpload },
        } = await this.verifyUpload(this.hash, filepath);
        if (!shouldUpload) {
            alert('文件已上传');
            return;
        } else {
            this.uploadChunks(uploadedList ? uploadedList : []);
        }
        //上传切片
    }

    play(p: string) {
        this.ec.showModal({
            component: VideoPlayComponent,
            componentProps: { source: p },
        });
    }

    async uploadChunks(uploadedList: string[] = []) {
        this.data = this.fileChunkList.map(({ file }, index) => ({
            fileHash: this.hash,
            index,
            hash: this.hash + '-' + index,
            cut_num: index,
            chunk: file,
            size: file.size,
            percentage: uploadedList.includes(index + '') ? 100 : 0,
        }));
        let requestList = this.data
            .filter(({ hash }) => !uploadedList.includes(hash))
            .map(({ chunk, fileHash, hash, cut_num }) => {
                let formData = new FormData();
                formData.append('chunk', chunk);
                this.sort_index && formData.append('sort_index', this.sort_index as any);
                formData.append('type', this.type);
                formData.append('apply_inspection_no', this.apply_inspection_no);
                formData.append('contract_no', this.contract_no);
                formData.append('sku', this.sku);
                formData.append('cut_num', cut_num);
                formData.append('filename', this.container.name);
                formData.append('filehash', fileHash);
                formData.append('upload_type', 'upload');
                console.log(this.sort_index);
                return formData;
            })
            .map(async (formData, index) => {
                return await this.fileReq.request({
                    url: `${environment.apiUrl}/task/add_inspection_task_video`,
                    requestList: this.requestList,
                    onProgress: this.createProgressHandler(this.data[index]),
                    data: formData,
                    headers: {
                        Authorization: this.userInfo.info ? `Bearer ${this.userInfo.info.api_token}` : undefined,
                    },
                });
            });
        await Promise.all(requestList);
        this.mergeRequest();
    }

    async mergeRequest(): Promise<any> {
        let data = {
            filehash: this.hash,
            type: this.type,
            apply_inspection_no: this.apply_inspection_no,
            contract_no: this.contract_no,
            sku: this.sku,
            upload_type: 'merge',
            sort_index: this.sort_index,
        };
        !this.sort_index && delete data.sort_index;
        this.http.post({ url: '/task/add_inspection_task_video', params: data }).subscribe(res => {
            this._up_data.push(res.data);
        });
    }

    // 用闭包保存每个 chunk 的进度数据
    createProgressHandler(item) {
        return e => {
            item.percentage = parseInt(String((e.loaded / e.total) * 100));
        };
    }

    //暂停上传
    resetData() {
        this.requestList.forEach(xhr => xhr.abort());
        this.requestList = [];
    }

    async verifyUpload(filehash: string, filepath?: string): Promise<VerifyResponse> {
        const { data } = await this.fileReq.request({
            url: `${environment.apiUrl}/task/add_inspection_task_video`, //http://localhost:3000/merge
            headers: {
                'content-type': 'application/json',
            },
            data: JSON.stringify({
                filehash: filehash,
                filepath: filepath,
                type: this.type,
                apply_inspection_no: this.apply_inspection_no,
                contract_no: this.contract_no,
                sku: this.sku,
                upload_type: 'fileVerify',
            }),
        });
        return JSON.parse(data);
    }

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
                            apply_inspection_no: this.apply_inspection_no,
                            type: this.type,
                            filename: this._up_data[i],
                            contract_no: this.contract_no,
                            sku: this.sku,
                            sort_index: this.sort_index,
                        };
                        !this.sort_index && delete params.sort_index;
                        this.implement.removeSkuVideo(params).subscribe(res => {
                            if (res.status) {
                                this._up_data.splice(i, 1);
                                this.ec.showToast({
                                    message: '删除成功！',
                                    color: 'success',
                                });
                            } else {
                                this.ec.showToast({
                                    message: '删除失败！',
                                    color: 'danger',
                                });
                            }
                        });
                    },
                },
            ],
        });
    }

    dataURItoBlob(base64Data): any {
        //console.log(base64Data);//data:image/png;base64,
        var byteString;
        if (base64Data.split(',')[0].indexOf('base64') >= 0) byteString = atob(base64Data.split(',')[1]);
        //base64 解码
        else {
            byteString = unescape(base64Data.split(',')[1]);
        }
        var mimeString = base64Data
            .split(',')[0]
            .split(':')[1]
            .split(';')[0]; //mime类型 -- image/png

        // var arrayBuffer = new ArrayBuffer(byteString.length); //创建缓冲数组
        // var ia = new Uint8Array(arrayBuffer);//创建视图
        var ia = new Uint8Array(byteString.length); //创建视图
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        var blob = new Blob([ia], {
            type: mimeString,
        });
        return blob;
    }

    //将blob转为base64
    blobToBase64(blob: Blob): Observable<string> {
        return new Observable(observer => {
            let fileReader = new FileReader();
            fileReader.onload = (e: any) => {
                observer.next(e.target.result as any);
            };
            fileReader.readAsDataURL(blob);
        });
    }
}

export interface VerifyResponse {
    status: number;
    message: string;
    data: {
        shouldUpload: boolean;
        uploadedList?: string[];
        filepath: string;
    };
}

export interface UploadParams {
    chunk: Blob;
    type: FieldType;
    apply_inspection_no: string;
    contract_no: string;
    sku: string;
    video_info: FileBaseInfo;
    upload_type: 'upload' | 'merge' | 'fileVerify';
    video_extension: string;
}

export interface FileBaseInfo {
    filehash: string;
    hash: string;
    filepath: string;
}
