import { PageEffectService } from 'src/app/services/page-effect.service';
import { Component, OnInit } from '@angular/core';
import { Contract, Sku } from 'src/app/widget/sku-info/sku-info.component';
import { StorageService } from 'src/app/services/storage.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { ImplementInspectService, InspectFactoryParam } from 'src/app/services/implement-inspect.service';
import { ExamineStatus } from '../inspect-sku/inspect-sku.component';
import { CopySkuParams } from '../../../services/implement-inspect.service';
import { QueueComponent } from '../queue/queue.component';
import { UploadQueueService } from '../upload-queue.service';
import { FeedbackComponent } from '../../rework-inspect/feedback/feedback.component';

export interface Factory {
    name?: string;
    id?: number;
    contracts?: Contract[];
}

export interface PoModal {
    contract_no: string; // 合同号
    inspection_complete_no: string;
    contract_sku_desc: SkuOFPoModal;
}

export interface SkuOFPoModal {
    sku_package_complete_num: number; // 验货数量
    photo: string[]; // 照片
    sku: string; // sku
    sku_production_complete_num: number; // 大货生产完成数量
    rate_res: ExamineStatus;
    made_in_china_res: ExamineStatus;
    desc: string[];
}

@Component({
    selector: 'app-inspect-po',
    templateUrl: './inspect-po.component.html',
    styleUrls: ['./inspect-po.component.scss'],
})
export class InspectPoComponent implements OnInit {
    imgOrigin: string = environment.fileUrlPath;
    metaData: any = this.storage.get('IMPLEMENT-INSPECTION-META-DATA');
    currentSku: Sku = null;
    apply_inspect_no = '';
    currentApplyInsData: any;
    data: any = {
        contract: {
            manufacturer: '',
        },
    };
    options: CameraOptions = {
        quality: 100,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
    };

    constructor(
        private storage: StorageService,
        private activeRouter: ActivatedRoute,
        private camera: Camera,
        private ec: PageEffectService,
        private implementInspect: ImplementInspectService,
        private router: Router,
        private uQueue: UploadQueueService,
        private es: PageEffectService,
    ) {}
    alreadyUpProgress: boolean = this.uQueue.alreadyUpProgress;
    ngOnInit() {
        this.activeRouter.params.subscribe(params => {
            this.apply_inspect_no = params.fid;
            this.metaData.forEach(elem => {
                elem.sku_data.forEach(element => {
                    if (element.apply_inspection_no == params.fid) {
                        this.data = elem;
                        this.currentApplyInsData = this.data.sku_data.find(
                            res => res.apply_inspection_no == this.apply_inspect_no,
                        );
                        this.storage.set('currentApplyInsData', this.currentApplyInsData);
                    }
                });
            });
            this.implementInspect.getInspectData(this.apply_inspect_no).subscribe(res => {
                this.data.sku_data.forEach(element => {
                    element.contract_data.forEach(item => {
                        if (res.contract_data) {
                            res.contract_data.forEach(sItem => {
                                if (item.contract_no == sItem.contract_no) {
                                    item.inspection_complete_no = sItem.sku_package_complete_num_total;
                                    item.inspection_complete_num = sItem.inspection_complete_num;
                                    item.data.forEach(sku => {
                                        sItem.contract_sku_desc.forEach(element => {
                                            if (sku.sku === element.sku) {
                                                sku.sku_package_complete_num = element.sku_package_complete_num;
                                                sku.sku_production_complete_num = element.sku_production_complete_num;
                                                sku.rate_res = element.rate_res;
                                                sku.made_in_china_res = element.made_in_china_res;
                                                sku.implement_photo = element.pic;
                                                sku.desc = element.desc;
                                            }
                                        });
                                    });
                                }
                            });
                        }
                    });
                });
            });
        });
    }

    showModal() {
        this.ec.showModal({
            component: QueueComponent,
        });
        this.uQueue.alreadyUpProgress = true;
    }

