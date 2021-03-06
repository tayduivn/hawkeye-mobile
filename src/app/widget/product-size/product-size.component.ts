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
        console.log('------------ 产品尺寸 ------------');
        console.log(input);
        this.onChange.emit(this._sizes);
    }

    @Input() sku: string;
    @Input() contract_no: string;
    @Input() apply_inspection_no: string;
    @Input() set type(input: 'size' | 'productSize') {
        if (!!input) {
            this._type = input;
        }
    }
    _sizes: any[];
    _type: 'size' | 'productSize';

    get photographType(): 'size_pic' | 'product_size_pic' {
        return this._type == 'size' ? 'size_pic' : 'product_size_pic';
    }
    @Output() onChange: EventEmitter<any[]> = new EventEmitter();

    changeText(i: number, type: 'add' | 'modify', item: string, text: string) {
        this.es.showAlert({
            header: `请输入${text}`,
            inputs: [
                {
                    type: 'text',
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
        if (this._type == 'productSize') {
            if (
                this._sizes[this._sizes.length - 1].size_length &&
                this._sizes[this._sizes.length - 1].size_height &&
                this._sizes[this._sizes.length - 1].size_width &&
                this._sizes[this._sizes.length - 1].size_type
            ) {
                this._sizes.push({
                    size_length: '',
                    size_width: '',
                    size_height: '',
                    size_type: '',
                    pic: [],
                    weight: '',
                });
            } else {
                this.es.showToast({
                    message: '请完善此组后在添加',
                    color: 'danger',
                });
            }
        } else {
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
                    weight: '',
                });
            } else {
                this.es.showToast({
                    message: '请完善此组后在添加',
                    color: 'danger',
                });
            }
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
                        console.log(this._sizes, i);
                        this._sizes.splice(i, 1);
                    },
                },
            ],
        });
    }

    constructor(private es: PageEffectService) {}

    ngOnInit() {}
}
