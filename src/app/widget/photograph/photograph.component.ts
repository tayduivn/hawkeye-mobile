import { Platform } from '@ionic/angular';
import { FieldType } from './../videotape/videotape.component';
import { ImplementInspectService } from 'src/app/services/implement-inspect.service';
import { FileUploadService, ImageOther } from './../../services/file-upload.service';
import { environment } from 'src/environments/environment';
import { PageEffectService } from 'src/app/services/page-effect.service';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { ImagePicker, ImagePickerOptions } from '@ionic-native/image-picker/ngx';
import { ActionSheetOptions } from '@ionic/core';
import ImageCompressor from 'image-compressor.js';
import { from, Observable, zip } from 'rxjs';
import { mergeMap, takeWhile, tap, filter } from 'rxjs/operators';
import { File as androidFile } from '@ionic-native/file/ngx';
import { UploadQueueService, HashCode } from 'src/app/pages/implement-inspection/upload-queue.service';
import { InspectCacheService } from 'src/app/pages/implement-inspection/inspect-cache.service';

@Component({
    selector: 'app-photograph',
    templateUrl: './photograph.component.html',
    styleUrls: ['./photograph.component.scss'],
})
export class PhotographComponent implements OnInit {
    @Input() type: FieldType; //图片类型 （验货字段）
    @Input() apply_inspection_no: string; //申请验货编号
    @Input() contract_no?: string; //合同号
    @Input() sku?: string; //sku
    @Input() box_type?: 'outer' | 'inner'; //内外箱区分
    @Input() moduleType: 'removeFactoryPic' | 'removeContractPic' | 'removeSkuPic'; //删除用到参数 区分工厂/合同/sku
    @Input() sort_index?: number; //验货要求用到的图片index
    @Input() disabled: boolean = false;
    @Input() errorInfo: string;
    @Input() set photos(input: string[]) {
        if (!input) {
            input = [];
        }
        input = input.map(res => this.imgOrigin + res);
        if (!!input) {
            this._photos = input;
        }
        //本地去缓存展示
        //this.getCache();
    }

    Compressor: ImageCompressor;
    random: number = Math.random();

    constructor(
        public camera: Camera,
        public ec: PageEffectService,
        public imagePicker: ImagePicker,
        public uploadService: FileUploadService,
        public implement: ImplementInspectService,
        public platform: Platform,
        public file: androidFile,
        public uQueue: UploadQueueService,
        protected inspectCache: InspectCacheService,
    ) {
        this.Compressor = new ImageCompressor(); //原生压缩
    }
    imgOrigin: string = environment.usFileUrl; //图片显示域名
    @Output() onPhotograph: EventEmitter<string[]> = new EventEmitter<string[]>(); //拍完照回调
    _photos: string[] = []; //显示图片数组
    metaPhotos: string[] = []; //显示图片源数据
    _caches: Array<ImageOther> = []; //hybrid用来存native file url的数组
    rmClicked: number[] = [];
    //拍照配置项
    options: CameraOptions = {
        // quality: 10, //质量
        destinationType: this.camera.DestinationType.FILE_URI,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
        saveToPhotoAlbum: true,
    };

    pickerOpts: ImagePickerOptions = {
        //选择图片配置项
        maximumImagesCount: 30,
        quality: 100,
        outputType: 0, //文件本机 url
    };

    ngOnInit() {
        let that = this;
        this.uQueue.alreadyUploadPayload$
            .asObservable()
            .pipe(
                filter(
                    node =>
                        node.type === 'img' &&
                        node.payload.sku === this.sku &&
                        node.payload.type === this.type &&
                        node.payload.contract_no === this.contract_no &&
                        node.payload.apply_inspection_no === this.apply_inspection_no &&
                        node.payload.sort_index === this.sort_index &&
                        this._photos.indexOf((node as any).path) === -1,
                ),
            )
            .subscribe((res: any) => {
                // console.log('----------- 图片路径回流 ----------', res.path,res.type);
                this._photos.push(that.imgOrigin + res.path);
            });
    }

    removal(arr: Array<any>) {
        return arr.reduce((prev, cur) => (prev.includes(cur) ? prev : [...prev, cur]), []);
    }

