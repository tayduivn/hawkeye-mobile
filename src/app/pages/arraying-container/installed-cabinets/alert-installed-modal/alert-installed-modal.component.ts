import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { ArrayingService } from 'src/app/services/arraying.service';
import { PageEffectService } from 'src/app/services/page-effect.service';

@Component({
    selector: 'app-alert-installed-modal',
    templateUrl: './alert-installed-modal.component.html',
    styleUrls: ['./alert-installed-modal.component.scss'],
})
export class AlertInstalledModalComponent implements OnInit {
    @Input() item: any;
    installData: any = {
        id: null,
        truely_loading_time: '', //实际装柜时间
        on_board_date: '', //开船日期
        seal_no: '',
        container_no: '',
        estimated_arrival_time: '', //预计到港时间
        sku_data: [],
    };
    flag: Boolean = true;
    current: any = {};
    currentData: any = [];
    isBtnDisabled: Boolean = false;
    constructor(
        private modal: ModalController,
        private arraying: ArrayingService,
        private es: PageEffectService,
        private router: Router,
    ) {}
    onSubmit() {
        if (this.flag) {
            if (+new Date(this.installData.on_board_date) < +new Date(this.installData.truely_loading_time)) {
                this.es.showToast({
                    color: 'danger',
                    duration: 2000,
                    message: '开船时间不可小于实际装柜日期',
                });
                return;
            } else if (+new Date(this.installData.estimated_arrival_time) < +new Date(this.installData.on_board_date)) {
                this.es.showToast({
                    color: 'danger',
                    duration: 2000,
                    message: '预计到港时间不可小于开船时间',
                });
                return;
            }
            this.installData.id = this.current.id;
            this.installData.sku_data = this.currentData;
            console.log(this.installData);
            this.arraying.postLoadingData(this.installData).subscribe(res => {
                console.log(res);
                if (res.status === 1) {
                    // 关闭弹出层
                    this.modal.dismiss('关闭了弹窗');
                    // 弹出提示框
                    this.es.showToast({
                        color: 'success',
                        duration: 2000,
                        message: res.message,
                    });
                    setTimeout(() => {
                        this.router.navigate(['/arraying-container/final-cabinets']);
                        window.localStorage.setItem('active', '3');
                    }, 1500);
                } else {
                    // 不关闭弹框
                    this.es.showToast({
                        color: 'danger',
                        duration: 2000,
                        message: res.message,
                    });
                }
            });
        }
    }
    close() {
        this.modal.dismiss();
    }
    onBlur(e: Event, data: any) {
        console.log(data);
        console.log(e);
        if (data.truly_arraying_container_num <= 0) {
            this.es.showToast({
                color: 'danger',
                duration: 2000,
                message: '输入的数量必须大于0',
            });
            this.flag = false;
            (e.target as any).value = null;
        } else {
            this.flag = true;
        }
    }
    ngOnInit() {
        this.current = this.item;
        console.log(this.item);

        this.current.arraying_container_sku.forEach(sku => {
            this.currentData.push({
                sku: sku.sku,
                id: sku.id,
                truly_arraying_container_num: '',
                sku_chinese_name: sku.sku_chinese_name,
                arraying_container_num: sku.arraying_container_num,
                contract_title: '',
            });
        });

        console.log(this.currentData);
        console.log(this.current);
    }
    // 每次改变都判断
    onItemChanged() {
        const flag = this.currentData.every(item => item.truly_arraying_container_num);
        console.log(flag);
        this.installData.truely_loading_time &&
        this.installData.on_board_date &&
        this.installData.estimated_arrival_time &&
        this.installData.seal_no.trim() &&
        this.installData.container_no.trim() &&
        flag
            ? (this.isBtnDisabled = true)
            : (this.isBtnDisabled = false);
    }
}
