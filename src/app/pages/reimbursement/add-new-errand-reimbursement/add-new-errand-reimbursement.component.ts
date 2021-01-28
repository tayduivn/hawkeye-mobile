import { Component, OnInit } from '@angular/core';
import { PageEffectService } from 'src/app/services/page-effect.service';
import { QueueComponent } from '../../implement-inspection/queue/queue.component';
import _ from 'loadsh';
import { Router } from '@angular/router';
import { SaveService } from './save.service';
import { DisabledService } from './disabled.service';
import { TabSaveService } from '../tab-save.service';
import { TravelReimbursementService } from 'src/app/services/travel-reimbursement.service';
@Component({
    selector: 'app-add-new-errand-reimbursement',
    templateUrl: './add-new-errand-reimbursement.component.html',
    styleUrls: ['./add-new-errand-reimbursement.component.scss'],
})
export class AddNewErrandReimbursementComponent implements OnInit {
    constructor(
        private es: PageEffectService,
        private router: Router,
        private save: SaveService,
        private disabled: DisabledService,
        private tabSave: TabSaveService,
        private travel: TravelReimbursementService,
    ) {}
    alreadyUpProgress: boolean;
    // 工厂流水号下拉选择器的双向绑定对象
    factory_name_and_serial = '';
    // 基本信息的对象
    baseInformation: any = {
        // reimbursement_name: '', //报销人
        travel_type: '', //差旅费类型
        factory_name_and_serial: [], //选择的sku和工厂
        travel_reason: '', //出差事由
        travel_start_time: '', //开始时间
        travel_end_time: '', //结束时间
    };
    // 控制选择自驾禁用
    disable: boolean;

