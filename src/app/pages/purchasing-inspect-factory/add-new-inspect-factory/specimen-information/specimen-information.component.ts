import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import _ from 'loadsh';
import { takeWhile } from 'rxjs/operators';
import { PageEffectService } from 'src/app/services/page-effect.service';
import { EmitService } from '../emit.service';
@Component({
    selector: 'app-specimen-information',
    templateUrl: './specimen-information.component.html',
    styleUrls: ['./specimen-information.component.scss'],
})
export class SpecimenInformationComponent implements OnInit {
    constructor(private activatedRoute: ActivatedRoute, private es: PageEffectService, private infoCtrl: EmitService) {}
    isDisabled: boolean;
    // 定义一个必填项的双向绑定的对象
    originObject: any = {};
    toolsObj: any = {};
    normal: any = {
        factory_id: '', //工厂id
        amount: '', //样品费情况
        readiness_time: '', //准备时间
        payment: '', //付款情况
        isTalk: '', //是否谈到样品
        isProvide: '', //是否愿意提供样品
    };
    destroy = false;
    ngOnInit() {
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
        const newOriginObj = _.cloneDeep(this.originObject);
        const newNormalObj = _.cloneDeep(this.normal);
        Object.assign(newOriginObj, newNormalObj);
        this.toolsObj = newOriginObj;
        // 存储保存的flag
        // 保存的时候发送请求
        // 先合并传递的参数

        // this.inspecting.saveGeneralInfomation(QUERY).subscribe(res => {
        //     console.log(res);
        // });
        window.localStorage.setItem('flag', '已保存');
    }
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
            if (window.localStorage.getItem('flag') !== '已保存') {
                for (let key in newOriginObj) {
                    if (newOriginObj[key] !== '') {
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
}