    //拿缓存
    getCache() {
        let allCache: Array<ImageOther> = this.inspectCache.getImagePath(),
            _photos: Array<ImageOther> = [];
        if (!allCache) return;
        _photos = allCache.filter(
            elem =>
                elem.apply_inspection_no == this.apply_inspection_no &&
                elem.contract_no == this.contract_no &&
                elem.is_inner_box == (this.box_type == 'inner' ? 0 : 2) &&
                elem.sku == this.sku &&
                elem.type == this.type &&
                elem.sort_index == this.sort_index,
        );
        if (_photos && _photos.length) {
            this._caches = _photos;
        }
    }

    /**
     * 调起选择框
     */
    photograph() {
        if (this.disabled) {
            this.ec.showToast({
                message: this.errorInfo ? this.errorInfo : '未知原因造成不能上传',
                color: 'danger',
            });
            return;
        }

        const option: ActionSheetOptions = {
            header: '上传方式',
            buttons: [
                {
                    text: '拍照',
                    role: '',
                    icon: 'camera',
                    handler: () => {
                        this.ec.clearEffectCtrl();
                        setTimeout(() => {
                            this.graph();
                        }, 500);
                    },
                },
                {
                    text: '选择文件',
                    icon: 'folder',
                    handler: () => {
                        this.ec.clearEffectCtrl();
                        setTimeout(() => {
                            this.picker();
                        }, 500);
                    },
                },
            ],
            mode: 'ios',
        };
        this.ec.showActionSheet(option);
    }

    /**
     * 原生拍照
     */
    graph() {
        if (this.disabled) {
            this.ec.showToast({
                message: '已评价不能验配件！',
                color: 'danger',
            });
            return;
        }
        const getImage$ = from(this.camera.getPicture(this.options)),
            params: ImageOther = {
                type: this.type,
                apply_inspection_no: this.apply_inspection_no,
                contract_no: this.contract_no,
                sku: this.sku,
                is_inner_box: this.box_type == 'inner' ? 0 : 2,
                sort_index: this.sort_index,
            };
        getImage$
            .pipe(
                takeWhile(str => str && str.length),
                tap(res => this.ec.showToast({ message: '拍摄成功', color: 'success' })),
                mergeMap((filePath: string) => {
                    params.hash = HashCode(params.type + params.sku + params.is_inner_box);
                    if (this.sort_index == undefined || this.sort_index == null) delete params.sort_index;

                    return from(
                        this.file //将文件地址读取为base64
                            .readAsDataURL(
                                filePath.substr(0, filePath.lastIndexOf('/') + 1),
                                filePath.substr(filePath.lastIndexOf('/') + 1),
                            ),
                    );
                }),
                //本地展示
                // tap(base64 => this._photos.push(base64)),
                //调用base64 TO blob webWorker
                mergeMap(base64 => this.doWorkerGetBlob(base64)),
                //native图片压缩
                // mergeMap(blob => this.getCompressionImage(blob.data as any)),
            )
            .subscribe(msg => {
                //blob协议展示图片
                // this._photos.push(URL.createObjectURL(image));
                //hash是有 fieldType+sku+is_inner_box+path
                this.uQueue.add({
                    type: 'img',
                    size: msg.data.size,
                    blob: msg.data,
                    payload: params,
                    hash: HashCode(params.type + params.sku + params.is_inner_box),
                });
            });
    }

    /**
     * 选择图片功能
     */
    picker() {
        if (this.platform.is('hybrid')) {
            let params: ImageOther = {
                type: this.type,
                apply_inspection_no: this.apply_inspection_no,
                contract_no: this.contract_no,
                sku: this.sku,
                is_inner_box: this.box_type == 'inner' ? 0 : 2,
                sort_index: this.sort_index,
            };
            this.imagePicker.getPictures(this.pickerOpts).then(arr => {
                let getImages$ = from(arr as Array<string>);
                zip(
                    getImages$,
                    getImages$.pipe(
                        mergeMap(elem =>
                            this.file.readAsDataURL(
                                //读取图片本机地址为base64
                                elem.substr(0, elem.lastIndexOf('/') + 1),
                                elem.substr(elem.lastIndexOf('/') + 1),
                            ),
                        ),
                        //本地展示 TODO
                        mergeMap(base64 => this.doWorkerGetBlob(base64)),
                    ),
                ).subscribe(([elem, { data }]) => {
                    console.log('---------- 选择完毕 ---------');
                    params.hash = HashCode(params.type + params.sku + params.is_inner_box + elem);
                    this.uQueue.add({
                        type: 'img',
                        size: data.size,
                        blob: data,
                        payload: params,
                        hash: HashCode(params.type + params.sku + params.is_inner_box),
                    });
                });
            });
        }
    }

