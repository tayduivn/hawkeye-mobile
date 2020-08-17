import { Router } from '@angular/router';
import { Sku } from './../../widget/sku-info/sku-info.component';
import { DataCompareService } from './../../services/data-compare.service';
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-data-contrast',
    templateUrl: './data-contrast.page.html',
    styleUrls: ['./data-contrast.page.scss'],
})
export class DataContrastPage implements OnInit {
    data: any[] = [];
    currentFactory: any = '';
    currentSku:Sku;
    constructor(private dataCompare: DataCompareService, private router:Router) {}

    ngOnInit() {
        this.dataCompare.getCompareBasicList().subscribe(res => {
            console.log(res);
            this.data = res;
        });
    }

    toDetail(sku:any){
        console.log(sku)
        this.currentSku = sku
        this.router.navigate(['data-contrast/detail',this.currentContract,this.currentApplyNo,sku.sku])
    }

    ionViewWillEnter(){
        this.dataCompare.getCompareBasicList().subscribe(res => {
            this.data = res;
        });
    }

    get currentApplyNo(){
        let val:string 
        this.data.forEach(res => {
            res.contract_data.forEach(element => {
                element.sku.forEach(sku => {
                    if(sku.sku == this.currentSku.sku){
                        val = res.apply_inspection_no
                    }
                });
            });
        })
        return val
    }

    get currentContract(){
        let val:string 
        this.data.forEach(res => {
            res.contract_data.forEach(element => {
                element.sku.forEach(sku => {
                    if(sku.sku == this.currentSku.sku){
                        val = element.contract_id
                    }
                });
            });
        })
        return val
    }
}
