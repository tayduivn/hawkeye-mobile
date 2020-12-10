import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { map } from 'rxjs/operators';
import { ArrayingContainerData, ArrayingService } from 'src/app/services/arraying.service';
import { PageEffectService } from 'src/app/services/page-effect.service';

@Component({
    selector: 'app-alert-modal',
    templateUrl: './alert-modal.component.html',
    styleUrls: ['./alert-modal.component.scss'],
})
export class AlertModalComponent implements OnInit {
    // @Input() @Input() apply_inspection_no: string;
    @Input() item: any;
    @Input() id: number;
    constructor(private modal: ModalController, private arraying: ArrayingService, private es: PageEffectService) {}
    // 提单的数据对象
    data: any = {
        id: null, //当前要提交的是哪一个商品的id
        bl_no: '', //提单号
        estimate_loading_time: '', //预计时间
        shipping_room: '', //发货仓库名称
        desc: '', //备注
        charges: [],
    };
    flag: boolean = true;
    controlBtnIsabled: Boolean = false;
    shipping_room: Array<{ id: number; name: string; name_chinese: string }>;
    close() {
        this.modal.dismiss();
    }
    getDate(): string {
        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        return `${year}-${month}-${day}`;
    }
    onSubmit() {
        if (this.flag) {
            console.log(this.data.estimate_loading_time);
            console.log(this.data.estimate_loading_time.split('T')[0]);
            const dateStr = this.getDate();
            console.log(dateStr);
            if (this.data.estimate_loading_time.split('T')[0] === dateStr) {
            } else if (+new Date(this.data.estimate_loading_time) < +new Date()) {
                this.es.showToast({
                    message: '预计装柜时间不可小于当前时间',
                    duration: 2000,
                    color: 'danger',
                });
                return;
            }
            // 点击了提单
            this.data.id = this.id;
            console.log(this.data);

            this.arraying.postArrayingContainerData(this.data).subscribe(res => {
                // 关闭弹出层
                this.modal.dismiss('已关闭');
                this.es.showToast({
                    color: 'success',
                    duration: 2000,
                    message: '提单成功',
                });
            });
        }
    }
    // 获取下拉框数据
    getSelectOptions() {
        this.arraying
            .getAlreadyContainerData()
            .pipe(
                map(res => {
                    this.shipping_room = res.shipping_rooms;
                    console.log(this.shipping_room);
                }),
            )
            .subscribe(res => {});
    }
    // 定义提交按钮禁用和不禁用的方法  每当按钮改变的时候判断有没有值 有值说明选择了
    isBtnDisabled() {
        console.log(this.data.charges);

        let flag;
        let num = 0;
        this.data.charges.forEach(item => {
            console.log(item.charge);

            if (item.charge !== '' && item.charge !== null) {
                num++;
            }
        });
        if (num === this.data.charges.length) {
            flag = true;
        } else {
            flag = false;
        }

        this.data.shipping_room && this.data.estimate_loading_time && this.data.bl_no.trim() && flag
            ? (this.controlBtnIsabled = true)
            : (this.controlBtnIsabled = false);
    }
    ngOnInit() {
        console.log(this.item.factory_info);
        for (let key in this.item.factory_info) {
            this.data.charges.push({
                factory_code: this.item.factory_info[key]['factory_code'],
                factory_name: this.item.factory_info[key]['factory_name'],
                charge: '',
                desc: '',
            });
        }
        console.log(this.data);

        setTimeout(() => {
            this.getSelectOptions();
        }, 0);
    }
    onBlur(e: Event, data: any) {
        // console.log(this.data.charges);
        console.log(e);

        if (data.charge < 0) {
            this.es.showToast({
                color: 'danger',
                duration: 2000,
                message: '输入的费用必须大于等于0',
            });
            this.flag = false;
            (e.target as any).value = '';
        } else {
            this.flag = true;
        }
    }
}
