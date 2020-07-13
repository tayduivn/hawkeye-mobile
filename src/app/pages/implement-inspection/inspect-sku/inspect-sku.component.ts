import { Observable } from 'rxjs';
import { ImplementInspectService } from 'src/app/services/implement-inspect.service';
import { environment } from './../../../../environments/environment';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { ScanComponent } from './../../../widget/scan/scan.component';
import { PageEffectService } from 'src/app/services/page-effect.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Sku } from 'src/app/widget/sku-info/sku-info.component';
import { StorageService } from 'src/app/services/storage.service';
import { ActivatedRoute } from '@angular/router';
import { QueueComponent } from '../queue/queue.component';
import { UploadQueueService } from '../upload-queue.service';
import { debounceTime } from 'rxjs/operators';
import { InspectCacheService } from '../inspect-cache.service';

export interface SkuUploadData {
    spotCheckNum?: number; // 抽检数量
    poNo?: string; // PO
    inner_box_data?: SkuInspectModel;
    outer_box_data?: SkuInspectModel;
    sku: string;
    data_type?: 'before' | 'after';
    apply_inspection_no: string;
    is_inner_box: number;
    contract_no: string;
}

export interface SkuInspectModel {
    shippingMarks: InspectItem; // 唛头
    size: Box; // 尺寸
    barCode: InspectItem; // 条码
    grossWeight: InspectItem; // 毛重
    throwBox?: InspectItem; // 摔箱测试
    packing?: InspectItem; // 包装
    layout?: InspectItem; // 摆放图
    productDetail?: InspectItem; //产品细节图
    instructions?: InspectItem; // 说明书
    crews?: InspectItem; //螺丝包
    whole?: InspectItem; // 组装后整体
    productSize?: Box; // 产品尺寸
    netWeight?: InspectItem; // 净重
    function?: InspectItem; // 功能测试
    bearing?: InspectItem; // 承重
    waterContent?: InspectItem; // 含水量测试
    parts?: Parts; // 配件
    sumUp?: InspectItem; //总结
    desc?: InspectItem; //备注
}

export interface Box {
    length: string; // 长
    width: string; // 宽
    height: string; // 高
    desc?: string[]; // 备注
    photos?: string[]; // 照片
    videos?: string[]; // 视频
}

export interface Parts {
    no: string;
    name?: string;
    inspect: InspectItem;
    desc?: string[];
}

export interface InspectItem {
    text?: string;
    desc?: string[];
    photos?: string[];
    videos?: string[];
}

export const ToggleItem: any = [
    {
        key: 'beforeUnpacking',
        value: '开箱前',
    },
    {
        key: 'afterUnpacking',
        value: '开箱后',
    },
    {
        key: 'requirement',
        value: '验货要求',
    },
];

export type ExamineStatus = 'passed' | 'notPass' | 'undetermined' | 'accord' | 'notAccord';

export type SpeedStatus = 'high' | 'low';

@Component({
    selector: 'app-inspect-sku',
    templateUrl: './inspect-sku.component.html',
    styleUrls: ['./inspect-sku.component.scss'],
})
export class InspectSkuComponent implements OnInit {
    @ViewChild('grossWeight', { static: false }) grossWeight: ElementRef;
    speed: boolean = false;
    otherGrossWeight: boolean = false;
    data: Sku = null;
    factory: any = null;
    barCode: string = '';
    outerBarCode: string = '';
    rateStatus: 'outer' | 'inner' = 'inner';
    toggleItem: any[] = ToggleItem;
    currentToggle: any = ToggleItem[0];
    imgOrigin: string = environment.fileUrlPath;
    inspectionRequire: any = {};
    contractNo: string;

    inspectRequireSegment: boolean = false;
    productSize: any[] = [];
    size: any[] = [];
    currentApplyInsData;
    showProgress: boolean = false;
    constructor(
        private es: PageEffectService,
        private fb: FormBuilder,
        private storage: StorageService,
        private activeRouter: ActivatedRoute,
        private implementService: ImplementInspectService,
        private uQueue: UploadQueueService,
        private inspectCache: InspectCacheService,
    ) {}

    SkuInspectModel: FormGroup;

    alreadyUpProgress: boolean = this.uQueue.alreadyUpProgress;
    showModal() {
        this.es.showModal({
            component: QueueComponent,
        });
        this.uQueue.alreadyUpProgress = true;
    }

