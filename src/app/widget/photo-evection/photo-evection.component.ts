import { Component, Input, OnInit } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { Platform } from '@ionic/angular';
import { from } from 'rxjs';
import { mergeMap, takeWhile, tap } from 'rxjs/operators';
import { RequestService } from 'src/app/blue-bird/service/request.service';
import { InspectCacheService } from 'src/app/pages/implement-inspection/inspect-cache.service';
import { UploadQueueService } from 'src/app/pages/implement-inspection/upload-queue.service';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { ImplementInspectService } from 'src/app/services/implement-inspect.service';
import { inspectingService } from 'src/app/services/inspecting.service';
import { PageEffectService } from 'src/app/services/page-effect.service';
import { UserInfoService } from 'src/app/services/user-info.service';
import { environment } from 'src/environments/environment';
import { PhotographComponent } from '../photograph/photograph.component';
import { File as androidFile } from '@ionic-native/file/ngx';
import { TravelReimbursementService } from 'src/app/services/travel-reimbursement.service';
import { SaveOnlyOneService } from './save-only-one.service';
@Component({
    selector: 'app-photo-evection',
    templateUrl: './photo-evection.component.html',
    styleUrls: ['./photo-evection.component.scss'],
})
export class PhotoEvectionComponent extends PhotographComponent {
    constructor(
        public camera: Camera,
        public es: PageEffectService,
        public imagePicker: ImagePicker,
        public uploadService: FileUploadService,
        public implement: ImplementInspectService,
        public platform: Platform,
        public fileCtrl: androidFile,
        public uQueue: UploadQueueService,
        public inspectCache: InspectCacheService,
        private request: RequestService,
        private userInfo: UserInfoService,
        private travel: TravelReimbursementService,
        private onlyOne: SaveOnlyOneService,
    ) {
        super(camera, es, imagePicker, uploadService, implement, platform, fileCtrl, uQueue, inspectCache);
    }
    environment = environment;
    ngOnInit() {
        console.log(this.travelID);
        console.log(this.travelReimbursementNo);
        console.log(this.picType);
        // console.log(this.reimbursementIndex);
        // if (this.picType == 'traffic_expense_pic' || this.picType == 'fuel_charge_pic') {
        //     window.sessionStorage.setItem(`reimbursement${this.reimbursementIndex}`, 'undefined');
        // }
    }
    _photos: string[] = [];
    @Input() set travel_id(input: any) {
        this.travelID = input;
    }
    @Input() set travel_reimbursement_no(input: any) {
        this.travelReimbursementNo = input;
    }
    @Input() set type1(input: any) {
        this.picType = input;
    }
    @Input() set photo(input: string[]) {
        this._photos = input;
        console.log(input);
    }
    @Input() set isDisabled(input: any) {
        if (!!input) this.flag = input;
        console.log(input);
    }
    @Input() set index(input: any) {
        this.reimbursementIndex = input;
        console.log(this.reimbursementIndex);
    }
    @Input() set onlyOneNo(input: any) {
        this.onlyOneNumber = input;
        console.log(this.onlyOneNumber);
    }
    onlyOneNumber: any;
    reimbursementIndex: any;
    flag: any = false;
    travelID: any;
    travelReimbursementNo: any;
    number: number = 0;
    picType: any;
    // 移除图片
    remove(i: number): void {
        this.es.showAlert({
            message: '确定要删除吗?',
            buttons: [
                {
                    text: '取消',
                },
                {
                    text: '确定',
                    handler: () => {
                        let id = '';
                        // 判断当前的图片的类型
                        if (this.picType == 'traffic_expense_pic' || this.picType == 'fuel_charge_pic') {
                            id = this.onlyOneNumber;
                        } else {
                            id = this.travelReimbursementNo;
                        }
                        let params = {
                            type: this.picType,
                            travel_reimbursement_no: id,
                            filename: 'storage' + this._photos[i].split('storage')[1],
                        };
                        this.travel.deletePic(params).subscribe(res => {
                            if (res.status != 1)
                                return this.es.showToast({
                                    message: res.message,
                                    color: 'danger',
                                    duration: 1500,
                                });
                            this.es.showToast({
                                message: res.message,
                                color: 'success',
                                duration: 1500,
                            });
                            //    把图片从视图删除
                            this._photos.splice(i, 1);
                        });
                    },
                },
            ],
        });
    }
    // 实现拍照
    options: CameraOptions = {
        // quality: 10, //质量
        destinationType: this.camera.DestinationType.FILE_URI,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
        saveToPhotoAlbum: true,
    };
    graph() {
        const getImage$ = from(this.camera.getPicture(this.options));
        getImage$
            .pipe(
                takeWhile(str => str && str.length),
                tap(res => this.es.showToast({ message: '拍摄成功', color: 'success' })),
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
                this.number++;
                let params = new FormData();
                params.append('travel_id', this.travelID);
                params.append('type', this.picType);
                // 如果是油费或者是交通费第一次上传  那么就不传
                if (this.picType == 'traffic_expense_pic' || this.picType == 'fuel_charge_pic') {
                    // params.append('travel_reimbursement_no', null);
                    // 如果有唯一id就是编辑传进来的直接传递这个东西
                    if (this.onlyOneNumber) {
                        // debugger;
                        params.append('trans_expenses_no', this.onlyOneNumber);
                    } else {
                        // 如果不是的话只能是新增  新增的情况下先判断本地存储有没有 如果有的话就不是第一次上传  接下来的就传他
                        if (this.number == 1) {
                            // 如果没有就是第一次新增 第一次新增就什么都不干
                            console.log('第一次新增');
                            params.append('travel_reimbursement_no', null);
                            // debugger;
                        } else {
                            // debugger;
                            params.append('travel_reimbursement_no', this.onlyOneNumber);
                        }
                    }
                } else {
                    params.append('trans_expenses_no', this.travelReimbursementNo);
                }
                params.append('file', res.data);
                this.request
                    .request({
                        url: `${environment.apiUrl}/travel/add_travel_reimbursement_img`,
                        data: params,
                        headers: {
                            Authorization: this.userInfo.info ? `Bearer ${this.userInfo.info.api_token}` : undefined,
                        },
                    })
                    .then(res => {
                        console.log(res);
                        console.log(JSON.parse(res.data));
                        const data = JSON.parse(res.data);
                        if (data.data[0].trans_expenses_no) {
                            this.onlyOne.onlyOneNumber$.next({
                                trans_expenses_no: data.data[0],
                                index: this.reimbursementIndex,
                            });
                        }
                        if (data.status != 1)
                            return this.es.showToast({
                                message: data.message,
                                color: 'danger',
                                duration: 1500,
                            });
                        this.es.showToast({
                            message: data.message,
                            color: 'success',
                            duration: 1500,
                        });
                        // 上传成功回显图片
                        this._photos.push(data.data[0].path);
                    });
            });
    }
    // 实现选择文件
    doCheckImg(e: any) {
        this.number++;
        // file
        let params: FormData = new FormData();
        params.append('travel_id', this.travelID);
        params.append('type', this.picType);
        // 如果是油费或者是交通费第一次上传  那么就不传
        if (this.picType == 'traffic_expense_pic' || this.picType == 'fuel_charge_pic') {
            // 如果有唯一id就是编辑传进来的直接传递这个东西
            if (this.onlyOneNumber) {
                // debugger;
                params.append('travel_reimbursement_no', this.onlyOneNumber);
            } else {
                // 如果不是的话只能是新增  新增的情况下先判断本地存储有没有 如果有的话就不是第一次上传  接下来的就传他
                if (this.number == 1) {
                    // 如果没有就是第一次新增 第一次新增就什么都不干
                    console.log('第一次新增');
                    params.append('travel_reimbursement_no', null);
                    // debugger;
                } else {
                    // debugger;
                    params.append('travel_reimbursement_no', this.onlyOneNumber);
                }
            }
        } else {
            params.append('travel_reimbursement_no', this.travelReimbursementNo);
        }

        Array.prototype.map.call(e.target.files, (file: File) => {
            console.log(file);
            params.append('file', file);
            // 调用接口
            this.request
                .request({
                    url: `${environment.apiUrl}/travel/add_travel_reimbursement_img`,
                    data: params,
                    headers: {
                        Authorization: this.userInfo.info ? `Bearer ${this.userInfo.info.api_token}` : undefined,
                    },
                })
                .then(res => {
                    console.log(res);
                    console.log(JSON.parse(res.data));
                    // 拿到唯一id存起来
                    // if(res.da)

                    const data = JSON.parse(res.data);
                    // console.log(data.trans_expenses_no);
                    /*                if (data.data[0].trans_expenses_no) {
                        // 如果存在就存起来
                        window.sessionStorage.setItem(
                            `reimbursement${this.reimbursementIndex}`,
                            data.data[0].trans_expenses_no,
                        );
                    } */

                    if (data.data[0].trans_expenses_no) {
                        this.onlyOne.onlyOneNumber$.next({
                            trans_expenses_no: data.data[0],
                            index: this.reimbursementIndex,
                        });
                    }
                    if (data.status != 1)
                        return this.es.showToast({
                            message: data.message,
                            color: 'danger',
                            duration: 1500,
                        });
                    this.es.showToast({
                        message: data.message,
                        color: 'success',
                        duration: 1500,
                    });
                    // 上传成功回显图片
                    this._photos.push(data.data[0].path);
                });
        });
    }
}
