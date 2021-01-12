import { Component, EventEmitter, Input, OnInit, SimpleChanges } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { ImagePicker, ImagePickerOptions } from '@ionic-native/image-picker/ngx';
import { Platform } from '@ionic/angular';
import { from, Observable } from 'rxjs';
import { InspectCacheService } from 'src/app/pages/implement-inspection/inspect-cache.service';
import { HashCode, UploadQueueService } from 'src/app/pages/implement-inspection/upload-queue.service';
import { FileUploadService, ImageOther } from 'src/app/services/file-upload.service';
import { ImplementInspectService } from 'src/app/services/implement-inspect.service';
import { PageEffectService } from 'src/app/services/page-effect.service';
import { PhotographComponent } from '../photograph/photograph.component';
import { FieldType } from '../videotape/videotape.component';
import { File as androidFile } from '@ionic-native/file/ngx';
import { filter, mergeMap, takeWhile, tap } from 'rxjs/operators';
import { inspectingService } from 'src/app/services/inspecting.service';
import { RequestService } from 'src/app/blue-bird/service/request.service';
import { environment } from 'src/environments/environment';
import { UserInfoService } from 'src/app/services/user-info.service';

@Component({
    selector: 'app-photo-mini',
    templateUrl: './photo-mini.component.html',
    styleUrls: ['./photo-mini.component.scss'],
})
export class PhotoMiniComponent extends PhotographComponent {
    environment = environment;
    imgOrigin: string;
    fileArray: any[] = [];
    number: any = 0;
    constructor(
        public camera: Camera,
        public ec: PageEffectService,
        public imagePicker: ImagePicker,
        public uploadService: FileUploadService,
        public implement: ImplementInspectService,
        public platform: Platform,
        public fileCtrl: androidFile,
        public uQueue: UploadQueueService,
        public inspectCache: InspectCacheService,
        private inspecting: inspectingService,
        private request: RequestService,
        private userInfo: UserInfoService,
    ) {
        super(camera, ec, imagePicker, uploadService, implement, platform, fileCtrl, uQueue, inspectCache);
    }

