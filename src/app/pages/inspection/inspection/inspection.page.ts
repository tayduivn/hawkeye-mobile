import { environment } from 'src/environments/environment';
import { inspectionObjPipe } from '../../../pipe/inspection-obj.pipe';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { PageEffectService } from '../../../services/page-effect.service';
import { InspectionService, uploadData, project } from '../../../services/inspection.service';
import { Observable } from 'rxjs';
import { TaskService, inspecParams } from 'src/app/services/task.service';

@Component({
    selector: 'app-inspection',
    templateUrl: './inspection.page.html',
    styleUrls: ['./inspection.page.scss'],
    providers: [inspectionObjPipe], //组件级别提供器
})
export class InspectionPage implements OnInit, OnDestroy {
    apiUrl: string = environment.apiUrl;
    fileUrl: string = environment.usFileUrl;
    public type: string;
    public canLeave: boolean = true;
    public inspectionInfoMetaData: project;
    public inspectionInfo: project;
    public selfTest: any = {
        data: {
            sku_sys: {
                BarCode: {
                    org: '',
                    new: '',
                    pic: [],
                },
                SinglePackingSizeLength: {
                    org: '',
                    new: '',
                    pic: [],
                },
                SinglePackingSizeWidth: {
                    org: '',
                    new: '',
                    pic: [],
                },
                SinglePackingSizeHight: {
                    org: '',
                    new: '',
                    pic: [],
                },
                OutsideBarCode: {
                    org: '',
                    new: '',
                    pic: [],
                },
                PackingSizeLength: {
                    org: '',
                    new: '',
                    pic: [],
                },
                PackingSizeWidth: {
                    org: '',
                    new: '',
                    pic: [],
                },
                PackingSizeHight: {
                    org: '',
                    new: '',
                    pic: [],
                },
                RoughWeight: {
                    org: '',
                    new: '',
                    pic: [],
                },
                NetWeight: {
                    org: '',
                    new: '',
                    pic: [],
                },
            },
            sku_other: [
                {
                    InspectionRequiremen: {
                        new: '',
                        org: '',
                    },
                    pic: [],
                },
            ],
            sku_acc: [
                {
                    BarCode: {
                        new: '',
                        org: '',
                    },
                },
            ],
        },
    };

    title: string;
    submitClicked: boolean = false; //提交按钮是否被点击过
    uploadData: uploadData = {
        contract_id: null,
        data: null,
        sku: '',
        task_id: null,
    };

    constructor(
        private effectCtrl: PageEffectService,
        private activeRoute: ActivatedRoute,
        private inspecService: InspectionService,
        private taskService: TaskService,
        private emptyPipe: inspectionObjPipe,
    ) {}

    ngOnInit() {
        this.activeRoute.data.subscribe(data => {
            this.inspectionInfoMetaData = data.contracts.data;
            this.inspectionInfo = this.emptyPipe.transform(JSON.parse(JSON.stringify(this.inspectionInfoMetaData)));

            this.uploadData.contract_id = this.inspectionInfoMetaData.sku_sys.contract_id;
            this.uploadData.data = this.inspectionInfo;
            this.uploadData.sku = this.inspectionInfoMetaData.sku_sys.ProductCode;
            this.uploadData.task_id = data.contracts.task_id;

            sessionStorage.setItem('INSPECTION_META_DATA', JSON.stringify(this.inspectionInfoMetaData));
            let cache: uploadData = {
                contract_id: data.contracts.data.sku_sys.contract_id,
                task_id: data.contracts.task_id,
                sku: data.contracts.data.sku_sys.ProductCode,
            };
            sessionStorage.setItem('TASK_CONTRACT_INFO', JSON.stringify(cache));
        });

        this.activeRoute.params.subscribe((params: any) => {
            this.type = params.type;
            let param: inspecParams = {
                sku: params.sku,
                task_id: params.sid,
                contract_id: params.cid,
            };
            if (this.type == 'done') {
                this.taskService.getDoneSkuDetailByTaCaS(param).subscribe(data => {
                    this.selfTest = data;
                    console.log(data, 'ssssssssss');
                });
            }
        });

        // this.title = JSON.parse(sessionStorage.getItem('TASK_DETAIL_PROJECT')).name
    }

    ngOnDestroy(): void {}

    ionViewWillLeave() {
        sessionStorage.removeItem('INSPECTION_META_DATA');
        sessionStorage.removeItem('TASK_DETAIL_PROJECT');
        sessionStorage.removeItem('TASK_CONTRACT_INFO');
        console.log('4.0 ionViewWillLeave 当将要从页面离开时触发');
    }

    submit() {
        this.submitClicked = !this.submitClicked;
        this.inspecService.submitData(this.uploadData).subscribe((data: any) => {
            if (data.status == 1) {
                this.canLeave = true;
                this.effectCtrl.showAlert({
                    header: '提示',
                    message: '提交成功',
                    backdropDismiss: false,
                    buttons: [
                        {
                            text: 'Ok',
                            handler: () => {
                                history.go(-1);
                            },
                        },
                    ],
                });
            }
        });
    }

    isFormDirty(): boolean {
        if (
            (this.inspectionInfo.sku_sys.SinglePackingSizeLength ||
                this.inspectionInfo.sku_sys.SinglePackingSizeWidth ||
                this.inspectionInfo.sku_sys.SinglePackingSizeHight ||
                this.inspectionInfo.sku_sys.BarCode ||
                this.inspectionInfo.sku_sys.RoughWeight) &&
            this.type == 'undone'
        ) {
            this.canLeave = false;
        }
        return this.canLeave;
    }
    canDeactivate(): Observable<boolean> | boolean {
        return true;
    }

    locationCompare(a: any, b: any) {
        if (a.is_standard == b.is_standard) {
            return true;
        }
        return false;
    }
}

export interface imgObj {
    url: string;
    type: string;
    uploadID: number;
    pIndex: number;
}