    photograph(p: Sku) {
        this.camera.getPicture(this.options).then(
            imageData => {
                if (!p.photo) {
                    p.photo = [];
                }
                const base64Image = 'data:image/jpeg;base64,' + imageData;
                p.photo.push(base64Image);
            },
            err => {
                this.ec.showToast({
                    message: '请重新拍照',
                    color: 'danger',
                });
            },
        );
    }

    regValid(e: any) {
        if (!/^(?!0+(?:\0+)?$)(?:[1-9]\d*|0)(?:\\d{1,2})?$/.test(e.detail.value)) {
            e.target.value = null;
        }
    }
    calcMust(e: any, n: any, p: string) {
        if (e.detail.value > n.quantity) {
            n[p] = null;
            this.ec.showToast({
                message: '不能大于申请验货数量',
                color: 'danger',
            });
        }
    }

    copy(p: any, sku: any) {
        let params: CopySkuParams = {
            apply_inspection_no: this.apply_inspect_no,
            sku: sku.sku,
            contract_no: p.contract_no,
        };
        this.implementInspect.copySku(params).subscribe(res => {
            console.log(res);
            this.ec.showToast({
                message: res.message,
                color: 'success',
            });
        });
    }

    toInspectSku(p: any, sku: any, type?: 'go' | 'save') {
        this.currentSku = this.currentApplyInsData.data.find(res => res.sku === sku.sku);

        if (this.verifyIpt(p, sku)) {
            const param: InspectFactoryParam = {
                apply_inspection_no: this.apply_inspect_no,
                contract_data: {
                    inspection_complete_no: p.inspection_complete_no,
                    contract_no: p.contract_no,
                    contract_sku_desc: {
                        sku_package_complete_num: sku.sku_package_complete_num, // 验货数量
                        photo: sku.photo, // 照片
                        sku: sku.sku, // sku
                        sku_production_complete_num: sku.sku_production_complete_num, // 大货生产完成数量
                        rate_res: sku.rate_res, // 大货生产完成数量
                        made_in_china_res: sku.made_in_china_res, // 大货生产完成数量
                        desc: sku.desc,
                    },
                },
            };
            this.implementInspect.inspectFactory(param).subscribe(res => {
                this.ec.showToast({
                    message: res.message,
                    position: 'top',
                    color: res.status === 1 ? 'success' : 'danger',
                });
                if (res.status && type == 'go') {
                    this.storage.set('CURRENT_IMPLEMENT_SKU', this.currentSku);
                    this.storage.set('CURRENT_FACTORY_DATA', this.data);
                    setTimeout(() => {
                        this.router.navigate(['/inspect-sku', p.contract_no]);
                    }, 1000);
                }
            });
        }
    }

    descEnter(e: string[], sku: any) {
        sku.desc = [];
        sku.desc = sku.desc.concat(e);
        console.log(sku);
    }

    verifyIpt(p: any, sku: any): boolean {
        let val = true;
        // if (!sku.sku_package_complete_num) {
        //     this.ec.showToast({
        //         message: '请输入sku验货数量',
        //         color: 'danger',
        //     });
        //     val = false;
        // } else if (!sku.sku_production_complete_num) {
        //     this.ec.showToast({
        //         message: '请输入sku生产完成数量',
        //         color: 'danger',
        //     });
        //     val = false;
        // } else if (!sku.photo) {
        // }
        return val;
    }

    calcContractNum(p: any, e?: any) {
        p.inspection_complete_no = p.inspection_complete_no = 0;
        p.data.forEach(element => {
            p.inspection_complete_num += element.sku_package_complete_num ? element.sku_package_complete_num : 0;
            p.inspection_complete_no += element.sku_package_complete_num ? element.sku_package_complete_num : 0;
        });
    }

    feedback(p: any, sku: any) {
        this.es.showModal({
            component: FeedbackComponent,
            componentProps: { apply_inspection_no: this.apply_inspect_no, sku: sku.sku, contract_no: p.contract_no },
        });
    }
}
