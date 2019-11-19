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
            this.inner_data = [];
            this.data = [];
            this._ary.reset();
            for (var i = 0; i < input.length; i++) {
                this._ary.setControl(i + '', this.fb.control(input[i]));
                this.data.push(input[i]);
            }
        }
    }

    @Input() description?: string = '';

    @Output() onComplete: EventEmitter<any[]> = new EventEmitter<any[]>();

    _ary: FormGroup = this.fb.group({
        0: this.fb.control(''),
    });

    inner_data: any[] = [];

    data: any[] = [];

    constructor(public fb: FormBuilder) {}

    ngOnInit() {
        this.formToAry();
    }

    formToAry() {
        this.data = [];
        let value = [];

        for (const key in this._ary.value) {
            this.data.push({
                key,
                value: this._ary.value[key],
            });
        }

        this.data.forEach(res => {
            value.push(res.value);
        });
        this.onComplete.emit(value);
        value = null;
    }

    addDesc() {
        this.formToAry();
        this._ary.setControl(this.data.length + '', this.fb.control(''));
        this.formToAry();
    }
}
