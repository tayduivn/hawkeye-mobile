import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FieldType } from 'src/app/widget/videotape/videotape.component';
import { PageEffectService } from 'src/app/services/page-effect.service';
import { Description } from 'src/app/widget/item-by-item-desc/item-by-item-desc.component';
import {
    ImplementInspectService,
    DelInspectFiledParams,
} from 'src/app/services/implement-inspect.service';

export interface CustomTest {
    pic: Array<string>;
    videos: Array<string>;
    desc: Array<Description>;
    fieldType?: string;
    name: string;
}

@Component({
    selector: 'app-inspect-custom-test',
    templateUrl: './inspect-custom-test.component.html',
    styleUrls: ['./inspect-custom-test.component.scss'],
})
export class InspectCustomTestComponent implements OnInit {
    @Input() set customTestArray(input: Array<CustomTest>) {
        if (!!input) {
            this._customTestArray = input;
        } else {
            this._customTestArray = [
                {
                    pic: [],
                    videos: [],
                    desc: [],
                    name: '',
                },
            ];
        }
    }

    @Input() contract_no: string = '';

    @Input() apply_inspection_no: string = '';

    @Input() sku: string = '';

    @Input() box_type: string = '';

    @Output() onValueChange: EventEmitter<Array<CustomTest>> = new EventEmitter();

    _customTestArray: Array<CustomTest> = [
        {
            name: '',
            pic: [],
            videos: [],
            desc: [],
        },
    ];
    constructor(private es: PageEffectService, private implement: ImplementInspectService) {}

    get last() {
        return this._customTestArray[this._customTestArray.length - 1];
    }

    ngOnInit() {}

    descEnter(e: any, i: number, b: 'inner' | 'outer') {
        this._customTestArray.find((item, index) => index == i).desc = e;
        this.onValueChange.emit(this._customTestArray);
    }

    addCustomTest() {
        if (!this.last.name) {
            this.es.showToast({
                message: '请填写完测试名在添加！',
                color: 'danger',
            });
            return;
        }

        this._customTestArray.push({
            name: '',
            pic: [],
            videos: [],
            desc: [],
        });
        console.log(this._customTestArray);
    }

    delete(i: number) {
        this.es.showAlert({
            message: '确定要删除吗？',
            buttons: [
                {
                    text: '取消',
                },
                {
                    text: '确定',
                    handler: () => {
                        let params: DelInspectFiledParams = {
                            index: i,
                            apply_inspection_no: this.apply_inspection_no,
                            contract_no: this.contract_no,
                            sku: this.sku,
                            type:'custom_test'
                        };
                        this.implement.deleteInspectFiled(params).subscribe(res => {
                            this.es.showToast({
                                message: res.message,
                                color: res.status ? 'success' : 'danger',
                            });
                            res.status && this._customTestArray.splice(i, 1);
                        });
                    },
                },
            ],
        });
    }
}