    _photos: string[];
    metaPhotos: string[];
    flag: boolean;
    flagIsStatus: any;
    @Input() set photos(input: string[]) {
        if (!!input) this._photos = input;
    }
    @Input() set apply_inspection(input: string[]) {
        if (!!input) {
            console.log(1);
            this.factory_inspect_no = input;
            console.log(this.factory_inspect_no);
        }
    }
    @Input() set flagStatus(input: any) {
        if (!!input) {
            this.flagIsStatus = input;
        }
    }
    @Input() factory_id: string = '';
    @Input() type: any;
    factory_inspect_no: any;
    @Input() suoyin: any;
    //拍照配置项
    options: CameraOptions = {
        // quality: 10, //质量
        destinationType: this.camera.DestinationType.FILE_URI,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
        saveToPhotoAlbum: true,
    };
    remove(i: number): void {
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
                            apply_inspection_no: '',
                            type: this.type,
                            filename: 'storage' + this._photos[i].split('storage')[1],
                        };
                        if (this.type == 'product_pic') {
                            // 如果这个本地存储的suoyin有对应的值说明
                            console.log(this.factory_inspect_no);
                            if (this.factory_inspect_no == undefined || this.factory_inspect_no == 'undefined') {
                                // 新增的产品，从本地读取apply_inspection_no 怎么判断是新增的产品  只要新增的产品才没有factory_inspect_no值
                                params.apply_inspection_no = window.sessionStorage.getItem(`${this.suoyin}`);
                            } else {
                                params.apply_inspection_no = this.factory_inspect_no;
                            }
                        } else {
                            params.apply_inspection_no = window.sessionStorage.getItem('inspect_no');
                        }
                        this.inspecting.deletePic(params).subscribe(res => {
                            console.log(res);
                            if (res.status != 1)
                                return this.ec.showToast({
                                    message: '删除图片失败',
                                    duration: 1500,
                                    color: 'danger',
                                });
                            this.ec.showToast({
                                message: '删除图片成功',
                                color: 'success',
                                duration: 1500,
                            });
                            // 删除成功后删除渲染的图片
                            this._photos.splice(i, 1);

                            if (this.type == 'facade_pic') {
                                if (this._photos.length == 0) {
                                    window.sessionStorage.setItem('facade_picFalg', '');
                                }
                            } else if (this.type == 'plant_pic') {
                                if (this._photos.length == 0) {
                                    window.sessionStorage.setItem('plant_picFlag', '');
                                }
                            }
                        });
                    },
                },
            ],
        });
    }
    ngOnInit() {
        console.log(1);

        console.log(this.flagIsStatus);

        if (
            window.sessionStorage.getItem('FACTORY_ID') != 'undefined' &&
            window.sessionStorage.getItem('inspect_no') != 'undefined'
        ) {
            this.flag = false;
        } else {
            this.flag = true;
        }
    }
    ngOnDestroy(): void {
        window.sessionStorage.setItem('facade_picFalg', '');
        window.sessionStorage.setItem('plant_picFlag', '');
        window.sessionStorage.setItem(`${this.suoyin}`, `undefined`);
    }
    doCheckImg(e: any) {
        if (this.type == 'facade_pic') {
            window.sessionStorage.setItem('facade_picFalg', '1');
        } else if (this.type == 'plant_pic') {
            window.sessionStorage.setItem('plant_picFlag', '1');
        }
        let params: FormData = new FormData();
        params.append('factory_id', window.sessionStorage.getItem('FACTORY_ID'));
        if (this.type == 'product_pic') {
            // 传递商品的时候  factory_inspect_no存在的话说明是已经存在的商品 直接拿到id提交即可  当没有的话是新增的产品 不传id
            if (this.factory_inspect_no == undefined || this.factory_inspect_no == 'undefined') {
                // 啥也不做（不传）
                console.log(1);
            } else {
                // 第二至第n次上传传入当前请求回来的factory_inspect_no
                params.append('factory_inspect_no', this.factory_inspect_no);
            }
        } else {
            params.append('factory_inspect_no', window.sessionStorage.getItem('inspect_no'));
        }

        params.append('type', this.type);
        Array.prototype.map.call(e.target.files, (file: File) => {
            params.append('file', file);
            // 走接口
            console.log('factory_id', params.get('factory_id'));
            console.log('factory_inspect_no', params.get('factory_inspect_no'));
            console.log('type', params.get('type'));
            console.log('file', params.get('file'));

            this.request
                .request({
                    url: `${environment.apiUrl}/factory/add_factory_inspect_img`,
                    data: params,
                    headers: {
                        Authorization: this.userInfo.info ? `Bearer ${this.userInfo.info.api_token}` : undefined,
                    },
                })
                .then(res => {
                    console.log(res);

                    // console.log(JSON.parse(res.data));
                    const data = JSON.parse(res.data);
                    if (data.message == '文件已存在') {
                        return this.ec.showToast({
                            message: '上传图片已存在',
                            color: 'danger',
                            duration: 1500,
                        });
                    } else if (data.status != 1) {
                        return this.ec.showToast({
                            message: '上传图片失败',
                            color: 'danger',
                            duration: 1500,
                        });
                    } else {
                        // 如果成功
                        this.ec.showToast({
                            message: '上传图片成功',
                            color: 'success',
                            duration: 1500,
                        });
                        this._photos.push(environment.usFileUrl + data.data[0].path);
                        // 上传成功把拿到的pic的id存起来   这里拿到了唯一的标识

                        if (
                            data.data[0].apply_inspection_no != undefined ||
                            data.data[0].apply_inspection_no != 'undefined'
                        ) {
                            // 存在的时候说明是新增的第一次上传  就把新增的第一次上传获得的id存起来以供上传产品信息的时候使用
                            window.sessionStorage.setItem(`${this.suoyin}`, `${data.data[0].apply_inspection_no}`);
                        }
                    }
                });
        });
    }
    graph() {
        if (this.flag) {
            return this.ec.showToast({
                message: '请先保存工厂基本信息再上传图片',
                color: 'danger',
                duration: 1500,
            });
        }

        const getImage$ = from(this.camera.getPicture(this.options));
        getImage$
            .pipe(
                takeWhile(str => str && str.length),
                tap(res => this.ec.showToast({ message: '拍摄成功', color: 'success' })),
                mergeMap((filePath: string) => {
                    return from(
                        this.file //将文件地址读取为base64
                            .readAsDataURL(
                                filePath.substr(0, filePath.lastIndexOf('/') + 1),
                                filePath.substr(filePath.lastIndexOf('/') + 1),
                            ),
                    );
                }),
                mergeMap(base64 => this.doWorkerGetBlob(base64)),
            )
            .subscribe((res: any) => {
                // [object:msg]
                // 这个地方拍摄成功(拍摄成功就要让标志位解开)
                if (this.type == 'facade_pic') {
                    window.sessionStorage.setItem('facade_picFalg', '1');
                } else if (this.type == 'plant_pic') {
                    window.sessionStorage.setItem('plant_picFlag', '1');
                }
                let params = new FormData();
                params.append('factory_id', window.sessionStorage.getItem('FACTORY_ID'));
                if (this.type == 'product_pic') {
                    // 传递商品的时候  factory_inspect_no存在的话说明是已经存在的商品 直接拿到id提交即可  当没有的话是新增的产品 不传id
                    if (this.factory_inspect_no == undefined || this.factory_inspect_no == 'undefined') {
                        // 啥也不做（不传）
                        console.log(1);
                    } else {
                        // 第二至第n次上传传入当前请求回来的factory_inspect_no
                        params.append('factory_inspect_no', this.factory_inspect_no);
                    }
                } else {
                    params.append('factory_inspect_no', window.sessionStorage.getItem('inspect_no'));
                }
                params.append('type', this.type);
                params.append('file', res.data);
                console.log(params.get('type'));
                console.log(params.get('file'));
                console.log(params.get('factory_inspect_no'));
                console.log(params.get('factory_id'));
                this.request
                    .request({
                        url: `${environment.apiUrl}/factory/add_factory_inspect_img`,
                        data: params,
                        headers: {
                            Authorization: this.userInfo.info ? `Bearer ${this.userInfo.info.api_token}` : undefined,
                        },
                    })
                    .then(res => {
                        const data = JSON.parse(res.data);
                        if (data.status != 1) {
                            return this.ec.showToast({
                                message: '上传图片失败',
                                color: 'danger',
                                duration: 1500,
                            });
                        } else {
                            // 如果成功
                            this.ec.showToast({
                                message: '上传图片成功',
                                color: 'success',
                                duration: 1500,
                            });
                            this._photos.push(environment.usFileUrl + data.data[0].path);
                            if (
                                data.data[0].apply_inspection_no != undefined ||
                                data.data[0].apply_inspection_no != 'undefined'
                            ) {
                                // 存在的时候说明是新增的第一次上传  就把新增的第一次上传获得的id存起来以供上传产品信息的时候使用
                                window.sessionStorage.setItem(`${this.suoyin}`, `${data.data[0].apply_inspection_no}`);
                            }
                        }
                    });
            });
    }
}
