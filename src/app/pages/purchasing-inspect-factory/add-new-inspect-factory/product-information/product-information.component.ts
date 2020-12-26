import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import _ from 'loadsh';
import { takeWhile } from 'rxjs/operators';
import { PageEffectService } from 'src/app/services/page-effect.service';
import { EmitService } from '../emit.service';
@Component({
    selector: 'app-product-information',
    templateUrl: './product-information.component.html',
    styleUrls: ['./product-information.component.scss'],
})
export class ProductInformationComponent implements OnInit {
    constructor(private activatedRoute: ActivatedRoute, private es: PageEffectService, private infoCtrl: EmitService) {}
    isDisabled: boolean;
    // 定义一个必填项的双向绑定的对象
    originObject: any = {};
    toolsObj: any = {};
    normal: any = {
        //产品信息的数组
        productInformation: [
            {
                productname: '', //产品名称
                materials: '', //主要材料
                craft: '', //主要工艺
                gyhcl: '', //工艺或材料
            },
        ],
        //拟合作产品的数组
        cooperationProduct: [
            {
                name: '', //产品名称
                notice: '', //合作注意点
            },
        ],
    };
    destroy: boolean = false;
    dataList: any[] = [];
    ngOnInit() {
        window.localStorage.setItem('flag', '未保存');

        this.getInitQueryParams();
        this.infoCtrl.info$.pipe(takeWhile(() => !this.destroy)).subscribe(res => {
            console.log(res); //这里可以拿到头部的信息  那么拿到后在这里面调用保存的方法
            this.saveInformation();
        });
    }
    getInitQueryParams() {
        this.activatedRoute.queryParams.subscribe(queryParam => {
            console.log(queryParam); //flag等于0不做任何操作  等于1那么回填加禁用编辑  等于2那么回填可编辑
            if (queryParam.flag === '0') {
                this.isDisabled = false;
            } else if (queryParam.flag === '1') {
                this.isDisabled = true;
            } else {
                this.isDisabled = false;
            }
        });
    }

    saveInformation() {
        this.es.showToast({
            message: '保存成功',
            duration: 1500,
            color: 'success',
        });

        const newNormalObj = _.cloneDeep(this.normal);

        this.toolsObj = newNormalObj;
        window.localStorage.setItem('flag', '已保存');
        console.log(this.normal);
        console.log(this.toolsObj);
    }

    ngOnDestroy(): void {
        window.localStorage.setItem('flag', '未保存');
        this.destroy = true;
    }

    confirm() {
        const newOriginObj = _.cloneDeep(this.originObject);
        const newNormalObj = _.cloneDeep(this.normal);
        Object.assign(newOriginObj, newNormalObj);
        console.log(newOriginObj);

        if (this.isDisabled) {
            return true;
        } else {
            let flag = true;
            if (window.localStorage.getItem('flag') !== '已保存') {
                for (let key in newOriginObj) {
                    newOriginObj[key].forEach(item => {
                        for (let key in item) {
                            if (item[key].trim() !== '') {
                                flag = false;
                            }
                        }
                    });
                }
            } else if (window.localStorage.getItem('flag') === '已保存') {
                for (let key1 in newOriginObj) {
                    newOriginObj[key1].forEach((item, index) => {
                        for (let key in item) {
                            console.log(this.toolsObj);
                            if (item[key] !== this.toolsObj[key1][index][key]) {
                                flag = false;
                            }
                        }
                    });
                }
            } else {
                flag = true;
            }
            if (flag) {
                return true;
            } else {
                return false;
            }
        }
    }
    // 点击添加商品的信息
    addProduct() {
        this.normal.productInformation.push({
            productname: '', //产品名称
            materials: '', //主要材料
            craft: '', //主要工艺
            gyhcl: '', //工艺或材料
        });
    }
    // 删除产品的信息
    deleteProduct(index: number) {
        this.normal.productInformation.splice(index, 1);
    }

    // 添加拟合作产品
    addCooperationProduct() {
        this.normal.cooperationProduct.push({
            name: '', //产品名称
            notice: '', //合作注意点
        });
    }
    // 删除拟合作产品
    deleteCooperationProduct(index: number) {
        this.normal.cooperationProduct.splice(index, 1);
    }
}
