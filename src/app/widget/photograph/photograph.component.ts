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
import ImageCompressor from 'image-compressor.js';
import { from, Observable } from 'rxjs';
import { map, mergeAll } from 'rxjs/operators';
import { File as androidFile } from '@ionic-native/file/ngx';

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

    Compressor: ImageCompressor;

    @Input() type: FieldType;
    @Input() apply_inspection_no: string;
    @Input() contract_no?: string;
    @Input() sku?: string;
    @Input() box_type?: 'outer' | 'inner';
    @Input() moduleType: 'removeFactoryPic' | 'removeContractPic' | 'removeSkuPic';
    @Input() sort_index?: number;
    @Input() highSpeed: boolean;

    constructor(
        private camera: Camera,
        private ec: PageEffectService,
        private imagePicker: ImagePicker,
        private uploadService: FileUploadService,
        private implement: ImplementInspectService,
        public platform: Platform,
        private file: androidFile,
    ) {
        this.Compressor = new ImageCompressor();
    }
    imgOrigin: string = environment.usFileUrl;

    @Output() onPhotograph: EventEmitter<string[]> = new EventEmitter<string[]>();
    _photos: string[] = [];
    metaPhotos: string[] = [];

    options: CameraOptions = {
        quality: 10,
        destinationType: this.camera.DestinationType.FILE_URI,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
        saveToPhotoAlbum: true,
    };

    pickerOpts: ImagePickerOptions = {
        // maximumImagesCount: 6,
        quality: 100,
        outputType: 1,
    };

    ngOnInit() {}

    photograph() {
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

    // graph() {
    //     this.camera.getPicture(this.options).then(
    //         imageData => {
    //             if (imageData) {
    //                 this.ec.clearEffectCtrl();
    //                 const base64Image = 'data:image/jpeg;base64,' + imageData;
    //                 const image = this.getCompressionImage(this.dataURItoBlob(base64Image));
    //                 //判断高速还是低速
    //                 image.subscribe(base64 => {
    //                     this._photos.push(base64);
    //                     console.log(base64);
    //                     if (this.highSpeed) {
    //                         this.upload({ images: [base64] });
    //                     } else {
    //                         //存入缓存
    //                         //新建文件夹 -> 流水号 ->
    //                         (window as any).resolveLocalFileSystemURL(
    //                             'cordova.file.externalRootDirectory',
    //                             function(root: any) {
    //                                 root.getFile(
    //                                     'demo.txt',
    //                                     { create: true },
    //                                     function(fileEntry) {
    //                                         var dataObj = new Blob(['欢迎访问hangge.com'], { type: 'text/plain' });
    //                                         //写入文件
    //                                         this.writeFile(fileEntry, dataObj);
    //                                     },
    //                                     function(err) {
    //                                         console.log('创建失败!');
    //                                     },
    //                                 );
    //                             },
    //                             function(err) {},
    //                         );
    //                         return;
    //                         this.file
    //                             .checkDir(this.file.dataDirectory, 'hawkeye')
    //                             .then(has => {
    //                                 if (has) {
    //                                     this.file
    //                                         .readAsDataURL(this.file.dataDirectory + '/hawkeye/', 'test.jpg')
    //                                         .then(res => {
    //                                             console.log(res);
    //                                             this._photos.push(res);
    //                                         })
    //                                         .catch(err => console.log(err));
    //                                 } else {
    //                                     this.file.createDir(this.file.dataDirectory, 'hawkeye', true).then(res => {
    //                                         debugger;
    //                                         console.log(res);
    //                                         this.file
    //                                             .writeFile(this.file.dataDirectory + '/hawkeye/', 'test.jpg', imageData)
    //                                             .then(e => {
    //                                                 console.log(e);
    //                                             });
    //                                     });
    //                                 }
    //                             })
    //                             .catch(err => console.log(err));
    //                     }
    //                 });
    //             } else {
    //                 this.ec.showToast({
    //                     message: '没有拍摄图片',
    //                     color: 'danger',
    //                 });
    //             }
    //         },
    //         err => {
    //             this.ec.showToast({
    //                 message: '没有拍摄照片',
    //                 color: 'danger',
    //             });
    //         },
    //     );
    // }
    graph() {
        this.camera.getPicture(this.options).then(
            imageData => {
                this.ec.clearEffectCtrl();
                if (imageData) {
                    this.file
                        .readAsDataURL(
                            imageData.substr(0, imageData.lastIndexOf('/') + 1),
                            imageData.substr(imageData.lastIndexOf('/') + 1),
                        )
                        .then(res => {
                            const image = this.getCompressionImage(this.dataURItoBlob(res));
                            image.subscribe(base64 => {
                                this.upload({ images: [ base64 ] });
                            });
                        });
                } else {
                    this.ec.showToast({
                        message: '没有拍摄图片',
                        color: 'danger',
                    });
                }
            },
            err => {
                this.ec.showToast({
                    message: '没有拍摄照片',
                    color: 'danger',
                });
            },
        );
    }

    writeFile(fileEntry: { createWriter: (arg0: (fileWriter: any) => void) => void; }, dataObj: any) {
        //创建一个写入对象
        fileEntry.createWriter(function(fileWriter) {
            //文件写入成功
            fileWriter.onwriteend = function() {
                console.log('Successful file read...');
            };

            //文件写入失败
            fileWriter.onerror = function(e) {
                console.log('Failed file read: ' + e.toString());
            };

            //写入文件
            fileWriter.write(dataObj);
        });
    }

    picker() {
        if (this.platform.is('hybrid')) {
            this.imagePicker.getPictures(this.pickerOpts).then(
                res => {
                    this.ec.clearEffectCtrl();
                    if (res && res.length){
                        let ary = res.map((item: string) => 'data:image/jpeg;base64,' + item);
                        this.ec.showLoad({
                            message: '压缩中……',
                        });
                        from(ary)
                            .pipe(
                                map(res => this.getCompressionImage(this.dataURItoBlob(res))),
                                mergeAll(),
                            )
                            .subscribe(e => {
                                this.ec.clearEffectCtrl();
                                this.upload({ images: [e] });
                            });
                    } else {
                        this.ec.showToast({
                            message: '没有选择图片',
                            color: 'danger',
                        });
                    }
                },
                err => {
                    console.log(err);
                },
            );
        }
    }

    setCache() {}

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

    //将base64转换为文件
    dataURLtoFile(dataurl: string, filename: string): File {
        var arr = dataurl.split(','),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]),
            n = bstr.length,
            u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, { type: mime });
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
            backdropDismiss: true,
        });
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

    /**
     * 压缩图片
     * @param file file对象
     */
    getCompressionImage(file: File): Observable<string> {
        let image = from(
            this.Compressor.compress(file, {
                quality: 0.8,
                maxWidth: 1000,
                maxHeight: 1000,
                convertSize: 614400, //超过600kb压缩
                success(result) {},
                error(e) {
                    console.log(e);
                    throw { message: `压缩失败${e.message}` };
                },
            }),
        ).pipe(
            map(res => this.blobToBase64(res)),
            mergeAll(),
        );
        return image;
    }
}
