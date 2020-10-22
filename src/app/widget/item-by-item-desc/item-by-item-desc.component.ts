import { PageEffectService } from 'src/app/services/page-effect.service';
import { FormBuilder } from '@angular/forms';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DescriptionComponent } from '../description/description.component';

export interface Description {
    text: string;
    level: 'important' | 'second' | 'commonly';
}

@Component({
    selector: 'app-item-by-item-desc',
    templateUrl: './item-by-item-desc.component.html',
    styleUrls: ['./item-by-item-desc.component.scss'],
})
export class ItemByItemDescComponent implements OnInit {
    @Input() set ary(input: Description[]) {
        let value = [];
        if (!!input && typeof input[0] == 'string') {
            input.map(desc => {
                value.push({ text: desc, level: 'commonly' });
            });
        } else value = input;

        this.data = [
            {
                text: '',
                level: 'commonly',
            },
        ];
        if (value && value.length) {
            for (var i = 0; i < value.length; i++) {
                if (value[i] && value[i].text && value[i].text.length) {
                    this.data.push(value[i]);
                }
            }
        }
    }

    @Input() description?: string = '';

    @Output() onComplete: EventEmitter<Description[]> = new EventEmitter<Description[]>();

    data: Description[] = [
        {
            text: '',
            level: 'commonly',
        },
    ];

    current: string;

    constructor(public fb: FormBuilder, private es: PageEffectService) {}

    ngOnInit() {}

    addDesc(i: number, type: 'add' | 'modify') {
        this.es.showModal(
            {
                component: DescriptionComponent,
                cssClass: 'description-modal',
                backdropDismiss:false,
                componentProps: {
                    desc: {
                        text: type == 'add' ? '' : this.data[i].text,
                        level: type == 'add' ? 'commonly' : this.data[i].level,
                    },
                    type: type,
                },
            },
            data => {
                this.current = data.text;
                if (type == 'add') {
                    this.data.push(data);
                } else {
                    this.data[i] = data;
                    !i &&
                        this.data.push({
                            text: '',
                            level: 'commonly',
                        });
                }
                this.data = this.data.filter(res => res.text);
                this.onComplete.emit(this.data);
            },
        );
    }
}
