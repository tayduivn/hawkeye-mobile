import { Component, OnInit } from '@angular/core';
import { PageEffectService } from 'src/app/services/page-effect.service';
import { QueueComponent } from '../../implement-inspection/queue/queue.component';
import _ from 'loadsh';
import { Router } from '@angular/router';
import { SaveService } from './save.service';
import { DisabledService } from './disabled.service';
import { TabSaveService } from '../tab-save.service';
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
    ) {}
    alreadyUpProgress: boolean;
    // 工厂流水号下拉选择器的双向绑定对象
    factory_name_and_serial = '';
    // 基本信息的对象
    baseInformation: any = {
        reimbursement_name: '', //报销人
        travel_type: '', //差旅费类型
        factory_name_and_serial: [], //选择的sku和工厂
        travel_reason: '', //出差事由
        travel_start_time: '', //开始时间
        travel_end_time: '', //结束时间
    };
    // 控制选择自驾禁用
    disable: boolean;
    obs$: any;
    obs1$: any;
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
    ngOnInit() {
        // this.obs1$ = this.tabSave.tabSave$.subscribe(res => {
        //     console.log(res);
        //     if (res.save) {
        //         const $thinkTime = this.thinkTime();
        //         if ($thinkTime) {
        //             return this.es.showToast({
        //                 message: '出差开始时间不能大于结束时间!',
        //                 color: 'danger',
        //                 duration: 1500,
        //             });
        //         }
        //         const newObj = _.cloneDeep(this.baseInformation);
        //         this.save.save$.next(newObj);
        //     }
        //     if (!res.toggle) {
        //         if (this.isShow == '1') {
        //             this.baseInformation.travel_type = '2';
        //         } else {
        //             this.baseInformation.travel_type = '1';
        //         }
        //     }
        // });
        // window.sessionStorage.setItem('reimbursementBACK', 'undefined');
        // this.obs$ = this.disabled.disabled$.subscribe(res => {
        //     console.log(res);
        //     this.disable = res;
        // });
        this.getUserInfo();
    }
    // 获取本地存储的信息
    getUserInfo(): void {
        const userInfo = window.sessionStorage.getItem('USER_INFO');
        const json = _.cloneDeep(JSON.parse(userInfo));
        console.log(json);
        this.baseInformation.reimbursement_name = json.name;
    }
    // 上传进度
    showModal() {
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
            const newObj = _.cloneDeep(this.baseInformation);
            console.log(newObj);

            //   保存成功就跳转到相应的页面
            newObj.travel_type == '1' ? this.router.navigate(['/normal']) : this.router.navigate(['/self-drive']);
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
        const m = date.getMonth() + 1;
        const d = date.getDate();
        return `${y}-${m}-${d}`;
    }
    startTimeChanged() {
        this.baseInformation.travel_start_time = this.handleTime(this.baseInformation.travel_start_time);
    }
    endTimeChanged() {
        this.baseInformation.travel_end_time = this.handleTime(this.baseInformation.travel_end_time);
    }
}
