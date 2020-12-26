import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PageEffectService } from 'src/app/services/page-effect.service';
import _ from 'loadsh';
import { EmitService } from '../emit.service';
import { takeWhile } from 'rxjs/operators';
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
        create_time: '',
        registered_capital: '',
        annual_sales: '',
        address_two: '',
    };
    notFilled: any[] = [];
    toolsObj: any = {};
    isDisabled: boolean;
    controlAdressShow: Boolean = false;
    constructor(
        private route: Router,
        private es: PageEffectService,
        private activatedRoute: ActivatedRoute,
        private infoCtrl: EmitService,
    ) {}
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

    // 点击保存的时候判断必填项是否有值
    saveInformation() {
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
            this.es.showToast({
                message: '保存成功',
                duration: 1500,
                color: 'success',
            });
            const newOriginObj = _.cloneDeep(this.originObject);
            const newNormalObj = _.cloneDeep(this.normal);
            Object.assign(newOriginObj, newNormalObj);
            this.toolsObj = newOriginObj;
            // 存储保存的flag
            window.localStorage.setItem('flag', '已保存');
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
                for (let key in newOriginObj) {
                    if (newOriginObj[key] !== this.toolsObj[key]) {
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
