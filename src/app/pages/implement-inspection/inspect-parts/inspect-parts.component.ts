import { Component, OnInit } from '@angular/core';
import { UploadQueueService } from '../upload-queue.service';
import { PageEffectService } from 'src/app/services/page-effect.service';
import { QueueComponent } from '../queue/queue.component';
import { ActivatedRoute } from '@angular/router';
import { PartService } from 'src/app/services/part.service';
import { FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-inspect-parts',
    templateUrl: './inspect-parts.component.html',
    styleUrls: ['./inspect-parts.component.scss'],
})
export class InspectPartsComponent implements OnInit {
    contract_no: string = '';
    apply_inspection_no: string;

    partsModal: FormGroup = null;
    metadata: any = {};
    constructor(
        private uQueue: UploadQueueService,
        private es: PageEffectService,
        private activeRoute: ActivatedRoute,
        private partsCtrl: PartService,
        private fb: FormBuilder,
    ) {
        activeRoute.params.subscribe(res => {
            this.contract_no = res.contract_no;
            this.apply_inspection_no = res.apply_inspection_no;
        });
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
        this.partsModal = this.fb.group({
            apply_inspection_no: this.fb.control(this.apply_inspection_no),
            contract_no: this.fb.control(this.contract_no),
            box_data: this.fb.group({
                accessory_shipping_mark: this.fb.group({
                    desc: this.fb.array([]),
                    pic: this.fb.array([]),
                }),
                accessory_size: this.fb.group({
                    size_width: this.fb.group({
                        text: this.fb.control(''),
                        pic: this.fb.array([]),
                    }),
                    size_height: this.fb.group({
                        text: this.fb.control(''),
                        pic: this.fb.array([]),
                    }),
                    size_length: this.fb.group({
                        text: this.fb.control(''),
                        pic: this.fb.array([]),
                    }),
                    desc: this.fb.array([]),
                }),
                accessory_gross_weight: this.fb.group({
                    text: this.fb.control(''),
                    desc: this.fb.array([]),
                    pic: this.fb.array([]),
                }),
            }),
        });
    }

    /**
     * app-item-by-item-desc callback
     * @param e     description array
     * @param type  formGroup item
     */
    descEnter(e: string[], type: string) {
        console.log(e, type);
        ((this.partsModal.get('box_data').get(type) as FormGroup).get('desc') as FormArray).clear();
        for (let i = 0; i < e.length; i++) {
            ((this.partsModal.get('box_data').get(type) as FormGroup).get('desc') as FormArray).push(
                new FormControl(''),
            );
        }
        ((this.partsModal.get('box_data').get(type) as FormGroup).get('desc') as FormArray).setValue(e);
    }

    getData() {
        this.partsCtrl
            .getPartsInfo({ apply_inspection_no: this.apply_inspection_no, contract_no: this.contract_no })
            .subscribe(res => {
                this.partsModal.reset();
                this.metadata = res.data;

                for (const key in res.data) {
                    const element = res.data[key];
                    console.log(element);
                    this.dynamicBuildFC(element.desc, key, 'desc');
                    this.dynamicBuildFC(element.pic, key, 'pic');

                    if (key === 'accessory_size') {
                        this.dynamicBuildFC(element.desc, key, 'desc');

                        this.dynamicBuildFC(element.size_height.pic, key, 'pic', 'size_height');
                        this.dynamicBuildFC(element.size_width.pic, key, 'pic', 'size_width');
                        this.dynamicBuildFC(element.size_length.pic, key, 'pic', 'size_length');
                    }
                }
                this.partsModal.patchValue({
                    apply_inspection_no: this.apply_inspection_no,
                    contract_no: this.contract_no,
                    box_data: {
                        accessory_shipping_mark: {
                            desc:
                                res.data.accessory_shipping_mark.desc && res.data.accessory_shipping_mark.desc.length
                                    ? res.data.accessory_shipping_mark.desc
                                    : [],
                            pic:
                                res.data.accessory_shipping_mark.pic && res.data.accessory_shipping_mark.pic.length
                                    ? res.data.accessory_shipping_mark.pic
                                    : [],
                        },
                        accessory_size: {
                            size_width: {
                                text: res.data.accessory_size.size_width.text,
                                pic:
                                    res.data.accessory_size.size_width.pic &&
                                    res.data.accessory_size.size_width.pic.length
                                        ? res.data.accessory_size.size_width.pic
                                        : [],
                            },
                            size_height: {
                                text: res.data.accessory_size.size_height.text,
                                pic:
                                    res.data.accessory_size.size_height.pic &&
                                    res.data.accessory_size.size_height.pic.length
                                        ? res.data.accessory_size.size_height.pic
                                        : [],
                            },
                            size_length: {
                                text: res.data.accessory_size.size_length.text,
                                pic:
                                    res.data.accessory_size.size_length.pic &&
                                    res.data.accessory_size.size_length.pic.length
                                        ? res.data.accessory_size.size_length.pic
                                        : [],
                            },
                            desc:
                                res.data.accessory_size.desc && res.data.accessory_size.desc.length
                                    ? res.data.accessory_size.desc
                                    : [],
                        },
                        accessory_gross_weight: {
                            text: res.data.accessory_gross_weight.text ? res.data.accessory_gross_weight.text : '',
                            desc:
                                res.data.accessory_gross_weight.desc && res.data.accessory_gross_weight.desc.length
                                    ? res.data.accessory_gross_weight.desc
                                    : [1, 34, 32],
                            pic:
                                res.data.accessory_gross_weight.pic && res.data.accessory_gross_weight.pic.length
                                    ? res.data.accessory_gross_weight.pic
                                    : [],
                        },
                    },
                });
                console.log(this.partsModal.value);
            });
    }

    dynamicBuildFC(
        ary: string[],
        type: string,
        item: 'desc' | 'pic' | 'video',
        other?: 'size_width' | 'size_length' | 'size_height',
    ) {
        if (!ary) return;
        let box: FormGroup = !other
            ? (this.partsModal.get('box_data') as FormGroup)
            : ((this.partsModal.get('box_data') as FormGroup).get('accessory_size') as FormGroup);

        ary.map(res => (box.get(other ? other : type).get(item) as FormArray).push(new FormControl('')));
    }

    save(): Observable<any> {
        return new Observable(observer => {
            this.partsCtrl.saveAccessoryInfo(this.partsModal.value).subscribe(res => {
                this.es.showToast({
                    message: res.message,
                    color: res.status ? 'success' : 'danger',
                });
                observer.next();
            });
        });
    }
}
