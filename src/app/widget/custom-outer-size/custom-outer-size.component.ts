import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PageEffectService } from 'src/app/services/page-effect.service';
import { DelInspectFiledParams, ImplementInspectService } from 'src/app/services/implement-inspect.service';

@Component({
    selector: 'app-custom-outer-size',
    templateUrl: './custom-outer-size.component.html',
    styleUrls: ['./custom-outer-size.component.scss'],
})
export class CustomOuterSizeComponent implements OnInit {
    @Input() set sizes(input: any[]) {
        if (!!input) this._sizes = input;
        console.log('------------ 外箱自定义尺寸 ------------');
        console.log(input);
        this.onChange.emit(this._sizes);
    }

    @Input() sku: string;
    @Input() contract_no: string;
    @Input() apply_inspection_no: string;
    @Input() type: string;

    _sizes: any[] = [
        {
            size_length: '',
            size_width: '',
            size_height: '',
            pic: [],
        },
    ];

    @Output() onChange: EventEmitter<any[]> = new EventEmitter();
    changeText(i: number, type: 'add' | 'modify', item: string, text: string) {
        this.es.showAlert({
            header: `请输入${text}`,
            inputs: [
                {
                    type: 'number',
                    name: 'text',
                    value: type == 'add' ? '' : this._sizes[i][item],
                    placeholder: `请输入${text}`,
                },
            ],
            buttons: [
                {
                    text: '确定',
                    handler: (value: any) => {
                        this._sizes[i][item] = value.text;
                        this.onChange.emit(this._sizes);
                    },
                },
            ],
        });
    }

    add() {
        if (
            this._sizes[this._sizes.length - 1].size_length &&
            this._sizes[this._sizes.length - 1].size_height &&
            this._sizes[this._sizes.length - 1].size_width
        ) {
            this._sizes.push({
                size_length: '',
                size_width: '',
                size_height: '',
                pic: [],
            });
        } else {
            this.es.showToast({
                message: '请完善此组后在添加',
                color: 'danger',
            });
        }
    }

    remove(i: number) {
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
                            type:'size_other'
                        };
                        this.implement.deleteInspectFiled(params).subscribe(res => {
                            this.es.showToast({
                                message: res.message,
                                color: res.status ? 'success' : 'danger',
                            });
                            res.status && this._sizes.splice(i, 1);
                        });
                    },
                },
            ],
        });
    }

    constructor(private es: PageEffectService,private implement: ImplementInspectService) {}

    ngOnInit() {}

}
