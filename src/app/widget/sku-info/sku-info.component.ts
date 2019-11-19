import { StorageService } from 'src/app/services/storage.service';
import { PageEffectService } from './../../services/page-effect.service';
import { ScreenAngle } from './../../services/screen.service';
import { Component, OnInit, Input } from '@angular/core';
import { ScreenService } from 'src/app/services/screen.service';
import { Router } from '@angular/router';
import { InspectionService } from 'src/app/services/inspection.service';
import { environment } from 'src/environments/environment';

export interface Sku {
    name: string;
    isNew?: number | string;
    return_rate: string;
    Count?: number;
    detail_counts?: number;
    pic?: string;
    num?: number;
    sku?: string;
    description?: string[];
    temporary_description?: string;
    numIsCom?: number | string; //验货数量是否完成
    photo?: string[];
    complete_counts?: number;
    complete_time?: string;
    schedule_id?: number;
    inspection_left_num?: number; //验货剩余数量
    group?: any;
    is_need_drop_test?: any;
    has_strap?: any;
    is_need_sample?: any;
    news_or_return_product?: any;
    logo_desc?: string;
    estimated_loading_time?: string;
    sku_chinese_name: string;
    quantity: number;
    rate_container: number;
    complete: string;
    chinese_name: string;
    accessory_info: any;
    text_ture: string;
    packing_type: string;
    expand_desc: boolean;
    inspection_require: InspectRequire[];
    container_num: number;
    inspection_task_desc: Array<string>;
    must_quantity?: number;
    is_contacked_factory?: number;
    is_inspected_factory?: number;
    is_inspected_product?: number;
    is_plan_date?: number;
    is_know_demand?: number;
    id?: number;
    is_bought_ticket?: number;
    unreasonable_inspection_task_advise?: string;
    improve_inspection_task_advise?: string;
    accessory_code: string[];
    chinese_description?: string;
    system_logo_desc?: string;
    putImgs?: string[]; //摆放图（验po的时候）
}

export interface Contract {
    manufacturer?: string; //1.供方（工厂名称）
    manufacturer_address?: string; //2.地址
    FactoryContacts?: string; //3.联系人
    FactoryPhone_Fax?: string; //4.电话/传真
    FactoryEmail?: string; //5.E-MAIL
    PlanDeliveryTime?: string; //6.预计交货日期
    TotalVolume?: string; //7.总体积（m³）
    TotalNetWeight?: string; //8.总毛重（KG）
    TotalCount?: number; //9.货物总箱数
    skuList: Sku[];
}

export interface InspectRequire {
    theme_name: string;
    require: string;
    standard: string;
    pic: string[];
    type?: 'can' | 'cannot';
    unreasonable_inspection_task_advise?: string;
    improve_inspection_task_advise?: string;
}

export type skuShowType = 'implement' | 'task';

@Component({
    selector: 'app-sku-info',
    templateUrl: './sku-info.component.html',
    styleUrls: ['./sku-info.component.scss'],
})
export class SKUInfoComponent implements OnInit {
    @Input() sku: Sku;

    @Input() type?: skuShowType = 'task';

    @Input() toInspectionParams?: string;

    screenAngle: ScreenAngle;
    imgOrigin: string = environment.fileUrlPath;
    photoOrigin: string = 'http://192.168.1.144/storage/';

    constructor(
        private screen: ScreenService,
        private router: Router,
        private storage: StorageService,
        private effectCtrl: PageEffectService,
        private inspectService: InspectionService,
    ) {
        this.screenAngle = this.screen.screenAngle;
    }

    seeSkuInfo(sku: Sku) {
        console.log();
    }

    ngOnInit() {
        let description = [];
        this.screen.onResize.subscribe(res => (this.screenAngle = res));
        //description:String  change to Array<String> type
        this.sku.description =
            typeof this.sku.description == 'string'
                ? [this.sku.description]
                : description.concat(this.sku.description ? this.sku.description : ['']);
        console.log(this.sku);
    }

    implementInspect() {
        this.router.navigate(['inspection/sku/' + this.toInspectionParams + '/undone']);
        console.log(this.sku);
    }

    submitIssus(require_data_advise: {
        index?: number;
        unreasonable_inspection_task_advise?: string;
        improve_inspection_task_advise?: string;
    }) {
        this.inspectService
            .addInspectionTaskDesc({
                apply_id: this.storage.get('CURRENT_INSPECT_CONTRACT').id,
                sku: this.sku.sku,
                require_data_advise,
            })
            .subscribe(res => {
                this.effectCtrl.showToast({
                    message: res.message,
                    color: res.status ? 'success' : 'danger',
                });
            });
    }

    showFeedback(p: InspectRequire, i: number) {
        this.effectCtrl.showAlert({
            header: p.theme_name ? p.theme_name + '-反馈' : '反馈',
            inputs: [
                {
                    type: 'radio',
                    label: '没法执行',
                    value: 'cannot',
                },
                {
                    type: 'radio',
                    label: '可以执行,填写建议',
                    value: 'can',
                },
            ],
            buttons: [
                {
                    text: '确定',
                    handler: (e: 'can' | 'cannot') => {
                        if (e == 'can') this.writeFeedback(p, i);
                        else {
                            p.type = 'cannot';
                            let require_data_advise = {
                                index: i,
                                unreasonable_inspection_task_advise: '',
                                type: 'cannot',
                                improve_inspection_task_advise: '',
                            };
                            this.submitIssus(require_data_advise);
                        }
                    },
                },
            ],
        });
    }

    writeFeedback(p: InspectRequire, i: number) {
        this.effectCtrl.showAlert({
            header: p.theme_name ? p.theme_name + '-反馈' : '反馈',
            cssClass: 'custom-alert-box',
            inputs: [
                {
                    type: 'text',
                    placeholder: '请输入不合理之处',
                    value: p.unreasonable_inspection_task_advise,
                    label: '不合理之处',
                },
                {
                    type: 'text',
                    placeholder: '请输入改进建议',
                    value: p.improve_inspection_task_advise,
                    label: '改进建议',
                },
            ],
            buttons: [
                {
                    text: '确定',
                    role: 'enter',
                    handler: (e: string[]) => {
                        //判断两个是否都填写
                        if (e[0] && e[1]) {
                            p.unreasonable_inspection_task_advise = e[0];
                            p.improve_inspection_task_advise = e[1];
                            let require_data_advise = {
                                index: i,
                                unreasonable_inspection_task_advise: e[0],
                                type: 'can',
                                improve_inspection_task_advise: e[1],
                            };
                            p.type = 'cannot';
                            this.submitIssus(require_data_advise);
                        } else
                            this.effectCtrl.showToast({
                                message: '请完善内容！',
                                color: 'danger',
                            });
                    },
                },
            ],
        });
    }
}
