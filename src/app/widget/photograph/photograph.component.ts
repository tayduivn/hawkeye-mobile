import { Platform } from '@ionic/angular';
import { FieldType } from './../videotape/videotape.component';
import { ImplementInspectService } from 'src/app/services/implement-inspect.service';
import { FileUploadService } from './../../services/file-upload.service';
import { environment } from 'src/environments/environment';
import { PageEffectService } from 'src/app/services/page-effect.service';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { ImagePicker, ImagePickerOptions } from '@ionic-native/image-picker/ngx';
import { ActionSheetOptions } from '@ionic/core';
import { ImageOther } from 'src/app/services/file-upload.service';

@Component({
    selector: 'app-photograph',
    templateUrl: './photograph.component.html',
    styleUrls: ['./photograph.component.scss'],
})
export class PhotographComponent implements OnInit {
    @Input() set photos(input: string[]) {
        if (!input) {
            return;
        }
        input = input.map(res => this.imgOrigin + res);
        if (!!input) {
            this._photos = input;
        }
    }

    @Input() type: FieldType;
    @Input() apply_inspection_no: string;
    @Input() contract_no?: string;
    @Input() sku?: string;
    @Input() box_type?: 'outer' | 'inner';
    @Input() moduleType: 'removeFactoryPic' | 'removeContractPic' | 'removeSkuPic';
    @Input() sort_index?: number;
    s;

    constructor(
        private camera: Camera,
        private ec: PageEffectService,
        private imagePicker: ImagePicker,
        private uploadService: FileUploadService,
        private implement: ImplementInspectService,
        public platform: Platform,
    ) {}
    imgOrigin: string = environment.usFileUrl;

    @Output() onPhotograph: EventEmitter<string[]> = new EventEmitter<string[]>();
    _photos: string[] = [];
    metaPhotos: string[] = [];

    options: CameraOptions = {
        quality: 100,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
        saveToPhotoAlbum: true,
    };

    pickerOpts: ImagePickerOptions = {
        maximumImagesCount: 6,
        quality: 100,
        outputType: 1,
    };

    ngOnInit() {}

    photograph() {
        const option: ActionSheetOptions = {
            header: '上传方式',
            buttons: [
                {
                    text: '拍照',
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

    graph() {
        this.camera.getPicture(this.options).then(
            imageData => {
                this.ec.clearEffectCtrl();
                const base64Image = 'data:image/jpeg;base64,' + imageData;
                this.upload({ images: [base64Image] });
            },
            err => {
                this.ec.showToast({
                    message: '请重新拍照',
                    color: 'danger',
                });
            },
        );
    }

    picker() {
        if (this.platform.is('hybrid')) {
            this.imagePicker.getPictures(this.pickerOpts).then(
                res => {
                    this.ec.clearEffectCtrl();
                    let ary = res.map(item => 'data:image/jpeg;base64,' + item);
                    this.upload({ images: ary });
                },
                err => {
                    console.log(err);
                },
            );
        }
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
                            filename: this._photos[i].substring(this.imgOrigin.length, this._photos[i].length),
                            contract_no: this.contract_no,
                            sku: this.sku,
                            is_inner_box: this.box_type == 'inner' ? 1 : 2,
                            sort_index: this.sort_index,
                        };
                        !this.sort_index && delete this.sort_index;
                        this.implement[this.moduleType](params).subscribe(res => {
                            if (res.status) {
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
                    },
                },
            ],
        });
    }

    upload(obj: any) {
        console.log(obj);
        this.ec.showLoad({
            message: '正在上传中……',
            backdropDismiss: false,
        });
        debugger;
        let params: ImageOther = {
            type: this.type,
            apply_inspection_no: this.apply_inspection_no,
            contract_no: this.contract_no,
            is_inner_box: this.box_type == 'inner' ? 0 : 2,
            sku: this.sku,
            images: obj.images,
            sort_index: this.sort_index,
        };

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

    doCheckImg(e: any) {
        // console.log(e);
        // let render = new FileReader();
        // render.onload = event => {
        //     console.log(event.target.result);
        //     this.upload({ images: [event.target.result] });
        // };
        // render.readAsDataURL(e.target.files[0]);
    }
}
