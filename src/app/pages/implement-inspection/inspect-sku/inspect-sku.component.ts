import { ImplementInspectService } from 'src/app/services/implement-inspect.service';
import { environment } from './../../../../environments/environment';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { ScanComponent } from './../../../widget/scan/scan.component';
import { PageEffectService } from 'src/app/services/page-effect.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Sku } from 'src/app/widget/sku-info/sku-info.component';
import { StorageService } from 'src/app/services/storage.service';

const sku: any = {
    Brand: null,
    accessory: true,
    complete: '',
    container_num: 200,
    description: null,
    group: null,
    has_strap: null,
    isNew: null,
    is_inspected_product: 0,
    is_know_demand: 1,
    is_need_drop_test: null,
    is_need_sample: null,
    news_or_return_product: null,
    other_data: false,
    photo: [],
    pic: ['/UploadFiles/Product/9c58f9d1-ab96-4671-b667-2be847522664.jpg'],
    quantity: 15,
    rate_container: 1,
    require_data_advise: [null, null],
    return_rate: ' 5',
    sku: 'CW12X0286',
    sku_chinese_name: '原木色宠物床--不带顶',
    chinese_description:
        // tslint:disable-next-line: max-line-length
        '360度折叠游戏椅，颜色：橘红色，最大承重：100kg。产品尺寸：129*58*12cm ，展开尺寸为101.3*60.3*76cm，折叠尺寸为72.9*60.3*38.6cm。 钢管：19*1.0mm，面料：仿麻布，底部是聚酯布，海绵为普通海绵+再生棉。 调节器：koyo2+5（日本）。带转盘，可360度旋转。',
    packing_type:
        // tslint:disable-next-line: max-line-length
        '各块木板（每块板贴上与说明书相对应的标贴）之间用珍珠棉隔开，然后整体包裹气泡膜，并用胶带封住。螺丝及木榫分类放入自封袋（每个自封袋上贴上与说明书对应的标贴）中，再共入一个黄色气泡信封袋，且将其与气泡膜粘住。最后上述物品同英文说明书共入一个五层双瓦楞加强纸箱，纸箱六面用0.5cm泡沫保护。纸箱的所有开口处请用透明胶带封牢。纸箱六面印刷我司指定唛头，备注：封箱胶带不要起皱，纸箱不能鼓起。条形码为***，条形码需能清晰可扫。',
};

export interface SkuUploadData {
    spotCheckNum?: number; // 抽检数量
    poNo?: string; // PO
    inner_box_data?: SkuInspectModel;
    outer_box_data?: SkuInspectModel;
    sku: string;
    apply_inspection_no: string;
    is_inner_box: number;
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

@Component({
    selector: 'app-inspect-sku',
    templateUrl: './inspect-sku.component.html',
    styleUrls: ['./inspect-sku.component.scss'],
})
export class InspectSkuComponent implements OnInit {
    @ViewChild('grossWeight', { static: false }) grossWeight: ElementRef;
    otherGrossWeight: boolean = false;
    data: Sku = null;
    factory: any = null;
    barCode: string = null;
    rateStatus: 'outer' | 'inner' = 'inner';
    toggleItem: any[] = ToggleItem;
    currentToggle: any = ToggleItem[0];
    imgOrigin: string = environment.fileUrlPath;
    inspectionRequire: any = {};
    constructor(
        private es: PageEffectService,
        private fb: FormBuilder,
        private storage: StorageService,
        private implementService: ImplementInspectService,
    ) {}

