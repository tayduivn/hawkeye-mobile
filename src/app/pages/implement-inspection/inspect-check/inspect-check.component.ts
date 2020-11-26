import { Component, OnInit } from '@angular/core';
import { UploadQueueService } from '../upload-queue.service';
import { PageEffectService } from 'src/app/services/page-effect.service';
import { QueueComponent } from '../queue/queue.component';
import { FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PartService } from 'src/app/services/part.service';
import { Observable } from 'rxjs';
import { ScanComponent } from 'src/app/widget/scan/scan.component';

@Component({
    selector: 'app-inspect-check',
    templateUrl: './inspect-check.component.html',
    styleUrls: ['./inspect-check.component.scss'],
})
export class InspectCheckComponent implements OnInit {
    skuInfo: any = {};
    sku: string;
    metaData: any = {};
    constructor(
        private uQueue: UploadQueueService,
        private es: PageEffectService,
        private fb: FormBuilder,
        private activeRoute: ActivatedRoute,
        private partCtrl: PartService,
    ) {
        activeRoute.params.subscribe(res => {
            this.sku = res.sku;
            this.apply_inspection_no = res.apply_inspection_no;
            this.contract_no = res.contract_no;
            this.getData();
        });
    }

    ngOnInit() {
        this.skuInspectModel = this.fb.group({
            apply_inspection_no: this.fb.control(this.apply_inspection_no),
            contract_no: this.fb.control(this.contract_no),
            sku: this.fb.control(this.sku),
            box_data: this.fb.group({
                accessory_mark: this.fb.group({
                    desc: this.fb.array([]),
                    pic: this.fb.array([]),
                }),
                accessory_num: this.fb.group({
                    text: this.fb.control(''),
                    desc: this.fb.array([]),
                    pic: this.fb.array([]),
                }),
                accessory_bar_code: this.fb.group({
                    text: this.fb.control(''),
                    desc: this.fb.array([]),
                    isTrue: this.fb.control(0),
                    pic: this.fb.array([]),
                }),
                accessory_details: this.fb.group({
                    desc: this.fb.array([]),
                    pic: this.fb.array([]),
                }),
            }),
        });
    }
    skuInspectModel: FormGroup = null;
    alreadyUpProgress: boolean = this.uQueue.alreadyUpProgress;
    showModal() {
        this.es.showModal({
            component: QueueComponent,
        });
        this.uQueue.alreadyUpProgress = true;
    }

    getData() {
        this.partCtrl
            .getPartSkuInfo({
                apply_inspection_no: this.apply_inspection_no,
                contract_no: this.contract_no,
                sku: this.sku,
            })
            .subscribe(res => {
                this.metaData = res.accessory_info;
                for (const key in res) {
                    if (key !== 'accessory_info') {
                        const element = res[key];
                        this.dynamicBuildFC(element.desc, key, 'desc');
                        this.dynamicBuildFC(element.pic, key, 'pic');
                    }
                }

                this.skuInspectModel.patchValue({
                    apply_inspection_no: this.apply_inspection_no,
                    contract_no: this.contract_no,
                    sku: this.sku,
                    box_data: {
                        accessory_mark: {
                            desc:
                                res.accessory_mark.desc && res.accessory_mark.desc.length
                                    ? res.accessory_mark.desc
                                    : [],
                            pic: res.accessory_mark.pic && res.accessory_mark.pic.length ? res.accessory_mark.pic : [],
                        },
                        accessory_num: {
                            text: res.accessory_num.text,
                            desc: res.accessory_num.desc && res.accessory_num.desc.length ? res.accessory_num.desc : [],
                            pic: res.accessory_num.pic && res.accessory_num.pic.length ? res.accessory_num.pic : [],
                        },
                        accessory_bar_code: {
                            text: res.accessory_bar_code.text,
                            desc:
                                res.accessory_bar_code.desc && res.accessory_bar_code.desc.length
                                    ? res.accessory_bar_code.desc
                                    : [],
                            pic:
                                res.accessory_bar_code.pic && res.accessory_bar_code.pic.length
                                    ? res.accessory_bar_code.pic
                                    : [],
                        },
                        accessory_details: {
                            desc:
                                res.accessory_details.desc && res.accessory_details.desc.length
                                    ? res.accessory_details.desc
                                    : [],
                            pic:
                                res.accessory_details.pic && res.accessory_details.pic.length
                                    ? res.accessory_details.pic
                                    : [],
                        },
                    },
                });

                console.log(this.skuInspectModel);
            });
    }

    dynamicBuildFC(ary: string[], type: string, item: 'desc' | 'pic' | 'video') {
        if (!ary) return;
        let box: FormGroup = this.skuInspectModel.get('box_data') as FormGroup;
        ary.map(res => (box.get(type).get(item) as FormArray).push(new FormControl('')));
    }

    barCode = '';
    apply_inspection_no;
    contract_no;

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

    save(): Observable<any> {
        if (this.barCode === this.skuInspectModel.value.box_data.accessory_bar_code.text) {
            this.skuInspectModel.patchValue({
                box_data: {
                    accessory_bar_code: {
                        isTrue: 1,
                    },
                },
            });
        }
        return new Observable(observer => {
            this.partCtrl.saveAccessory(this.skuInspectModel.value).subscribe(res => {
                console.log(res);
                this.es.showToast({
                    message: res.message,
                    color: res.status ? 'success' : 'danger',
                });
                observer.next();
            });
        });
    }

    /**
     * app-item-by-item-desc callback
     * @param e     description array
     * @param type  formGroup item
     */
    descEnter(e: string[], type: string) {
        console.log(e, type);
        ((this.skuInspectModel.get('box_data').get(type) as FormGroup).get('desc') as FormArray).clear();
        for (let i = 0; i < e.length; i++) {
            ((this.skuInspectModel.get('box_data').get(type) as FormGroup).get('desc') as FormArray).push(
                new FormControl(''),
            );
        }
        ((this.skuInspectModel.get('box_data').get(type) as FormGroup).get('desc') as FormArray).setValue(e);
    }
}
