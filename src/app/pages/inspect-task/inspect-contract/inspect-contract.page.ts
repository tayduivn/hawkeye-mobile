import { Sku } from './../../../widget/sku-info/sku-info.component';
import { ScreenAngle, ScreenService } from '../../../services/screen.service';
import { StorageService } from '../../../services/storage.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

export interface InspectTask {
    CityName?: string;
    ProviceName?: string;
    apply_inspection_no?: string;
    apply_name?: string;
    apply_user?: number;
    buyer_user?: string;
    contract_desc?: string;
    contract_id: number;
    contract_no: string;
    created_at?: string;
    estimated_loading_time?: string;
    factory_address?: string;
    factory_contacts?: string;
    factory_email?: string;
    factory_name?: string;
    factory_simple_address?: string;
    id: number;
    inspection_date?: string;
    inspection_group_id?: number;
    is_bought_ticket?: number;
    is_contacked_factory?: number;
    is_inspected_factory?: number;
    is_inspected_product?: number;
    is_know_demand?: number;
    is_new_factory?: number;
    is_plan_date?: number;
    is_pre_handle_over?: number;
    is_reset?: number;
    mobil_phone?: string;
    new_quantity?: number;
    probable_inspection_date_end?: string;
    probable_inspection_date_start?: string;
    quantity?: number;
    schedule_name?: any;
    sku_desc?: Sku[];
    sku_num?: Sku[];
    sort?: number;
    status?: number;
    status_desc?: string;
    total_quantity?: number;
    updated_at?: string;
    factory_desc?: string;
    contract_no_all?: string;
    contract_info_arr?: any[];
}

@Component({
    selector: 'app-inspect-contract',
    templateUrl: './inspect-contract.page.html',
    styleUrls: ['./inspect-contract.page.scss'],
})
export class InspectContractPage implements OnInit {
    data: InspectTask = {
        contract_id: null,
        contract_no: '',
        id: null,
    };
    screenAngle: ScreenAngle;
    constructor(private storage: StorageService, private screen: ScreenService, private router: Router) {
        this.screenAngle = this.screen.screenAngle;
    }

    ngOnInit() {
        this.screen.onResize.subscribe(res => (this.screenAngle = res));
        this.data = this.storage.get('CURRENT_INSPECT_GROUP');
    }

    ionViewWillEnter() {
        this.data = this.storage.get('CURRENT_INSPECT_GROUP');
    }

    toSkuDesc(p: InspectTask) {
        this.storage.set('CURRENT_INSPECT_CONTRACT', p);
        this.router.navigate(['sku-desc']);
    }
}
