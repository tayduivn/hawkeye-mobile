import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import _ from 'loadsh';
import { takeWhile } from 'rxjs/operators';
import { inspectingService } from 'src/app/services/inspecting.service';
import { PageEffectService } from 'src/app/services/page-effect.service';
import { EmitService } from '../emit.service';
@Component({
    selector: 'app-product-information',
    templateUrl: './product-information.component.html',
    styleUrls: ['./product-information.component.scss'],
})
export class ProductInformationComponent implements OnInit {
    constructor(
        private activatedRoute: ActivatedRoute,
        private es: PageEffectService,
        private infoCtrl: EmitService,
        private inspecting: inspectingService,
    ) {}
    isDisabled: boolean;
    // 定义一个必填项的双向绑定的对象
    originObject: any = {};
    toolsObj: any = {};
    normal: any = {
        //产品信息的数组
        products: [
            {
                name: '', //产品名称
                material: '', //主要材料
                craft: '', //主要工艺
                third_mc: '', //工艺或材料
            },
        ],
        //拟合作产品的数组
        simulation_products: [
            {
                name: '', //产品名称
                lime_light: '', //合作注意点
            },
        ],
    };
    destroy: boolean = false;
    dataList: any[] = [];
    flag: any;
    DETAILS: any = {};
    ngOnInit() {
        window.localStorage.setItem('flag', '未保存');
        this.getInitQueryParams();
        this.infoCtrl.info$.pipe(takeWhile(() => !this.destroy)).subscribe(res => {
            // console.log(res); //这里可以拿到头部的信息  那么拿到后在这里面调用保存的方法
            // this.saveInformation();
            if (this.flag == '2') {
                // 如果是编辑的话传递的工厂id应该就是点击编辑传递进来的详情的id
                const newOriginObj = _.cloneDeep(this.originObject);
                const newNormalObj = _.cloneDeep(this.normal);
                Object.assign(newOriginObj, newNormalObj);
                newOriginObj.factory_id = this.DETAILS.id;
                // console.log(this.DETAILS.id);
                this.saveInformation(newOriginObj);
                console.log(newOriginObj);
            } else {
                const newOriginObj = _.cloneDeep(this.originObject);
                const newNormalObj = _.cloneDeep(this.normal);
                Object.assign(newOriginObj, newNormalObj);
                // 如果不是编辑的话传递的id就应该是第一个新增页面保存的id
                let id;
                if (window.sessionStorage.getItem('FACTORY_ID') != 'undefined') {
                    id = (window.sessionStorage.getItem('FACTORY_ID') as any) - 0;
                    newOriginObj.factory_id = id;
                    this.saveInformation(newOriginObj);
                    console.log(newOriginObj);
                } else {
                    this.initData();
                    return this.es.showToast({
                        message: '请先添加工厂基本信息',
                        color: 'danger',
                        duration: 1500,
                    });
                }
            }
        });
    }
    // 初始化数据
    initData() {
        this.originObject = {};
        this.normal = {
            //产品信息的数组
            products: [
                {
                    name: '', //产品名称
                    material: '', //主要材料
                    craft: '', //主要工艺
                    third_mc: '', //工艺或材料
                },
            ],
            //拟合作产品的数组
            simulation_products: [
                {
                    name: '', //产品名称
                    lime_light: '', //合作注意点
                },
            ],
        };
        this.toolsObj = {};
    }
    getInitQueryParams() {
        this.activatedRoute.queryParams.subscribe(queryParam => {
            // console.log(queryParam); //flag等于0不做任何操作  等于1那么回填加禁用编辑  等于2那么回填可编辑
            const { details } = queryParam;
            console.log(queryParam);
            this.flag = queryParam.flag;
            // console.log(details);
            // 如果是详情页过来的就赋值
            if (details) {
                // 把传递进来的详情数据存一份
                this.DETAILS = JSON.parse(details);
                const Details = JSON.parse(details);
                this.normal.products = Details.product;
                this.normal.simulation_products = Details.simulation;
                if (queryParam.flag === '2') {
                    // 编辑刚进来设置为已经保存
                    window.localStorage.setItem('flag', '已保存');
                    const newOriginObj = _.cloneDeep(this.originObject);
                    const newNormalObj = _.cloneDeep(this.normal);
                    Object.assign(newOriginObj, newNormalObj);
                    this.toolsObj = newOriginObj;
                }
            }
            if (queryParam.flag === '0') {
                this.isDisabled = false;
            } else if (queryParam.flag === '1') {
                this.isDisabled = true;
            } else {
                this.isDisabled = false;
            }
        });
    }

    saveInformation(params) {
        const newNormalObj = _.cloneDeep(this.normal);
        this.toolsObj = newNormalObj;

        this.inspecting.saveProductInformation(params).subscribe(res => {
            if (res.status !== 1)
                return this.es.showToast({
                    message: '保存失败',
                    duration: 1500,
                    color: 'danger',
                });
            this.es.showToast({
                message: '保存成功',
                duration: 1500,
                color: 'success',
            });
            window.localStorage.setItem('flag', '已保存');
        });
    }

    ngOnDestroy(): void {
        window.localStorage.setItem('flag', '未保存');
        this.destroy = true;
    }

    confirm() {
        // 此处的逻辑：  当时未保存的时候，判断输入框里面有东西就跳转失败  已经保存了  判断保存的和双向绑定对象是否一样，不一样跳转失败  return false跳转失败
        const newOriginObj = _.cloneDeep(this.originObject);
        const newNormalObj = _.cloneDeep(this.normal);
        Object.assign(newOriginObj, newNormalObj);
        // console.log(newOriginObj);
        // console.log(this.toolsObj);

        if (this.isDisabled) {
            return true;
        } else {
            let flag = true;
            if (window.localStorage.getItem('flag') !== '已保存') {
                for (let key in newOriginObj) {
                    if (typeof newOriginObj[key] == 'object') {
                        newOriginObj[key].forEach(item => {
                            for (let key in item) {
                                if (item[key] !== '') {
                                    flag = false;
                                }
                            }
                        });
                    }
                }
            } else if (window.localStorage.getItem('flag') === '已保存') {
                if (
                    newOriginObj.products.length != this.toolsObj.products.length ||
                    newOriginObj.simulation_products.length != this.toolsObj.simulation_products.length
                ) {
                    flag = false;
                } else {
                    for (let key1 in newOriginObj) {
                        if (typeof newOriginObj[key1] == 'object') {
                            newOriginObj[key1].forEach((item, index) => {
                                for (let key in item) {
                                    if (typeof item[key] != 'object') {
                                        if (item[key] != this.toolsObj[key1][index][key]) {
                                            flag = false;
                                        }
                                    }
                                }
                            });
                        }
                    }
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
        this.normal.products.push({
            name: '', //产品名称
            material: '', //主要材料
            craft: '', //主要工艺
            third_mc: '', //工艺或材料
        });
    }
    // 删除产品的信息
    deleteProduct(index: number) {
        this.normal.products.splice(index, 1);
    }

    // 添加拟合作产品
    addCooperationProduct() {
        this.normal.simulation_products.push({
            name: '', //产品名称
            lime_light: '', //合作注意点
        });
    }
    // 删除拟合作产品
    deleteCooperationProduct(index: number) {
        this.normal.simulation_products.splice(index, 1);
    }
}
