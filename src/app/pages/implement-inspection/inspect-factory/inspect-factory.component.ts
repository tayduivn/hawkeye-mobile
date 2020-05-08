import { StorageService } from 'src/app/services/storage.service';
import { PageEffectService } from './../../../services/page-effect.service';
import { Validators, FormArray, FormControl } from '@angular/forms';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { ImplementInspectService } from 'src/app/services/implement-inspect.service';
import { environment } from 'src/environments/environment';

export interface FactoryModel {
    environments: string[]; // 环境照片
    sampleRoom: string[]; // 样品间照片
    factoryOther: string[]; // 工厂其他图片
    isOriginAddress: number; // 是否是系统地址
    factoryAddress?: string; // 工厂地址
    isOriginContactPerson: number; // 是否是系统联系人
    worksNum: string; // 工人数
    receptionist?: Receptionist; // 联系人
    equipment: string; // 工厂设备名称
    remarks: string[]; // 备注
}

export interface Receptionist {
    name: string;
    tel?: string;
    post?: string;
}

@Component({
    selector: 'app-inspect-factory',
    templateUrl: './inspect-factory.component.html',
    styleUrls: ['./inspect-factory.component.scss'],
})
export class InspectFactoryComponent implements OnInit {
    imageReady: any = {
        environments: false,
        sampleRoom: false,
        factoryOther: false,
    };
    imgOrigin: string = environment.usFileUrl;
    inspectDetailImg: string;

    start_time: string = String(new Date('').getTime());
    constructor(
        private fb: FormBuilder,
        private ec: PageEffectService,
        private camera: Camera,
        private router: Router,
        private ac: ActivatedRoute,
        private storage: StorageService,
        private implementInspect: ImplementInspectService,
    ) {}

    get environments(): FormArray {
        return this.factoryModel.get('environments') as FormArray;
    }

    get sampleRoom(): FormArray {
        return this.factoryModel.get('sampleRoom') as FormArray;
    }

    get factoryOther(): FormArray {
        return this.factoryModel.get('factoryOther') as FormArray;
    }

    getListByTime() {}
    metaData: any[];
    apply_inspect_no: string;
    inspection_group_id: string;
    data: any = {
        factory_name: '',
        factory_contacts: '',
    };
    currentApplyInsData: any;

    factoryModel: FormGroup = new FormGroup({
        environments: this.fb.array([]),
        sampleRoom: this.fb.array([]),
        factoryOther: this.fb.array([]), // Validators.required
        factoryAddress: this.fb.group({
            text: this.fb.control(this.data.factoryAddress),
            isTrue: this.fb.control('1'),
        }),

        worksNum: this.fb.control('', [Validators.required]),
        receptionist: this.fb.group({
            name: this.fb.control(this.data.factory_contacts),
            post: this.fb.control(''),
            tel: this.fb.control(''),
            isTrue: this.fb.control('1'),
        }),
        equipment: this.fb.control('', [Validators.required]),
        trulyInspectionDate: this.fb.control('', [Validators.required]),
        remarks: this.fb.array(['']),
    });

    options: CameraOptions = {
        quality: 100,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
    };

    ngOnInit() {
        const IMPLEMENT_META_DATA = this.storage.get('IMPLEMENT-INSPECTION-META-DATA');
        this.ac.params.subscribe(res => {
            this.apply_inspect_no = res.fid;
            this.inspection_group_id = res.apply_group_id;
            IMPLEMENT_META_DATA.forEach(elem => {
                elem.sku_data.forEach(element => {
                    if (element.apply_inspection_no == res.fid) {
                        this.data = elem;
                        this.currentApplyInsData = this.data.sku_data.find(
                            res => res.apply_inspection_no == this.apply_inspect_no,
                        );
                    }
                });
            });
        });
        this.getData();
    }

    setPhoto(e: any[], type: 'environment' | 'sampleRoom' | 'factoryOther') {
        if (e && e.length) {
            (this.factoryModel.get(type) as FormArray).clear();
            for (let i = 0; i < e.length; i++) {
                (this.factoryModel.get(type) as FormArray).push(new FormControl(''));
            }
        } else {
            (this.factoryModel.get(type) as FormArray).clear();
        }
        (this.factoryModel.get(type) as FormArray).setValue(e);
    }

    remove(type: 'environment' | 'sampleRoom' | 'factoryOther', i: number) {
        this[type].controls.splice(i, 1);
    }