    ngOnInit() {
        this.data = this.storage.get('CURRENT_IMPLEMENT_SKU');
        this.factory = this.storage.get('CURRENT_FACTORY_DATA');
        this.currentApplyInsData = this.storage.get('currentApplyInsData');
        this.rateStatus = this.data.rate_container > 1 ? 'outer' : 'inner';
        this.activeRouter.params.subscribe(res => {
            this.contractNo = res.contract_no;
        });
        let sizeModel = null;
        if (this.data.rate_container == 1) {
            sizeModel = this.fb.group({
                length: this.fb.group({
                    text: this.fb.control(''),
                    pic: this.fb.array([]),
                    num: this.fb.control(''),
                }),
                width: this.fb.group({
                    text: this.fb.control(''),
                    pic: this.fb.array([]),
                    num: this.fb.control(''),
                }),
                height: this.fb.group({
                    text: this.fb.control(''),
                    pic: this.fb.array([]),
                    num: this.fb.control(''),
                }),
                desc: this.fb.array([]),
            });
        } else {
            sizeModel = [];
        }

        this.SkuInspectModel = this.fb.group({
            spotCheckNum: this.fb.control(''),
            poNo: this.fb.control(''),
            poNoRes: this.fb.control('accord'),
            inner_box_data: this.fb.group({
                shippingMarks: this.fb.group({
                    desc: this.fb.array([]),
                    photos: this.fb.array([]),
                }),
                size: sizeModel,
                barCode: this.fb.group({
                    isTrue: this.fb.control(''),
                    desc: this.fb.array([]),
                    photos: this.fb.array([]),
                    text: this.fb.control(''),
                    agreement: this.fb.control(''),
                }),
                grossWeight: this.fb.group({
                    text1: this.fb.control(''),
                    text2: this.fb.control(''),
                    text3: this.fb.control(''),
                    text4: this.fb.control(''),
                    text5: this.fb.control(''),
                    desc: this.fb.array([]),
                    photos: this.fb.array([]),
                }),
                sizeDesc: this.fb.group({
                    desc: this.fb.array([]),
                }),
                throwBox: this.fb.group({
                    text: this.fb.control(''),
                    isPass: this.fb.control('1'),
                    desc: this.fb.array([]),
                    photos: this.fb.array([]),
                    videos: this.fb.array([]),
                }),
                packing: this.fb.group({
                    isTrue: this.fb.control('none'),
                    desc: this.fb.array([]),
                    is_double_carton: this.fb.control('1'),
                    packingType: this.fb.control('none'),
                    photos: this.fb.array([]),
                    packingBelt: this.fb.control('undetermined'),
                    rateWeightMark: this.fb.control('undetermined'),
                }),
                layout: this.fb.group({
                    desc: this.fb.array(['']),
                    photos: this.fb.array([]),
                }),
                productDetail: this.fb.group({
                    desc: this.fb.array([]),
                    photos: this.fb.array([]),
                }),
                productSize: [],
                productSizeDesc: this.fb.group({
                    desc: this.fb.array([]),
                }),
                instructions: this.fb.group({
                    isHas: this.fb.control('1'),
                    type: this.fb.control(''),
                    desc: this.fb.array(['']),
                    photos: this.fb.array([]),
                    instructionsType: this.fb.control('1'),
                }),
                crews: this.fb.group({
                    isTrue: this.fb.control(''),
                    photos: this.fb.array([]),
                    desc: this.fb.array([]),
                }),
                whole: this.fb.group({
                    desc: this.fb.array([]),
                    photos: this.fb.array([]),
                }),
                disputes: this.fb.group({
                    text: this.fb.control(''),
                    photos: this.fb.array([]),
                }),
                netWeight: this.fb.group({
                    textOne: this.fb.control(''),
                    textTwo: this.fb.control(''),
                    desc: this.fb.array([]),
                    photos: this.fb.array([]),
                }),
                appearance: this.fb.group({
                    desc: this.fb.array([]),
                    photos: this.fb.array([]),
                    videos: this.fb.array([]),
                }),
                function: this.fb.group({
                    desc: this.fb.array([]),
                    videos: this.fb.array([]),
                    photos: this.fb.array([]),
                }),
                bearing: this.fb.group({
                    desc: this.fb.array([]),
                    photos: this.fb.array([]),
                    videos: this.fb.array([]),
                }),
                waterContent: this.fb.group({
                    desc: this.fb.array([]),
                    photos: this.fb.array([]),
                    videos: this.fb.array([]),
                }),
                sumUp: this.fb.group({
                    textOne: this.fb.control(''),
                    textTwo: this.fb.control(''),
                    prodSchedule: this.fb.control('undetermined'),
                    package: this.fb.control('undetermined'),
                    marksAndCode: this.fb.control('undetermined'),
                    prodInfo: this.fb.control('undetermined'),
                    qualityTechnology: this.fb.control('undetermined'),
                    fieldTest: this.fb.control('undetermined'),
                }),
                desc: this.fb.group({
                    desc: this.fb.array([]),
                    photos: this.fb.array([]),
                }),
            }),
            outer_box_data: this.fb.group({
                shippingMarks: this.fb.group({
                    photos: this.fb.array([]),
                    desc: this.fb.array([]),
                }),
                size: this.fb.group({
                    length: this.fb.group({
                        text: this.fb.control(''),
                        num: this.fb.control(''),
                        pic: this.fb.array([]),
                    }),
                    width: this.fb.group({
                        text: this.fb.control(''),
                        pic: this.fb.array([]),
                        num: this.fb.control(''),
                    }),
                    height: this.fb.group({
                        text: this.fb.control(''),
                        num: this.fb.control(''),
                        pic: this.fb.array([]),
                    }),
                    desc: this.fb.array([]),
                }),
                barCode: this.fb.group({
                    isTrue: this.fb.control(''),
                    desc: this.fb.array([]),
                    photos: this.fb.array([]),
                    text: this.fb.control(''),
                    agreement: this.fb.control(''),
                }),
                grossWeight: this.fb.group({
                    text1: this.fb.control(''),
                    text2: this.fb.control(''),
                    text3: this.fb.control(''),
                    text4: this.fb.control(''),
                    photos: this.fb.array([]),
                    text5: this.fb.control(''),
                    desc: this.fb.array([]),
                }),
                packing: this.fb.group({
                    isTrue: this.fb.control('none'),
                    type: this.fb.control('1'),
                    desc: this.fb.array([]),
                    photos: this.fb.array([]),
                    packingType: this.fb.control('none'),
                    is_double_carton: this.fb.control('none'),
                    packingBelt: this.fb.control('undetermined'),
                    rateWeightMark: this.fb.control('undetermined'),
                }),
                layout: this.fb.group({
                    desc: this.fb.array(['']),
                    photos: this.fb.array([]),
                }),
            }),
        });

        this.SkuInspectModel.valueChanges.pipe(debounceTime(900)).subscribe(res => {
            console.log(res);
            //此处存入缓存
            this.inspectCache.cacheInspectText(res);
        });
    }

