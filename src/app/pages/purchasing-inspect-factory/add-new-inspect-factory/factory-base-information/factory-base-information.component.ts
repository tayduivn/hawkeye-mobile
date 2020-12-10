import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PageEffectService } from 'src/app/services/page-effect.service';
import _ from 'loadsh';
@Component({
    selector: 'app-factory-base-information',
    templateUrl: './factory-base-information.component.html',
    styleUrls: ['./factory-base-information.component.scss'],
})
export class FactoryBaseInformationComponent implements OnInit {
    // 定义一个必填项的双向绑定的对象
    originObject: any = {
        address: '',
        contact: '',
        position: '',
    };
    obj: any = {
        address: '工厂地址',
        contact: '工厂联系人',
        position: '联系人职位',
    };
    notFilled: any[] = [];
    toolsObj: any = {};
    isDisabled: boolean;
    constructor(private route: Router, private es: PageEffectService, private activatedRoute: ActivatedRoute) {}
    ngOnInit() {
        this.getInitQueryParams();
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
    saveInfomation() {
        this.notFilled = [];
        let flag = true;
        for (let key in this.originObject) {
            if (!this.originObject[key].trim()) {
                flag = false;
                this.notFilled.push(key);
            }
        }
        console.log(flag);
        console.log(this.notFilled);
        if (this.notFilled.length) {
            // 不为0说明有必填项没有填
            // 先拼接字符串
            let str = '';
            this.notFilled.forEach(item => {
                str += this.obj[item] + ' ';
            });
            console.log(str + '是必填项');
            this.es.showToast({
                message: str + '是必填项',
            });
        } else {
            this.es.showToast({
                message: '保存成功',
            });
            this.toolsObj = _.cloneDeep(this.originObject);
            // 存储保存的flag
            window.localStorage.setItem('flag', '已保存');
        }
    }
    inputChanged() {}
    ngOnDestroy(): void {
        window.localStorage.setItem('flag', '未保存');
    }

    confirm() {
        if (this.isDisabled) {
            return true;
        } else {
            let flag = true;
            if (window.localStorage.getItem('flag') !== '已保存') {
                for (let key in this.originObject) {
                    if (this.originObject[key].trim() !== '') {
                        flag = false;
                    }
                }
            } else if (window.localStorage.getItem('flag') === '已保存') {
                for (let key in this.originObject) {
                    if (this.originObject[key] !== this.toolsObj[key]) {
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
}