    addRemarks() {
        (this.factoryModel.get('remarks') as FormArray).push(this.fb.control(''));
        console.log(this.factoryModel.get('remarks'));
    }

    getData() {
        this.implementInspect.getInspectData(this.apply_inspect_no, this.inspection_group_id).subscribe(res => {
            this.inspectDetailImg = (res.review_content?res.review_content[0]:null)

            if (
                (res.factory_data.environments && res.factory_data.environments.length) ||
                (res.factory_data.sampleRoom && res.factory_data.sampleRoom.length) ||
                (res.factory_data.factoryOther && res.factory_data.factoryOther.length)
            ) {
                this.ec.showLoad({
                    message: '加载中……',
                    backdropDismiss: false,
                });
            }
            if (res.factory_data.remarks) {
                res.factory_data.remarks.forEach((element, i) => {
                    element && (this.factoryModel.get('remarks') as FormArray).push(this.fb.control(''));
                });
            }
            this.factoryModel.patchValue({
                factoryAddress: {
                    text: res.factory_data.factoryAddress.text,
                    isTrue: res.factory_data.factoryAddress.isTrue,
                },
                worksNum: res.factory_data.worksNum,
                receptionist: {
                    name: res.factory_data.receptionist.name,
                    post: res.factory_data.receptionist.post,
                    tel: res.factory_data.receptionist.tel,
                    isTrue: res.factory_data.receptionist.isTrue,
                },
                trulyInspectionDate: res.factory_data.trulyInspectionDate,
                equipment: res.factory_data.equipment,
                remarks: res.factory_data.remarks,
            });

            setTimeout(() => {
                if (res.factory_data.environments && res.factory_data.environments.length) {
                    for (let i = 0; i < res.factory_data.environments.length; i++) {
                        (this.factoryModel.get('environments') as FormArray).push(new FormControl(''));
                    }
                    (this.factoryModel.get('environments') as FormArray).setValue(res.factory_data.environments);
                }

                if (res.factory_data.sampleRoom && res.factory_data.sampleRoom.length) {
                    // tslint:disable-next-line: prefer-for-of
                    for (let i = 0; i < res.factory_data.sampleRoom.length; i++) {
                        (this.factoryModel.get('sampleRoom') as FormArray).push(new FormControl(''));
                    }
                    (this.factoryModel.get('sampleRoom') as FormArray).setValue(res.factory_data.sampleRoom);
                }

                if (res.factory_data.factoryOther && res.factory_data.factoryOther.length) {
                    // tslint:disable-next-line: prefer-for-of
                    for (let i = 0; i < res.factory_data.factoryOther.length; i++) {
                        (this.factoryModel.get('factoryOther') as FormArray).push(new FormControl(''));
                    }
                    (this.factoryModel.get('factoryOther') as FormArray).setValue(res.factory_data.factoryOther);
                }
                this.imageReady.environments = this.imageReady.sampleRoom = this.imageReady.factoryOther = true;
                this.imageSetReady();
            }, 2000);
        });
    }

    imageSetReady() {
        if (this.imageReady.environments && this.imageReady.sampleRoom && this.imageReady.factoryOther) {
            this.ec.clearEffectCtrl();
        }
    }

    toInspectPo() {
        if (!(this.factoryModel.get('environments') as FormArray).value.length) {
            this.ec.showAlert({
                message: ' 工厂环境照片是必传项 ',
            });
            // return;
        }

        this.ec.showLoad({
            message: ' 正在上传 ',
            backdropDismiss: false,
        });

        this.implementInspect
            .inspectFactory({
                factory_data: this.factoryModel.value,
                apply_inspection_no: this.apply_inspect_no,
                inspection_group_id: this.inspection_group_id,
            })
            .subscribe(res => {
                this.ec.showToast({
                    message: res.message,
                    position: 'top',
                    color: res.status == 1 ? 'success' : 'danger',
                });
                if (res.status === 1) {
                    setTimeout(() => {
                        this.router.navigate(['inspect-po', this.apply_inspect_no]);
                    }, 1000);
                }
            });
    }

    descEnter(p: any) {
        (this.factoryModel.get('remarks') as FormArray).clear();
        for (let i = 0; i < p.length; i++) {
            (this.factoryModel.get('remarks') as FormArray).push(new FormControl(''));
        }
        (this.factoryModel.get('remarks') as FormArray).setValue(p);
        console.log(this.factoryModel.value);
    }
}