    /**
     * 上传状态改变
     */
    speedChange(e: any) {
        let html = document.getElementsByTagName('html')[0];
        if (this.speed) html.setAttribute('style', '0');
        else html.setAttribute('style', '-webkit-filter: saturate(0.5);');
    }

    ionViewWillEnter() {
        //如果有缓存 则patch 防止闪退
        if (this.inspectCache.getInspectText()) {
            // this.SkuInspectModel.patchValue(this.inspectCache.getInspectText());
        }
        //再获取数据
        this.getBeforeBoxData();
    }

    /**
     * 计算毛重
     */
    calcGrossWeight() {
        let doms = this.grossWeight.nativeElement.querySelectorAll('input'),
            ary: number[] = [],
            compare: number[] = [];
        console.log(doms);

        for (var i = 0; i < doms.length; i++) {
            if (!doms[i].value) return;
            ary.push(doms[i].value);
        }

        compare = ary.sort((a, b) => a - b);
        this.otherGrossWeight = compare[0] * 1.2 < compare[compare.length - 1];
    }

    scan(p: 'inner' | 'outer') {
        const modal = this.es.showModal(
            {
                component: ScanComponent,
            },
            res => {
                this[p == 'inner' ? 'barCode' : 'outerBarCode'] = res.value;
                if (p == 'inner') {
                    this.innerCode = this.SkuInspectModel.value.inner_box_data.barCode.text == this.barCode ? '1' : '0';
                } else {
                    this.outerCode =
                        this.SkuInspectModel.value.outer_box_data.barCode.text == this.outerBarCode ? '1' : '0';
                }
            },
        );
    }
    innerCode = null;
    outerCode = null;
    /**
     * app-item-by-item-desc callback
     * @param e     description array
     * @param type  formGroup item
     * @param boxType   'inner' | 'outer'
     */
    descEnter(e: string[], type: string, boxType: 'inner' | 'outer') {
        ((this.SkuInspectModel.get(boxType + '_box_data').get(type) as FormGroup).get('desc') as FormArray).clear();
        for (let i = 0; i < e.length; i++) {
            ((this.SkuInspectModel.get(boxType + '_box_data').get(type) as FormGroup).get('desc') as FormArray).push(
                new FormControl(''),
            );
        }
        ((this.SkuInspectModel.get(boxType + '_box_data').get(type) as FormGroup).get('desc') as FormArray).setValue(e);
    }

    toggleBoxRate() {
        //切换内外箱
        this.currentToggle.key == 'beforeUnpacking' ? this.getBeforeBoxData() : this.getAfterBoxData();
    }

