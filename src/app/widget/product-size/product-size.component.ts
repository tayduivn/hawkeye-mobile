import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PageEffectService } from '../../services/page-effect.service';

@Component({
    selector: 'inspect-product-size',
    templateUrl: './product-size.component.html',
    styleUrls: ['./product-size.component.scss'],
})
export class ProductSizeComponent implements OnInit {
    @Input() set sizes(input: any[]) {
        if (!!input) this._sizes = input;
        this.onChange.emit(this._sizes)
    }

    @Input() sku: string;
    @Input() contract_no: string;
    @Input() apply_inspection_no: string;
    _sizes: any[];

    @Output() onChange: EventEmitter<any[]> = new EventEmitter();

    changeText(i: number, type: 'add' | 'modify', item: string) {
        this.es.showAlert({
            header: '请输入内容',
            inputs: [
                {
                    type: 'text',
                    name: 'text',
                    value: type == 'add' ? '' : this._sizes[i][item],
                    placeholder: '请输入内容',
                },
            ],
            buttons: [
                {
                    text: '确定',
                    handler: (value: any) => {
                        this._sizes[i][item] = value.text;
                        // this.current = value.text;
                        // if (type == 'add') {
                        //     this._sizes.push(value.text);
                        // } else {
                        //     this._sizes[i] = value.text;
                        //     !i && this._sizes.push('');
                        // }
                        // this._sizes = this._sizes.filter(res => res);
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

    constructor(private es: PageEffectService) {}

    ngOnInit() {}
}
