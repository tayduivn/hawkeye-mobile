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
        truely_loading_time: '',
        on_board_date: '',
        seal_no: '',
        container_no: '',
        estimated_arrival_time: '',
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
                        message: res.message,
                    });
                    this.router.navigate(['/arraying-container/final-cabinets']);
                    window.localStorage.setItem('active', '3');
                } else {
                    // 不关闭弹框
                    this.es.showToast({
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
        const flag1 = this.currentData.every(item => item.contract_title);
        console.log(flag);
        this.installData.truely_loading_time &&
        this.installData.on_board_date &&
        this.installData.estimated_arrival_time &&
        this.installData.seal_no.trim() &&
        this.installData.container_no.trim() &&
        flag &&
        flag1
            ? (this.isBtnDisabled = true)
            : (this.isBtnDisabled = false);
    }
}
