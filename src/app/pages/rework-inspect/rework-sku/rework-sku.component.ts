import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import {
    FormGroup,
    FormBuilder,
    FormArray,
    FormControl,
    Validators,
    ValidatorFn,
    AbstractControl,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ReworkService } from '../rework.service';
import { PageEffectService } from 'src/app/services/page-effect.service';
import { ScanComponent } from 'src/app/widget/scan/scan.component';
import { UploadQueueService } from '../../implement-inspection/upload-queue.service';
import { QueueComponent } from '../../implement-inspection/queue/queue.component';

@Component({
    selector: 'app-rework-sku',
    templateUrl: './rework-sku.component.html',
    styleUrls: ['./rework-sku.component.scss'],
})
export class ReworkSkuComponent implements OnInit {
    sku: string = '';
    contract_no: string = '';
    apply_inspection_no: string = '';

    skuInfo: any = {
        name: '',
    };
    barCode;
    skuInspectModel: FormGroup;
    imgOrigin: string = environment.fileUrlPath;
    imgOriginUs: string = environment.usFileUrl;
    unpackingPercent: number = 0;
    unpackingNum: number;
    question: {
        desc: '';
        review_summary_img: [];
        review_summary_video: [];
    } = {
        desc: '',
        review_summary_img: [],
        review_summary_video: [],
    };
    constructor(
        private fb: FormBuilder,
        private activeRoute: ActivatedRoute,
        private es: PageEffectService,
        private reworkCtrl: ReworkService,
        private uQueue: UploadQueueService,
    ) {
        activeRoute.params.subscribe(res => {
            this.apply_inspection_no = res.apply_inspection_no;
            this.contract_no = res.contract_no;
            this.sku = res.sku;
            this.skuInspectModel = this.fb.group({
                sku: this.fb.control(this.sku),
                apply_inspection_no: this.fb.control(this.apply_inspection_no),
                contract_no: this.fb.control(this.contract_no),
                inspectionDate: this.fb.control(''),
                unpackingNum: this.fb.control('', [Validators.required, this.customValidator(/^[0-9]*[1-9][0-9]*$/)]),
                unpackingPercent: this.fb.control(''),
                barCode: this.fb.group({
                    text: this.fb.control(''),
                    isTrue: this.fb.control(''),
                    photos: this.fb.array([]),
                    desc: this.fb.array([]),
                }),
                sumUp: this.fb.group({
                    videos: this.fb.array([]),
                    photos: this.fb.array([]),
                    desc: this.fb.control(''),
                }),
            });
        });
    }

    customValidator(Re: RegExp): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } | null => {
            const forbidden = Re.test(control.value);
            return forbidden ? { forbiddenName: { value: control.value } } : null;
        };
    }

    alreadyUpProgress: boolean = this.uQueue.alreadyUpProgress;
    showModal() {
        this.es.showModal({
            component: QueueComponent,
        });
        this.uQueue.alreadyUpProgress = true;
    }

    ngOnInit() {
        this.getData();
    }

    play(p: any) {}

    scan() {
        const modal = this.es.showModal(
            {
                component: ScanComponent,
            },
            (res: { value: any }) => {
                this.barCode = res.value;
            },
        );
    }

    descEnter(e: string[], type: string) {
        (this.skuInspectModel.get(type).get('desc') as any).clear();
        for (let i = 0; i < e.length; i++) {
            ((this.skuInspectModel.get(type).get('desc') as any) as FormArray).push(new FormControl(''));
        }
        ((this.skuInspectModel.get(type) as FormGroup).get('desc') as FormArray).setValue(e);
    }

    getData() {
        this.reworkCtrl
            .getReworkSkuInfo({
                sku: this.sku,
                contract_no: this.contract_no,
                apply_inspection_no: this.apply_inspection_no,
            })
            .subscribe(res => {
                this.skuInfo = res.data.sku_info;
                this.question = (res.data as any).rework_desc;
                this.dynamicCreateDescForm(res.data.sku_info.barCode.desc, 'barCode');
                if (
                    res.data.sku_info.barCode &&
                    res.data.sku_info.barCode.photos &&
                    res.data.sku_info.barCode.photos.length
                ) {
                    for (let i = 0; i < res.data.sku_info.barCode.photos.length; i++) {
                        (this.skuInspectModel.get('barCode').get('photos') as FormArray).push(new FormControl(''));
                    }
                }
                if (
                    res.data.sku_info.sumUp &&
                    res.data.sku_info.sumUp.photos &&
                    res.data.sku_info.sumUp.photos.length
                ) {
                    for (let i = 0; i < res.data.sku_info.sumUp.photos.length; i++) {
                        (this.skuInspectModel.get('sumUp').get('photos') as FormArray).push(new FormControl(''));
                    }
                }

                if (
                    res.data.sku_info.sumUp &&
                    res.data.sku_info.sumUp.videos &&
                    res.data.sku_info.sumUp.videos.length
                ) {
                    for (let i = 0; i < res.data.sku_info.sumUp.videos.length; i++) {
                        (this.skuInspectModel.get('sumUp').get('videos') as FormArray).push(new FormControl(''));
                    }
                }
                this.skuInspectModel.patchValue({
                    inspectionDate: res.data.sku_info.inspectionDate,
                    unpackingNum: res.data.sku_info.unpackingNum,
                    unpackingPercent: res.data.sku_info.unpackingPercent,
                    barCode: {
                        text: res.data.sku_info.barCode.text,
                        isTrue: res.data.sku_info.barCode.isTrue,
                        photos: res.data.sku_info.barCode.photos ? res.data.sku_info.barCode.photos : [],
                        desc: res.data.sku_info.barCode.desc ? res.data.sku_info.barCode.desc : [],
                    },
                    sumUp: {
                        videos: res.data.sku_info.sumUp.videos ? res.data.sku_info.sumUp.videos : [],
                        photos: res.data.sku_info.sumUp.photos ? res.data.sku_info.sumUp.photos : [],
                        desc: res.data.sku_info.sumUp.desc ? res.data.sku_info.sumUp.desc : [],
                    },
                });
            });
    }

    dynamicCreateDescForm(ary: Array<any>, type: string) {
        if (!ary || !ary.length) return;
        ary.forEach(res => {
            (this.skuInspectModel.get(type).get('desc') as FormArray).push(new FormControl(''));
        });
    }

    numChange(e: any) {
        if (
            e.detail.value.indexOf('-') !== -1 ||
            e.detail.value.indexOf('.') !== -1 ||
            e.detail.value > this.skuInfo.quantity
        ) {
            this.unpackingNum = null;
            this.skuInspectModel.patchValue({
                unpackingNum: '',
            });
        }
        if (!this.skuInfo.quantity) return;
        this.unpackingPercent = (Number(e.detail.value) / Number(this.skuInfo.quantity)) * 100;
    }

    submit() {
        this.skuInspectModel.patchValue({
            sku: this.sku,
            apply_inspection_no: this.apply_inspection_no,
            contract_no: this.contract_no,
            unpackingPercent: this.unpackingPercent,
            barCode: {
                isTrue: this.skuInspectModel.value.barCode.text == this.barCode ? 1 : 0,
            },
        });
        this.reworkCtrl.submitReworkSku(this.skuInspectModel.value).subscribe(res => {
            this.es.showToast({
                message: res.message,
                color: res.status ? 'success' : 'danger',
            });
        });
    }
}