    isShow: string;
    notFilledToolsArray: any[] = [];
    // 基本信息的对象
    baseInformationTools: any = {
        travel_type: '差旅费类型', //差旅费类型
        factory_name_and_serial: '流水号和工厂', //选择的sku和工厂
        travel_reason: '出差事由', //出差事由
        travel_start_time: '开始时间', //开始时间
        travel_end_time: '结束时间', //结束时间
    };
    tools: any = {};
    FactoryAndSerialNumber: any[] = [];
    reimbursement_name: any;
    reason: any[] = [];
    reasonIndex: any[] = [];
    ngOnInit() {
        this.getUserInfo();
        // 获取工厂名和流水号列表
        // 获取前置数据
        this.getPreData();
    }
    getPreData() {
        this.travel.getPrepositionData().subscribe(res => {
            console.log(res);
            this.reason = [];
            this.reasonIndex = [];
            for (let key in res.travel_reason_params) {
                this.reason.push(res.travel_reason_params[key]);
                this.reasonIndex.push(key);
            }
        });
    }
    // 获取本地存储的信息
    getUserInfo(): void {
        const userInfo = window.sessionStorage.getItem('USER_INFO');
        const json = _.cloneDeep(JSON.parse(userInfo));
        console.log(json);
        this.reimbursement_name = json.name;
    }
    reasonChanged() {
        this.baseInformation.factory_name_and_serial = [];
        // console.log();
        if (Boolean(this.baseInformation.travel_reason)) {
            this.FactoryAndSerialNumber = [];
            this.getFactoryAndSerialNumber();
        } else {
            this.FactoryAndSerialNumber = [];
        }
    }
    // 获取工厂名和流水号列表
    getFactoryAndSerialNumber(): void {
        this.travel.getFactoryAndSerial({ type: this.baseInformation.travel_reason }).subscribe(res => {
            console.log(res);
            if (res.factory_list && res.factory_list.length != 0) {
                this.FactoryAndSerialNumber = res.factory_list;
            }
        });
    }
    // 上传进度
    showModal() {
        // debugger;
        this.es.showModal({
            component: QueueComponent,
        });
        this.alreadyUpProgress = true;
    }
    // 判断时间
    thinkTime(): boolean {
        if (this.baseInformation.travel_start_time != '' && this.baseInformation.travel_end_time != '') {
            if (+new Date(this.baseInformation.travel_start_time) > +new Date(this.baseInformation.travel_end_time)) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }
    // 保存信息按钮
    saveInformation() {
        const $thinkTime = this.thinkTime();
        if ($thinkTime) {
            return this.es.showToast({
                message: '出差开始时间不能晚于结束时间!',
                color: 'danger',
                duration: 1500,
            });
        }
        this.notFilledToolsArray = [];
        const {
            travel_type,
            factory_name_and_serial,
            travel_reason,
            travel_start_time,
            travel_end_time,
        } = this.baseInformation;
        this.tools.travel_type = travel_type;
        this.tools.factory_name_and_serial = factory_name_and_serial;
        this.tools.travel_reason = travel_reason;
        this.tools.travel_start_time = travel_start_time;
        this.tools.travel_end_time = travel_end_time;

        for (let key in this.tools) {
            if (this.tools[key] instanceof Array) {
                // 如果是数组
                if (this.tools[key].length == 0) {
                    console.log(key);

                    this.notFilledToolsArray.push(key);
                }
            } else {
                if (this.tools[key] == '') {
                    this.notFilledToolsArray.push(key);
                }
            }
        }

        if (this.notFilledToolsArray.length == 0) {
            // 没有必填项没填就调用接口保存基本信息，然后跳转到相应的页面
            this.es.showAlert({
                message: '点击下一步后当前基本信息需要在编辑操作中才能进行修改，是否继续?',
                buttons: [
                    {
                        text: '取消',
                    },
                    {
                        text: '确定',
                        handler: () => {
                            const newObj = _.cloneDeep(this.baseInformation);
                            console.log(newObj);
                            this.travel.saveBaseInformation(newObj).subscribe(res => {
                                console.log(res);
                                if (res.status != 1)
                                    return this.es.showToast({
                                        message: res.message,
                                        color: 'danger',
                                        duration: 1500,
                                    });
                                let currentObj = {
                                    travel_id: res.data.travel_id,
                                    travel_reimbursement_no: res.data.travel_reimbursement_no,
                                };

                                //   保存成功就跳转到相应的页面
                                newObj.travel_type == '1'
                                    ? this.router.navigate(['/normal'], { queryParams: currentObj })
                                    : this.router.navigate(['/self-drive'], { queryParams: currentObj });
                            });
                        },
                    },
                ],
            });
        } else {
            let str = '';
            // 弹出必填项没填
            this.notFilledToolsArray.forEach(item => {
                str += this.baseInformationTools[item] + ' ';
            });
            str += '是必填项';
            this.es.showToast({
                message: str,
                color: 'danger',
                duration: 1500,
            });
        }
        // debugger;
        // 保存的时候首先要判断保存的是哪一个   是自驾的还是普通的 根据字段来进行判断
        // 点击保存把保存置为以保存
    }

    factory_name_and_serialSelectChange(event) {
        event == '' ? 0 : this.baseInformation.factory_name_and_serial.push(event);
        this.baseInformation.factory_name_and_serial = [...new Set(this.baseInformation.factory_name_and_serial)];
        // 延后清空下拉框
        setTimeout(() => {
            this.clear();
        }, 0);
    }
    clear() {
        this.factory_name_and_serial = '';
    }
    ngOnDestroy(): void {}
    // 点击移除
    removeClicked(index: number) {
        // 唤起弹出层
        this.es.showAlert({
            message: '确定删除该流水号及工厂名吗?',
            buttons: [
                {
                    text: '取消',
                },
                {
                    text: '确定',
                    handler: () => {
                        this.baseInformation.factory_name_and_serial.splice(index, 1);
                    },
                },
            ],
        });
    }

    backClicked(): void {}

    // 处理时间的函数
    handleTime(time: string): string {
        const date = new Date(time);
        const y = date.getFullYear();
        let m: any = date.getMonth() + 1;
        m = m < 10 ? '0' + m : m;
        let d: any = date.getDate();
        d = d < 10 ? '0' + d : d;
        return `${y}-${m}-${d}`;
    }
    startTimeChanged() {
        this.baseInformation.travel_start_time = this.handleTime(this.baseInformation.travel_start_time);
    }
    endTimeChanged() {
        this.baseInformation.travel_end_time = this.handleTime(this.baseInformation.travel_end_time);
    }
}