    setEmptyPhotos(obj: any): any {
        let e = obj['inner_box_data'];
        for (var key in e) {
            if (e[key] && e[key].photos) {
                e[key].photos = [];
            }
            if (key == 'productSize' && e['productSize'] && e['productSize'].length) {
                for (var i = 0; i < e['productSize'].length; i++) {
                    e['productSize'][i].pic = [];
                }
            }
        }
        return obj
    }

    /**
     * 保存
     */
    save(): Observable<any> {
        const saved = new Observable(observer => {
            //条码逻辑

            this.SkuInspectModel.value.inner_box_data.barCode.isTrue =
                this.SkuInspectModel.value.inner_box_data.barCode.text === (this.barCode && this.barCode.length ? '1' : '0');
            this.SkuInspectModel.value.outer_box_data.barCode.isTrue =
                this.SkuInspectModel.value.outer_box_data.barCode.text === (this.outerBarCode && this.outerBarCode.length ? '1' : '0');

            let postData = JSON.parse(JSON.stringify(this.SkuInspectModel.value));
            this.rateStatus == 'inner' ? delete postData.outer_box_data : delete postData.inner_box_data;
            postData.inner_box_data && (postData.inner_box_data.productSize = this.productSize);
            postData.inner_box_data && this.data.rate_container != 1 && (postData.inner_box_data.size = this.size);
            console.log(postData);

            //此处将深拷贝的元数据的photos置空 ，影响速度
            postData = this.setEmptyPhotos(postData);

            console.log(postData)
            this.es.showAlert({
                message: '正在保存……',
                backdropDismiss: true,
            });

            if (this.currentToggle.key == 'requirement') {
                observer.next(1);
                return;
            }
            this.implementService
                .submitSkuData(
                    postData,
                    this.data.sku,
                    this.currentApplyInsData.apply_inspection_no,
                    this.currentToggle.key == 'beforeUnpacking' ? 'before' : 'after',
                    this.rateStatus == 'inner' ? 1 : 2,
                    this.contractNo,
                )
                .subscribe(res => {
                    this.es.showToast({
                        message: res.message,
                        color: res.status ? 'success' : 'danger',
                    });
                    this.es.clearEffectCtrl();
                    observer.next(res.status);
                });
        });

        return saved;
    }

    /**
     * video callback
     */
    videoOver(e: any, type: string) {}

    /**
     * 切换 开箱前后 验货要求
     * @param ev  event
     */

    segmentChanged(ev: any) {
        this.inspectRequireSegment = ev.detail.value == 'requirement';

        this.save().subscribe(res => {
            if (!res) {
                return;
            }
            console.dir(this.SkuInspectModel);
            switch (ev.detail.value) {
                case 'beforeUnpacking':
                    this.getBeforeBoxData();
                    // this.save()
                    break;
                case 'afterUnpacking':
                    this.getAfterBoxData();
                    // this.save()
                    break;
                default: {
                }
            }
            this.currentToggle = this.toggleItem.find(res => res.key == ev.detail.value);
        });
    }

    /**
     * 动态生成FormControl
     * @param ary       desc||videos||photos
     * @param boxType   inner_box_data | 'outer_box_data
     * @param item      formGroup item
     * @param type      'desc' | 'videos' | 'photos'
     * @param sItem     size
     */
    dynamicBuildFC(ary: string[], boxType: string, item: string, type: string, sItem?: string) {
        if (item != 'spotCheckNum' && item != 'poNo' && item != 'poNoRes') {
            let box: FormGroup = this.SkuInspectModel.get(boxType) as FormGroup,
                formAry: FormArray = (box.get(item) as FormGroup).get(type) as FormArray;
            //先清空
            if (item != 'size' || (item == 'size' && type == 'desc')) {
                formAry && formAry.clear();
            } else {
                formAry = formAry.get(sItem) as FormArray;
                formAry && formAry.clear();
            }

            if (!ary || !(ary instanceof Array)) return;

            ary.forEach(res => {
                formAry && formAry.push(new FormControl(''));
                box = null;
            });
        }
    }

