import { PageEffectService } from 'src/app/services/page-effect.service';
import { FormGroup } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-item-by-item-desc',
    templateUrl: './item-by-item-desc.component.html',
    styleUrls: ['./item-by-item-desc.component.scss'],
})
export class ItemByItemDescComponent implements OnInit {
    @Input() set ary(input: string[]) {
        if (!!input) {
            this.data = [''];
            for (var i = 0; i < input.length; i++) {
                if (input[i] != null) {
                    this.data.push(input[i]);
                }
            }
        }
    }

    @Input() description?: string = '';

    @Output() onComplete: EventEmitter<any[]> = new EventEmitter<any[]>();

    data: any[] = [''];

    current: string;

    constructor(public fb: FormBuilder, private es: PageEffectService) {}

    ngOnInit() {}

    addDesc(i: number, type: 'add' | 'modify') {
        this.es.showAlert({
            header: '请输入内容',
            inputs: [
                {
                    type: 'text',
                    name: 'text',
                },
            ],
            buttons: [
                {
                    text: '确定',
                    handler: (value: any) => {
                        this.current = value.text;
                        if (type == 'add') {
                            this.data[i ? i + 1 : 0] = value.text;
                            this.data.push('');
                        } else {
                            this.data[i] = value.text;
                            !i && this.data.push('');
                        }
                        this.onComplete.emit(this.data);
                    },
                },
            ],
        });
    }
}
