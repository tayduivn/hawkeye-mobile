import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PageEffectService } from 'src/app/services/page-effect.service';
import _ from 'loadsh';
import { EmitService } from '../emit.service';
import { takeWhile } from 'rxjs/operators';
import { inspectingService } from 'src/app/services/inspecting.service';
@Component({
    selector: 'app-factory-base-information',
    templateUrl: './factory-base-information.component.html',
    styleUrls: ['./factory-base-information.component.scss'],
})
export class FactoryBaseInformationComponent implements OnInit {
    // 定义一个必填项的双向绑定的对象
    originObject: any = {
        address_one: '',
        contacts: '',
        position: '',
        phone: '',
        legaler: '',
        company_nature: '',
        product_type: '',
    };
    // 对应的键名
    obj: any = {
        address_one: '工厂地址(1)',
        contacts: '工厂联系人',
        position: '联系人职位',
        phone: '联系方式',
        legaler: '法人代表',
        company_nature: '企业性质',
        product_type: '生产产品类型',
        address_two: '工厂地址(2)',
    };
    // 普通项的数据绑定对象
    normal: any = {
        user_id: '',
        create_time: '',
        registered_capital: '',
        annual_sales: '',
        address_two: '',
        name: '',
        add_time: '',
    };
    notFilled: any[] = [];
    toolsObj: any = {};
    isDisabled: boolean;
    controlAdressShow: Boolean = false;
    factoryDetails: any = {};
    flag: any;
    factory_id: any;
    constructor(
        private route: Router,
        private es: PageEffectService,
        private activatedRoute: ActivatedRoute,
        private infoCtrl: EmitService,
        private inspecting: inspectingService,
    ) {}
    ngOnInit() {
        window.localStorage.setItem('flag', '未保存');
        this.getInitQueryParams();
        this.infoCtrl.info$.pipe(takeWhile(() => !this.destroy)).subscribe(res => {
            console.log(res); //这里可以拿到头部的信息  那么拿到后在这里面调用保存的方法
            // user_id  user_name  add_time
            console.log(this.flag);
            // 此时是编辑的时候  编辑的时候需要传递的有工厂的id(只在这个页面是这个样子)
            if (this.flag == '2') {
                const newOriginObj = _.cloneDeep(this.originObject);
                const newNormalObj = _.cloneDeep(this.normal);
                Object.assign(newOriginObj, newNormalObj);
                newOriginObj.factory_id = this.factory_id - 0;
                newOriginObj.user_id = res.user_id - 0;
                newOriginObj.name = res.name;
                newOriginObj.add_time = res.add_time;
                this.saveInformation(newOriginObj);
            } else {
                // 此时不是编辑  不是编辑不传工厂id
                const newOriginObj = _.cloneDeep(this.originObject);
                const newNormalObj = _.cloneDeep(this.normal);
                Object.assign(newOriginObj, newNormalObj);
                // newOriginObj.factory_id = this.factory_id - 0;
                newOriginObj.user_id = res.user_id - 0;
                newOriginObj.name = res.name;
                newOriginObj.add_time = res.add_time;
                this.saveInformation(newOriginObj);
            }
        });
    }
    getInitQueryParams() {
        this.activatedRoute.queryParams.subscribe(queryParam => {
            console.log(queryParam); //flag等于0不做任何操作  等于1那么回填加禁用编辑  等于2那么回填可编辑
            const { details, flag, factory_id } = queryParam;
            this.factory_id = factory_id;
            this.flag = flag;
            if (details) {
                const DETAILS = JSON.parse(details);
                this.originObject.address_one = DETAILS.address_one;
                this.originObject.contacts = DETAILS.contacts;
                this.originObject.position = DETAILS.position;
                this.originObject.phone = DETAILS.phone;
                this.originObject.legaler = DETAILS.legaler;
                this.originObject.company_nature = DETAILS.company_nature;
                this.originObject.product_type = DETAILS.product_type;
                this.normal.create_time = DETAILS.create_time;
                this.normal.registered_capital = DETAILS.registered_capital;
                this.normal.annual_sales = DETAILS.annual_sales;
                this.normal.address_two = DETAILS.address_two;
                if (this.normal.address_two) {
                    this.controlAdressShow = true;
                } else {
                    this.controlAdressShow = false;
                }
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

    // 点击保存的时候判断必填项是否有值
    saveInformation(params) {
        this.notFilled = [];
        let flag = true;
        for (let key in this.originObject) {
            if (!this.originObject[key].trim()) {
                flag = false;
                this.notFilled.push(key);
            }
        }
        if (this.controlAdressShow && this.normal.address_two.trim() == '') {
            this.notFilled.push('address_two');
        }
        if (this.notFilled.length) {
            // 不为0说明有必填项没有填
            // 先拼接字符串
            let str = '';
            this.notFilled.forEach(item => {
                str += this.obj[item] + ' ';
            });

            this.es.showToast({
                message: str + '是必填项',
                duration: 1500,
                color: 'danger',
            });
        } else {
            const newOriginObj = _.cloneDeep(this.originObject);
            const newNormalObj = _.cloneDeep(this.normal);
            Object.assign(newOriginObj, newNormalObj);
            this.toolsObj = newOriginObj;
            // this.es.showToast({
            //     message: '保存成功',
            //     duration: 1500,
            //     color: 'success',
            // });
            // 存储保存的flag

            // 调用保存的api
            this.inspecting.saveFactoryBaseInformation(params).subscribe(res => {
                console.log(res);
                console.log(params);
                // 如果存在id那么说明是新增  把新增的工厂id存起来
                if (res.data.factory_id) {
                    window.sessionStorage.setItem('FACTORY_ID', res.data.factory_id);
                }
                if (res.status !== 1)
                    return this.es.showToast({
                        message: '保存失败',
                        color: 'danger',
                        duration: 1500,
                    });
                this.es.showToast({
                    message: '保存成功',
                    color: 'success',
                    duration: 1500,
                });
                window.localStorage.setItem('flag', '已保存');
            });
            // console.log(params);
        }
    }
    onBlur(e) {
        if ((e.target.value as any) - 0 <= 0) {
            this.es.showToast({
                message: '请输入大于0的数',
                color: 'danger',
                duration: 1500,
            });
            e.target.value = '';
        }
    }
    inputChanged() {}

    destroy: boolean = false;
    ngOnDestroy(): void {
        window.localStorage.setItem('flag', '未保存');
        this.destroy = true;
    }

    confirm() {
        const newOriginObj = _.cloneDeep(this.originObject);
        const newNormalObj = _.cloneDeep(this.normal);
        Object.assign(newOriginObj, newNormalObj);
        if (this.isDisabled) {
            return true;
        } else {
            let flag = true;
            // 没有保存但是存在东西
            if (window.localStorage.getItem('flag') !== '已保存') {
                for (let key in newOriginObj) {
                    if (newOriginObj[key].trim() !== '') {
                        flag = false;
                    }
                }
            } else if (window.localStorage.getItem('flag') === '已保存') {
                // console.log(newOriginObj);
                // console.log(this.toolsObj);

                for (let key in newOriginObj) {
                    if (newOriginObj[key] != this.toolsObj[key]) {
                        flag = false;
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
    addAddressClicked() {
        this.controlAdressShow = true;
    }
    deleAddressClicked() {
        this.controlAdressShow = false;
        this.normal.address_two = '';
    }
}