    /**
     * 获取开箱前数据
     */
    getBeforeBoxData() {
        this.implementService
            .getBeforeBoxData({
                apply_inspection_no: this.currentApplyInsData.apply_inspection_no,
                sku: this.data.sku,
                is_inner_box: this.rateStatus == 'inner' ? 1 : 2,
                contract_no: this.contractNo,
            })
            .subscribe(res => {
                if (!res) return;
                let box = res[this.rateStatus + '_box_data'];
                this.SkuInspectModel.reset();
                this.inspectionRequire = res[this.rateStatus + '_box_data']
                    ? res[this.rateStatus + '_box_data'].inspection_require
                    : {};
                for (let key in box) {
                    let element = box[key];
                    if (box.hasOwnProperty(key) && key != 'inspection_require' && key != 'size') {
                        if (!!element) {
                            this.dynamicBuildFC(element.desc, this.rateStatus + '_box_data', key, 'desc');
                            this.dynamicBuildFC(element.videos, this.rateStatus + '_box_data', key, 'videos');
                            this.dynamicBuildFC(element.photos, this.rateStatus + '_box_data', key, 'photos');
                        }
                    }
                    //多箱率的外箱和单向率的内箱是有size的
                    if (key == 'size' && (this.rateStatus == 'outer' || this.data.rate_container == 1)) {
                        if (!!element) {
                            let element = box[key];
                            this.dynamicBuildFC(element.desc, this.rateStatus + '_box_data', key, 'desc');
                            this.dynamicBuildFC(
                                element['length'].pic,
                                this.rateStatus + '_box_data',
                                key,
                                'length',
                                'pic',
                            );
                            this.dynamicBuildFC(
                                element['width'].pic,
                                this.rateStatus + '_box_data',
                                key,
                                'width',
                                'pic',
                            );
                            this.dynamicBuildFC(
                                element['height'].pic,
                                this.rateStatus + '_box_data',
                                key,
                                'height',
                                'pic',
                            );
                        } else this.dynamicBuildFC(element.desc, this.rateStatus + '_box_data', key, 'desc');
                    }
                }
                let sizeModel = null;
                //patch value to formGroup
                if (this.rateStatus == 'inner') {
                    if (this.data.rate_container == 1) {
                        sizeModel = {
                            //尺寸
                            height: {
                                text: res.inner_box_data.size.height.text,
                                num: res.inner_box_data.size.height.num,
                                pic: res.inner_box_data.size.height.pic ? res.inner_box_data.size.height.pic : [],
                            },
                            length: {
                                text: res.inner_box_data.size.length.text,
                                num: res.inner_box_data.size.length.num,
                                pic: res.inner_box_data.size.length.pic ? res.inner_box_data.size.length.pic : [],
                            },
                            width: {
                                text: res.inner_box_data.size.width.text,
                                num: res.inner_box_data.size.width.num,
                                pic: res.inner_box_data.size.width.pic ? res.inner_box_data.size.width.pic : [],
                            },
                            desc: res.inner_box_data.size.desc ? res.inner_box_data.size.desc : [],
                        };
                    } else {
                        sizeModel =
                            res.inner_box_data.size && res.inner_box_data.size.length
                                ? res.inner_box_data.size
                                : [
                                      {
                                          size_width: null,
                                          size_height: null,
                                          size_length: null,
                                          size_type: null,
                                          pic: [],
                                      },
                                  ];
                    }
                    this.SkuInspectModel.patchValue({
                        spotCheckNum: res.inner_box_data.spotCheckNum,
                        poNo: res.inner_box_data.poNo,
                        poNoRes: res.inner_box_data.poNoRes ? res.inner_box_data.poNoRes : 'accord',
                        inner_box_data: {
                            barCode: {
                                //条码
                                isTrue: res.inner_box_data.barCode.isTrue,
                                desc: res.inner_box_data.barCode.desc ? res.inner_box_data.barCode.desc : [],
                                text: res.inner_box_data.barCode.text,
                                photos: res.inner_box_data.barCode.photos ? res.inner_box_data.barCode.photos : [],
                                agreement: res.inner_box_data.barCode.agreement
                                    ? res.inner_box_data.barCode.agreement
                                    : '0',
                            },
                            grossWeight: {
                                //毛重
                                text1: res.inner_box_data.grossWeight.text1,
                                text2: res.inner_box_data.grossWeight.text2,
                                text3: res.inner_box_data.grossWeight.text3,
                                text4: res.inner_box_data.grossWeight.text4,
                                text5: res.inner_box_data.grossWeight.text5,
                                desc: res.inner_box_data.grossWeight.desc ? res.inner_box_data.grossWeight.desc : [],
                                photos: res.inner_box_data.grossWeight.photos
                                    ? res.inner_box_data.grossWeight.photos
                                    : [],
                            },
                            size: sizeModel,
                            sizeDesc: {
                                desc:
                                    res.inner_box_data.sizeDesc && res.inner_box_data.sizeDesc.desc
                                        ? res.inner_box_data.sizeDesc.desc
                                        : [],
                            },
                            shippingMarks: {
                                //唛头
                                desc: res.inner_box_data.shippingMarks.desc
                                    ? res.inner_box_data.shippingMarks.desc
                                    : [],
                                photos: res.inner_box_data.shippingMarks.photos
                                    ? res.inner_box_data.shippingMarks.photos
                                    : [],
                            },
                            throwBox: {
                                //摔箱
                                desc: res.inner_box_data.throwBox.desc ? res.inner_box_data.throwBox.desc : [],
                                isPass: res.inner_box_data.throwBox.isPass,
                                photos: res.inner_box_data.throwBox.photos ? res.inner_box_data.throwBox.photos : [],
                                text: res.inner_box_data.throwBox.text,
                                videos: res.inner_box_data.throwBox.videos ? res.inner_box_data.throwBox.videos : [],
                            },
                        },
                    });
                } else {
                    this.SkuInspectModel.patchValue({
                        spotCheckNum: res.outer_box_data.spotCheckNum,
                        poNo: res.outer_box_data.poNo,
                        poNoRes: res.outer_box_data.poNoRes ? res.outer_box_data.poNoRes : 'accord',
                        outer_box_data: {
                            barCode: {
                                //条码
                                isTrue: res.outer_box_data.barCode.isTrue,
                                desc: res.outer_box_data.barCode.desc ? res.outer_box_data.barCode.desc : [],
                                text: res.outer_box_data.barCode.text,
                                photos: res.outer_box_data.barCode.photos ? res.outer_box_data.barCode.photos : [],
                                agreement: res.outer_box_data.barCode.agreement
                                    ? res.outer_box_data.barCode.agreement
                                    : '0',
                            },
                            grossWeight: {
                                //毛重
                                text1: res.outer_box_data.grossWeight.text1,
                                text2: res.outer_box_data.grossWeight.text2,
                                text3: res.outer_box_data.grossWeight.text3,
                                text4: res.outer_box_data.grossWeight.text4,
                                text5: res.outer_box_data.grossWeight.text5,
                                desc: res.outer_box_data.grossWeight.desc ? res.outer_box_data.grossWeight.desc : [],
                                photos: res.outer_box_data.grossWeight.photos
                                    ? res.outer_box_data.grossWeight.photos
                                    : [],
                            },
                            shippingMarks: {
                                //唛头
                                desc: res.outer_box_data.shippingMarks.desc
                                    ? res.outer_box_data.shippingMarks.desc
                                    : [],
                                photos: res.outer_box_data.shippingMarks.photos
                                    ? res.outer_box_data.shippingMarks.photos
                                    : [],
                            },
                            size: {
                                //尺寸
                                height: {
                                    text: res.outer_box_data.size.height.text,
                                    num: res.outer_box_data.size.height.num,
                                    pic: res.outer_box_data.size.height.pic ? res.outer_box_data.size.height.pic : [],
                                },
                                length: {
                                    text: res.outer_box_data.size.length.text,
                                    num: res.outer_box_data.size.length.num,
                                    pic: res.outer_box_data.size.length.pic ? res.outer_box_data.size.length.pic : [],
                                },
                                width: {
                                    text: res.outer_box_data.size.width.text,
                                    num: res.outer_box_data.size.width.num,
                                    pic: res.outer_box_data.size.width.pic ? res.outer_box_data.size.width.pic : [],
                                },
                                desc: res.outer_box_data.size.desc ? res.outer_box_data.size.desc : [],
                            },
                        },
                    });
                }
                //毛重 显示五个值
                this.otherGrossWeight =
                    this.SkuInspectModel.value[this.rateStatus + '_box_data'].grossWeight.text4 &&
                    this.SkuInspectModel.value[this.rateStatus + '_box_data'].grossWeight.text5;
            });
    }

