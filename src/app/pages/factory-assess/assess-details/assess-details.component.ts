import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Button } from 'protractor';
import { PageEffectService } from 'src/app/services/page-effect.service';
import _ from 'loadsh';
import { inspectingService } from 'src/app/services/inspecting.service';
@Component({
    selector: 'app-assess-details',
    templateUrl: './assess-details.component.html',
    styleUrls: ['./assess-details.component.scss'],
})
export class AssessDetailsComponent implements OnInit {
    constructor(
        private es: PageEffectService,
        private activatedRoute: ActivatedRoute,
        private inspecting: inspectingService,
        private router: Router,
    ) {}
    // 定义一个必填项的双向绑定的对象
    originObject: any = {
        cooperative_will: '', //合作意愿
        prospect_judge: '', //前景判断
    };
    normal: any = {
        factory_id: '',
        replenish: '', //建议补充
    };
    // 对应的键名
    obj: any = {
        cooperative_will: '合作意愿',
        prospect_judge: '前景判断', //前景判断
    };
    notFilled: any[] = [];
    factory_id: number;
    onSubmit() {
        this.notFilled = [];

        for (let key in this.originObject) {
            if (!this.originObject[key]) {
                this.notFilled.push(key);
            }
        }
        if (this.notFilled.length) {
            // 不为0说明有必填项没有填
            // 先拼接字符串
            let str = '';
            this.notFilled.forEach(item => {
                str += this.obj[item] + ' ';
            });
            // console.log(str + '是必填项');
            this.es.showToast({
                message: str + '是必填项',
                duration: 1500,
                color: 'danger',
            });
        } else {
            const newOriginObj = _.cloneDeep(this.originObject);
            const newNormalObj = _.cloneDeep(this.normal);
            Object.assign(newOriginObj, newNormalObj);
            newOriginObj.factory_id = this.factory_id;
            this.showAlert(newOriginObj);
        }
    }
    showAlert(params) {
        this.es.showAlert({
            message: '评估提交后将不可修改,是否提交?',
            buttons: [
                {
                    text: '确定',
                    handler: () => {
                        // 此处发送请求
                        console.log('确认提交');
                        this.inspecting.postAccessInfo(params).subscribe(res => {
                            console.log(res);
                            if (res.status != 1) {
                                return this.es.showToast({
                                    message: '评估信息提交失败',
                                    color: 'danger',
                                    duration: 1500,
                                });
                            }
                            this.es.showToast({
                                message: '评估信息提交成功',
                                color: 'success',
                                duration: 1500,
                            });
                            setTimeout(() => {
                                this.router.navigate(['/factory-assess'], {
                                    queryParams: {
                                        caoZ: 'flash',
                                    },
                                });
                            }, 1500);
                        });
                    },
                },
                {
                    text: '取消',
                },
            ],
        });
    }
    ngOnInit() {
        this.activatedRoute.queryParams.subscribe(queryParam => {
            console.log(queryParam);
            this.factory_id = queryParam.id - 0;
            console.log(this.factory_id);
        });
    }
}
