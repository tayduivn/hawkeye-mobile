import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { inspectingService } from 'src/app/services/inspecting.service';
import _ from 'loadsh';
import { PageEffectService } from 'src/app/services/page-effect.service';
@Component({
    selector: 'app-factory-assess',
    templateUrl: './factory-assess.page.html',
    styleUrls: ['./factory-assess.page.scss'],
})
export class FactoryAssessPage implements OnInit {
    constructor(
        private router: Router,
        private inspecting: inspectingService,
        private es: PageEffectService,
        private activatedRoute: ActivatedRoute,
    ) {}
    btnItemClicked(item: any, id?: number) {
        console.log(id);
        // 跳转路由  传入当前的id等数据在另一边进行提交  注入路由服务
        this.router.navigate(['/assess-details'], {
            queryParams: {
                id: id,
                item: item,
            },
        });
    }

    queryInfo: any = {
        page: 1,
        paginate: 25,
    };
    params: any = {
        name: null,
    };
    ngOnInit() {
        // 请求工厂评估的信息
        this.getFactoryList(this.queryInfo);
        this.activatedRoute.queryParams.subscribe(queryParam => {
            console.log(queryParam);
            if (queryParam.caoZ && queryParam.caoZ == 'flash') {
                this.getFactoryList(this.queryInfo);
            }
        });
    }
    factoryAccessList: any[] = [];
    getFactoryList(params) {
        // 调用接口返回信息（不传默认返回所有）
        this.inspecting.getFactoryList(params).subscribe(res => {
            const { data } = res;
            console.log(data.factory);
            this.factoryAccessList = data.factory;
        });
    }

    handlerSearch() {
        const QUERY = _.cloneDeep(this.queryInfo);
        const SEARCH = _.cloneDeep(this.params);
        const NEWOBJ = Object.assign(QUERY, SEARCH);
        this.getFactoryList(NEWOBJ);
    }
    loadData(event) {
        this.queryInfo.page++;
        let newObj = {};
        if (Boolean(this.params.name) == true) {
            // 如果有东西  那么就要和并查询参数
            const QUERY = _.cloneDeep(this.queryInfo);
            const SEARCH = _.cloneDeep(this.params);
            newObj = Object.assign(QUERY, SEARCH);
        } else {
            newObj = _.cloneDeep(this.queryInfo);
        }
        this.inspecting.getFactoryList(newObj).subscribe(res => {
            console.log(res);
            // 如果还存在data.factory以及res.data.factory.length不等于0  那么就继续拼接获取到的数据
            if (res.data.factory && res.data.factory.length) {
                this.factoryAccessList = this.factoryAccessList.concat(res.data.factory);
                console.log(this.factoryAccessList);
            } else {
                this.queryInfo.page--;
                this.es.showToast({
                    message: '别刷了，没有数据啦！',
                    color: 'danger',
                    duration: 1500,
                });
            }
            event.target.complete();
        });
    }
}