    /**
     * 获取开箱后数据
     */
    getAfterBoxData(boxType?: 'outer' | 'inner') {
        this.implementService
            .getAfterBoxData({
                apply_inspection_no: this.currentApplyInsData.apply_inspection_no,
                sku: this.data.sku,
                is_inner_box: this.rateStatus == 'inner' ? 1 : 2,
                contract_no: this.contractNo,
            })
            .subscribe(res => {
                if (!res) return;
                this.SkuInspectModel.reset();
                let box = res[this.rateStatus + '_box_data'];
                this.inspectionRequire = res[this.rateStatus + '_box_data']
                    ? res[this.rateStatus + '_box_data'].inspection_require
                    : {};
                for (const key in box) {
                    const element = box[key];
                    if (box.hasOwnProperty(key) && key != 'inspection_require') {
                        if (!!element && key != 'productSize') {
                            this.dynamicBuildFC(element.desc, this.rateStatus + '_box_data', key, 'desc');
                            this.dynamicBuildFC(element.videos, this.rateStatus + '_box_data', key, 'videos');
                            this.dynamicBuildFC(element.photos, this.rateStatus + '_box_data', key, 'photos');
                        }
                    }

                    if (key == 'size') {
                        if (!!element) {
                            let element = box[key];
                            this.dynamicBuildFC(element.desc, this.rateStatus + '_box_data', key, 'desc');
                            this.dynamicBuildFC(
                                element['length'].pic,
                                this.rateStatus + '_box_data',
                                key,
                                'length',
                                'pic',
                            );
                            this.dynamicBuildFC(
                                element['width'].pic,
                                this.rateStatus + '_box_data',
                                key,
                                'width',
                                'pic',
                            );
                            this.dynamicBuildFC(
                                element['height'].pic,
                                this.rateStatus + '_box_data',
                                key,
                                'height',
                                'pic',
                            );
                        }
                    }
                }
                if (this.rateStatus == 'inner') {
                    this.SkuInspectModel.patchValue({
                        spotCheckNum: res.inner_box_data.spotCheckNum,
                        poNo: res.inner_box_data.poNo,
                        poNoRes: res.inner_box_data.poNoRes ? res.inner_box_data.poNoRes : 'accord',
                        inner_box_data: {
                            packing: {
                                //包装
                                is_double_carton: res.inner_box_data.packing.is_double_carton,
                                desc: res.inner_box_data.packing.desc ? res.inner_box_data.packing.desc : [],
                                isTrue: res.inner_box_data.packing.isTrue,
                                packingType: res.inner_box_data.packing.packingType,
                                photos: res.inner_box_data.packing.photos ? res.inner_box_data.packing.photos : [],
                                packingBelt: res.inner_box_data.packing.packingBelt
                                    ? res.inner_box_data.packing.packingBelt
                                    : 'undetermined',
                                rateWeightMark: res.inner_box_data.packing.rateWeightMark
                                    ? res.inner_box_data.packing.rateWeightMark
                                    : 'undetermined',
                            },
                            layout: {
                                //摆放图
                                photos: res.inner_box_data.layout.photos ? res.inner_box_data.layout.photos : [],
                                desc: res.inner_box_data.layout.desc ? res.inner_box_data.layout.desc : [],
                            },
                            productDetail: {
                                //产品
                                desc: res.inner_box_data.productDetail.desc
                                    ? res.inner_box_data.productDetail.desc
                                    : [],
                                photos: res.inner_box_data.productDetail.photos
                                    ? res.inner_box_data.productDetail.photos
                                    : [],
                            },
                            instructions: {
                                //说明书
                                isHas: res.inner_box_data.instructions.isHas,
                                type: res.inner_box_data.instructions.type,
                                desc: res.inner_box_data.instructions.desc ? res.inner_box_data.instructions.desc : [],
                                photos: res.inner_box_data.instructions.photos
                                    ? res.inner_box_data.instructions.photos
                                    : [],
                                instructionsType: res.inner_box_data.instructions.instructionsType,
                            },
                            crews: {
                                //螺丝包
                                isTrue: res.inner_box_data.crews.isTrue,
                                desc: res.inner_box_data.crews.desc ? res.inner_box_data.crews.desc : [],
                                photos: res.inner_box_data.crews.photos ? res.inner_box_data.crews.photos : [],
                            },
                            whole: {
                                //组装后整体
                                desc: res.inner_box_data.whole.desc ? res.inner_box_data.whole.desc : [],
                                photos: res.inner_box_data.whole.photos ? res.inner_box_data.whole.photos : [],
                            },
                            disputes: {
                                //sku争议
                                text: res.inner_box_data.disputes.text ? res.inner_box_data.disputes.text : [],
                                photos: res.inner_box_data.disputes.photos ? res.inner_box_data.disputes.photos : [],
                            },
                            productSize:
                                res.inner_box_data.productSize && res.inner_box_data.productSize.length
                                    ? res.inner_box_data.productSize
                                    : [
                                          {
                                              size_width: null,
                                              size_height: null,
                                              size_length: null,
                                              size_type: null,
                                              size_weight: null,
                                              pic: [],
                                          },
                                      ],
                            productSizeDesc: {
                                desc: res.inner_box_data.productSizeDesc.desc
                                    ? res.inner_box_data.productSizeDesc.desc
                                    : [],
                            },
                            netWeight: {
                                //净重
                                textOne: res.inner_box_data.netWeight.textOne,
                                textTwo: res.inner_box_data.netWeight.textTwo,
                                desc: res.inner_box_data.netWeight.desc ? res.inner_box_data.netWeight.desc : [],
                                photos: res.inner_box_data.netWeight.photos ? res.inner_box_data.netWeight.photos : [],
                            },
                            appearance: {
                                //外观检测
                                desc: res.inner_box_data.appearance.desc ? res.inner_box_data.appearance.desc : [],
                                photos: res.inner_box_data.appearance.photos
                                    ? res.inner_box_data.appearance.photos
                                    : [],
                                videos: res.inner_box_data.appearance.videos
                                    ? res.inner_box_data.appearance.videos
                                    : [],
                            },
                            function: {
                                //功能检测
                                desc: res.inner_box_data.function.desc ? res.inner_box_data.function.desc : [],
                                photos: res.inner_box_data.function.photos ? res.inner_box_data.function.photos : [],
                                videos: res.inner_box_data.function.videos ? res.inner_box_data.function.videos : [],
                            },
                            bearing: {
                                //承重检测
                                desc: res.inner_box_data.bearing.desc ? res.inner_box_data.bearing.desc : [],
                                photos: res.inner_box_data.bearing.photos ? res.inner_box_data.bearing.photos : [],
                                videos: res.inner_box_data.bearing.videos ? res.inner_box_data.bearing.videos : [],
                            },
                            waterContent: {
                                //含水量检测
                                desc: res.inner_box_data.waterContent.desc ? res.inner_box_data.waterContent.desc : [],
                                photos: res.inner_box_data.waterContent.photos
                                    ? res.inner_box_data.waterContent.photos
                                    : [],
                                videos: res.inner_box_data.waterContent.videos
                                    ? res.inner_box_data.waterContent.videos
                                    : [],
                            },
                            sumUp: {
                                //总结
                                textOne: res.inner_box_data.sumUp.textOne,
                                textTwo: res.inner_box_data.sumUp.textTwo,
                                prodSchedule: res.inner_box_data.sumUp.prodSchedule
                                    ? res.inner_box_data.sumUp.prodSchedule
                                    : 'undetermined',
                                package: res.inner_box_data.sumUp.package
                                    ? res.inner_box_data.sumUp.package
                                    : 'undetermined',
                                marksAndCode: res.inner_box_data.sumUp.marksAndCode
                                    ? res.inner_box_data.sumUp.marksAndCode
                                    : 'undetermined',
                                prodInfo: res.inner_box_data.sumUp.prodInfo
                                    ? res.inner_box_data.sumUp.prodInfo
                                    : 'undetermined',
                                qualityTechnology: res.inner_box_data.sumUp.qualityTechnology
                                    ? res.inner_box_data.sumUp.qualityTechnology
                                    : 'undetermined',
                                fieldTest: res.inner_box_data.sumUp.fieldTest
                                    ? res.inner_box_data.sumUp.fieldTest
                                    : 'undetermined',
                            },
                            desc: {
                                //整体描述
                                desc: res.inner_box_data.desc ? res.inner_box_data.desc.desc : [],
                                photos: res.inner_box_data.desc.photos ? res.inner_box_data.desc.photos : [],
                            },
                        },
                    });
                } else {
                    this.SkuInspectModel.patchValue({
                        spotCheckNum: res.outer_box_data.spotCheckNum,
                        poNo: res.outer_box_data.poNo,
                        poNoRes: res.outer_box_data.poNoRes ? res.outer_box_data.poNoRes : 'accord',
                        outer_box_data: {
                            packing: {
                                is_double_carton: res.outer_box_data.packing.is_double_carton,
                                desc: res.outer_box_data.packing.desc ? res.outer_box_data.packing.desc : [],
                                isTrue: res.outer_box_data.packing.isTrue,
                                packingType: res.outer_box_data.packing.packingType,
                                photos: res.outer_box_data.packing.photos ? res.outer_box_data.packing.photos : [],
                                packingBelt: res.outer_box_data.packing.packingBelt
                                    ? res.outer_box_data.packing.packingBelt
                                    : 'undetermined',
                                rateWeightMark: res.outer_box_data.packing.rateWeightMark
                                    ? res.outer_box_data.packing.rateWeightMark
                                    : 'undetermined',
                            },
                            layout: {
                                //摆放图
                                photos: res.outer_box_data.layout.photos ? res.outer_box_data.layout.photos : [],
                                desc: res.outer_box_data.layout.desc ? res.outer_box_data.layout.desc : [],
                            },
                        },
                    });
                }
            });
    }

    productSizeChange(e: any[]) {
        this.productSize = e;
    }

    sizeChange(e: any[]) {
        this.size = e;
    }

    ionViewDidLeave() {
        // document.getElementsByTagName('html')[0].setAttribute('style','-webkit-filter: 0;')
    }
}