    /**
     * 通过base64ToBlob WebWorker 得到Blob
     * @param base64
     */
    doWorkerGetBlob(base64: String): Observable<any> {
        let obs = new Observable(observer => {
            const worker: Worker = new Worker('../assets/js/dataURItoBlob.js');
            worker.postMessage({ res: base64 });
            worker.onmessage = e => {
                observer.next(e);
            };
        });
        return obs;
    }

    doWorkerGetBase64(blob: Blob): Observable<any> {
        let obs = new Observable(observer => {
            const worker: Worker = new Worker('../assets/js/blobtobase64.js');
            worker.postMessage({ data: blob });
            worker.onmessage = e => {
                observer.next(e);
            };
        });
        return obs;
    }

    doCheckImg(e: any) {
        if (this.disabled) {
            this.ec.showToast({
                message: this.errorInfo ? this.errorInfo : '未知原因造成不能上传',
                color: 'danger',
            });
            return;
        }
        let params: ImageOther = {
            type: this.type,
            apply_inspection_no: this.apply_inspection_no,
            contract_no: this.contract_no,
            is_inner_box: this.box_type == 'inner' ? 0 : 2,
            sku: this.sku,
            sort_index: this.sort_index,
        };

        Array.prototype.map.call(e.target.files, (file: File) => {
            if (this.sort_index == undefined || this.sort_index == null) delete params.sort_index;
            params.hash = HashCode(params.type + params.sku + params.is_inner_box);

            this.uQueue.add({
                type: 'img',
                size: file.size,
                blob: file,
                payload: params,
                hash: HashCode(params.type + params.sku + params.is_inner_box),
            });
        });
    }

    remove(i: number) {
        this.ec.showAlert({
            message: '确定要删除吗？',
            buttons: [
                {
                    text: '取消',
                    handler: () => {},
                },
                {
                    text: '确定',
                    handler: () => {
                        this.ec
                            .showLoad({
                                spinner: null,
                                duration: 0,
                                message: '正在删除…',
                                translucent: false,
                            })
                            .then(() => {
                                let params = {
                                    apply_inspection_no: this.apply_inspection_no,
                                    type: this.type,
                                    filename: this._photos[i].substring(this.imgOrigin.length, this._photos[i].length),
                                    contract_no: this.contract_no,
                                    sku: this.sku,
                                    is_inner_box: this.box_type == 'inner' ? 1 : 2,
                                    sort_index: this.sort_index,
                                };
                                if (this.sort_index == undefined || this.sort_index == null) delete params.sort_index;
                                this.implement[this.moduleType](params).subscribe(res => {
                                    if (res.status) {
                                        this.ec.loadCtrl.dismiss();
                                        this._photos.splice(i, 1);
                                        this.onPhotograph.emit(this._photos);

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
                            });
                    },
                },
            ],
        });
    }

    upload(obj: any) {
        this.ec.showLoad({
            message: '正在上传中……',
            backdropDismiss: true,
        });
        let params: ImageOther = {
            type: this.type,
            apply_inspection_no: this.apply_inspection_no,
            contract_no: this.contract_no,
            is_inner_box: this.box_type == 'inner' ? 0 : 2,
            sku: this.sku,
            sort_index: this.sort_index,
        };
        !params.sku && delete params.sku; //有些传图片的地方不需要传sku
        this.uploadService.uploadImage(params).subscribe(res => {
            if (res.status) {
                this._photos = this._photos.concat(res.data.map(item => this.imgOrigin + item));
                this.onPhotograph.emit(this._photos);
            }
            this.ec.showToast({
                message: res.message,
                color: res.status ? 'success' : 'danger',
            });
        });
    }

    /**
     * 压缩图片
     * @param file file对象
     */
    getCompressionImage(file: File): Observable<Blob> {
        let image = from(
            this.Compressor.compress(file, {
                quality: 1,
                maxWidth: 1000,
                maxHeight: 1000,
                convertSize: 614400, //超过600kb压缩
                success(result) {},
                error(e) {
                    console.log(e);
                    throw { message: `压缩失败${e.message}` };
                },
            }),
        );
        return image;
    }
}