    SkuInspectModel: FormGroup = this.fb.group({
        spotCheckNum: this.fb.control(''),
        poNo: this.fb.control(''),
        inner_box_data: this.fb.group({
            shippingMarks: this.fb.group({
                desc: this.fb.array([]),
                photos: this.fb.array([]),
            }),
            size: this.fb.group({
                length: this.fb.group({
                    text: this.fb.control(''),
                    photos: this.fb.array([]),
                    num: this.fb.control(''),
                }),
                width: this.fb.group({
                    text: this.fb.control(''),
                    photos: this.fb.array([]),
                    num: this.fb.control(''),
                }),
                height: this.fb.group({
                    text: this.fb.control(''),
                    photos: this.fb.array([]),
                    num: this.fb.control(''),
                }),
                desc: this.fb.array([]),
            }),
            barCode: this.fb.group({
                isTrue: this.fb.control(''),
                desc: this.fb.array([]),
                photos: this.fb.array([]),
                text: this.fb.control(''),
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
            throwBox: this.fb.group({
                text: this.fb.control(''),
                isPass: this.fb.control('1'),
                desc: this.fb.array([]),
                photos: this.fb.array([]),
                videos: this.fb.array([]),
            }),
            packing: this.fb.group({
                isTrue: this.fb.control(''),
                desc: this.fb.array([]),
                is_double_carton: this.fb.control('1'),
                packingType: this.fb.control(''),
                photos: this.fb.array([]),
            }),
            layout: this.fb.group({
                desc: this.fb.array(['']),
                photos: this.fb.array([]),
            }),
            productDetail: this.fb.group({
                desc: this.fb.array([]),
                photos: this.fb.array([]),
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
            productSize: this.fb.group({
                desc: this.fb.array([]),
                length: this.fb.control(''),
                width: this.fb.control(''),
                height: this.fb.control(''),
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
            }),
            desc: this.fb.group({
                desc: this.fb.array([]),
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
                    photos: this.fb.array([]),
                }),
                width: this.fb.group({
                    text: this.fb.control(''),
                    photos: this.fb.array([]),
                    num: this.fb.control(''),
                }),
                height: this.fb.group({
                    text: this.fb.control(''),
                    num: this.fb.control(''),
                    photos: this.fb.array([]),
                }),
                desc: this.fb.array([]),
            }),
            barCode: this.fb.group({
                isTrue: this.fb.control(''),
                desc: this.fb.array([]),
                photos: this.fb.array([]),
                text: this.fb.control(''),
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
                isTrue: this.fb.control(''),
                type: this.fb.control('1'),
                desc: this.fb.array([]),
                photos: this.fb.array([]),
                packingType: this.fb.control('1'),
            }),
            layout: this.fb.group({
                desc: this.fb.array(['']),
                photos: this.fb.array([]),
            }),
        }),
    });

    ngOnInit() {
        this.data = this.storage.get('CURRENT_IMPLEMENT_SKU');
        this.factory = this.storage.get('CURRENT_FACTORY_DATA');

        this.rateStatus = this.data.rate_container > 1 ? 'outer' : 'inner';
    }

    ionViewWillEnter() {
        this.getBeforeBoxData();
    }

    /**
     * 计算毛重
     */
    calcGrossWeight() {
        if (this.otherGrossWeight) return;
        let doms = this.grossWeight.nativeElement.querySelectorAll('input'),
            ary: number[] = [],
            compare: number[] = [];
        for (var i = 0; i < doms.length; i++) {
            if (!doms[i].value) return;
            ary.push(doms[i].value);
        }

        //value is valid
        compare = ary.sort((a, b) => a - b);
        this.otherGrossWeight = compare[0] * 1.2 > compare[compare.length - 1];
    }

    scan() {
        const modal = this.es.showModal(
            {
                component: ScanComponent,
            },
            res => {
                this.barCode = res.value;
            },
        );
    }

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

    /**
     * 保存
     */
    save() {
        console.log(JSON.stringify(this.SkuInspectModel.value));
        this.es.showAlert({
            message: '正在保存……',
            backdropDismiss: false,
        });
        this.implementService
            .submitSkuData(
                this.SkuInspectModel.value,
                this.data.sku,
                this.factory.sku_data[0].apply_inspection_no,
                this.data.rate_container,
            )
            .subscribe(res => {
                this.es.showToast({
                    message: res.message,
                    color: res.status ? 'success' : 'danger',
                });
                console.log(res);
                this.es.clearEffectCtrl();
            });
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
        this.currentToggle = this.toggleItem.find(res => res.key == ev.detail.value);
        switch (ev.detail.value) {
            case 'beforeUnpacking':
                this.getBeforeBoxData();
                break;
            case 'afterUnpacking':
                this.getAfterBoxData();
                break;
        }
    }

    /**
     * 动态生成FormControl
     * @param ary       desc||videos||photos
     * @param boxType   inner_box_data | 'outer_box_data
     * @param item      formGroup item
     * @param type      'desc' | 'videos' | 'photos'
     * @param sItem     size
     */
    dynamicBuildFC(
        ary: string[],
        boxType: 'inner_box_data' | 'outer_box_data',
        item: string,
        type: string,
        sItem?: string,
    ) {
        if (!ary) return;
        let box: FormGroup = this.SkuInspectModel.get(boxType) as FormGroup,
            formAry: FormArray = (box.get(item) as FormGroup).get(type) as FormArray;
        formAry && formAry.clear();
        ary.forEach(res => {
            if (!sItem) {
                formAry.push(new FormControl(''));
            }
            box = null;
        });
    }

    /**
     * 获取开箱前数据
     */
    getBeforeBoxData() {
        this.implementService
            .getBeforeBoxData({
                apply_inspection_no: this.factory.sku_data[0].apply_inspection_no,
                sku: this.data.sku,
                is_inner_box: this.rateStatus == 'inner' ? 1 : 2,
            })
            .subscribe(res => {
                this.inspectionRequire = res.inner_box_data.inspection_require;
                console.log(this.inspectionRequire);
                //patch value to formGroup
                if (this.rateStatus == 'inner') {
                    for (const key in res.inner_box_data) {
                        const element = res.inner_box_data[key];
                        if (res.inner_box_data.hasOwnProperty(key) && key != 'inspection_require') {
                            if (!!element) {
                                this.dynamicBuildFC(element.desc, 'inner_box_data', key, 'desc');
                                this.dynamicBuildFC(element.videos, 'inner_box_data', key, 'videos');
                                this.dynamicBuildFC(element.photos, 'inner_box_data', key, 'photos');
                            }
                        }
                        if (key == 'size') {
                            if (!!element) {
                                const element = res.inner_box_data[key];
                                this.dynamicBuildFC(element['length'].photos, 'inner_box_data', key, 'photos');
                                this.dynamicBuildFC(element['width'].photos, 'inner_box_data', key, 'videos');
                                this.dynamicBuildFC(element['height'].photos, 'inner_box_data', key, 'photos');
                            }
                        }
                    }

                    this.SkuInspectModel.patchValue({
                        spotCheckNum: res.inner_box_data.spotCheckNum,
                        poNo: res.inner_box_data.poNo,
                        inner_box_data: {
                            barCode: {
                                //条码
                                isTrue: res.inner_box_data.barCode.isTrue,
                                desc: res.inner_box_data.barCode.desc ? res.inner_box_data.barCode.desc : [],
                                text: res.inner_box_data.barCode.text,
                                photos: res.inner_box_data.barCode.photos ? res.inner_box_data.barCode.photos : [],
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
                            shippingMarks: {
                                //唛头
                                desc: res.inner_box_data.shippingMarks.desc
                                    ? res.inner_box_data.shippingMarks.desc
                                    : [],
                                photos: res.inner_box_data.shippingMarks.photos
                                    ? res.inner_box_data.shippingMarks.photos
                                    : [],
                            },
                            size: {
                                //尺寸
                                height: {
                                    text: res.inner_box_data.size.height.text,
                                    num: res.inner_box_data.size.height.num,
                                    photos: res.inner_box_data.size.width.photos
                                        ? res.inner_box_data.size.width.photos
                                        : [],
                                },
                                length: {
                                    text: res.inner_box_data.size.length.text,
                                    num: res.inner_box_data.size.length.num,
                                    photos: res.inner_box_data.size.width.photos
                                        ? res.inner_box_data.size.width.photos
                                        : [],
                                },
                                width: {
                                    text: res.inner_box_data.size.width.text,
                                    num: res.inner_box_data.size.width.num,
                                    photos: res.inner_box_data.size.width.photos
                                        ? res.inner_box_data.size.width.photos
                                        : [],
                                },
                                desc: res.inner_box_data.size.desc ? res.inner_box_data.size.desc : [],
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
                        outer_box_data: {
                            barCode: {
                                //条码
                                isTrue: res.outer_box_data.barCode.isTrue,
                                desc: res.outer_box_data.barCode.desc ? res.outer_box_data.barCode.desc : [],
                                text: res.outer_box_data.barCode.text,
                                photos: res.outer_box_data.barCode.photos ? res.outer_box_data.barCode.photos : [],
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
                                    photos: res.outer_box_data.size.width.photos
                                        ? res.outer_box_data.size.width.photos
                                        : [],
                                },
                                length: {
                                    text: res.outer_box_data.size.length.text,
                                    num: res.outer_box_data.size.length.num,
                                    photos: res.outer_box_data.size.width.photos
                                        ? res.outer_box_data.size.width.photos
                                        : [],
                                },
                                width: {
                                    text: res.outer_box_data.size.width.text,
                                    num: res.outer_box_data.size.width.num,
                                    photos: res.outer_box_data.size.width.photos
                                        ? res.outer_box_data.size.width.photos
                                        : [],
                                },
                                desc: res.outer_box_data.size.desc ? res.outer_box_data.size.desc : [],
                            },
                        },
                    });
                }
            });
    }

    /**
     * 获取开箱后数据
     */
    getAfterBoxData(boxType?: 'outer' | 'inner') {
        this.implementService
            .getAfterBoxData({
                apply_inspection_no: this.factory.sku_data[0].apply_inspection_no,
                sku: this.data.sku,
                is_inner_box: this.rateStatus == 'inner' ? 1 : 2,
            })
            .subscribe(res => {
                console.log(res);

                if (this.rateStatus == 'inner') {
                    for (const key in res.inner_box_data) {
                        const element = res.inner_box_data[key];
                        let box: FormGroup = this.SkuInspectModel.get('inner_box_data') as FormGroup;

                        if (res.inner_box_data.hasOwnProperty(key)) {
                            if (!!element) {
                                this.dynamicBuildFC(element.desc, 'inner_box_data', key, 'desc');
                                this.dynamicBuildFC(element.videos, 'inner_box_data', key, 'videos');
                                this.dynamicBuildFC(element.photos, 'inner_box_data', key, 'photos');
                            }
                        }
                    }
                    this.SkuInspectModel.patchValue({
                        // spotCheckNum: res.inner_box_data.spotCheckNum,
                        // poNo: res.inner_box_data.poNo,
                        inner_box_data: {
                            packing: {
                                //包装
                                is_double_carton: res.inner_box_data.packing.is_double_carton
                                    ? res.inner_box_data.packing.is_double_carton
                                    : 1,
                                desc: res.inner_box_data.packing.desc ? res.inner_box_data.packing.desc : [],
                                isTrue: res.inner_box_data.packing.isTrue,
                                packingType: res.inner_box_data.packing.packingType,
                                photos: res.inner_box_data.packing.photos ? res.inner_box_data.packing.photos : [],
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
                                text: res.inner_box_data.disputes.photos,
                            },
                            productSize: {
                                //组装后产品尺寸
                                desc: res.inner_box_data.productSize.desc ? res.inner_box_data.productSize.desc : [],
                                length: res.inner_box_data.productSize.length,
                                width: res.inner_box_data.productSize.width,
                                height: res.inner_box_data.productSize.height,
                                photos: res.inner_box_data.productSize.photos
                                    ? res.inner_box_data.productSize.photos
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
                            },
                            desc: {
                                //整体描述
                                desc: res.inner_box_data.desc ? res.inner_box_data.desc.desc : [],
                            },
                        },
                    });
                } else {
                    this.SkuInspectModel.patchValue({
                        spotCheckNum: res.outer_box_data.spotCheckNum,
                        poNo: res.outer_box_data.poNo,
                        outer_box_data: {
                            packing: {
                                is_double_carton: res.outer_box_data.packing.is_double_carton
                                    ? res.outer_box_data.packing.is_double_carton
                                    : 1,
                                desc: res.outer_box_data.packing.desc ? res.outer_box_data.packing.desc : [],
                                isTrue: res.outer_box_data.packing.isTrue,
                                packingType: res.outer_box_data.packing.packingType,
                                photos: res.outer_box_data.packing.photos ? res.outer_box_data.packing.photos : [],
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
}
