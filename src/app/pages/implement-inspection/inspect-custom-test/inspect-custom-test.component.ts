import { Component, OnInit, Input } from '@angular/core';
import { FieldType } from 'src/app/widget/videotape/videotape.component';
import { PageEffectService } from 'src/app/services/page-effect.service';

export interface CustomTest {
    photos: Array<string>;
    videos: Array<string>;
    ary: Array<string>;
    fieldType?: string;
    chinese_name: string;
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
            debugger;
            this._customTestArray = [
                {
                    photos: [],
                    videos: [],
                    ary: [],
                    fieldType: 'custom_test_1',
                    chinese_name: '',
                },
            ];
        }
    }

    @Input() contract_no: string = '';

    @Input() apply_inspection_no: string = '';

    @Input() sku: string = '';

    @Input() box_type: string = '';

    _customTestArray: Array<CustomTest> = [
        {
            chinese_name: '',
            photos: [],
            videos: [],
            ary: [],
            fieldType: 'custom_test_0',
        },
    ];
    constructor(private es: PageEffectService) {}

    get last() {
        return this._customTestArray[this._customTestArray.length - 1];
    }

    ngOnInit() {}

    descEnter(e: any, f: FieldType, b: 'inner' | 'outer') {
        
    }

    addCustomTest() {
        if (!this.last.chinese_name) {
            this.es.showToast({
                message: '请填写完测试名在添加！',
                color: 'danger',
            });
            return;
        } 
        // else if (
        //     (this.last.ary && !this.last.ary.length) ||
        //     (this.last.ary && !this.last.photos.length) ||
        //     (this.last.ary && !this.last.videos.length)
        // ) {
        //     this.es.showToast({
        //         message: '请完善其图片,视频,备注任意一项再添加！',
        //         color: 'danger',
        //     });
        //     return;
        // }

        this._customTestArray.push({
            chinese_name: '',
            photos: [],
            videos: [],
            ary: [],
            fieldType: `custom_test_${this._customTestArray.length}`
        });
        console.log(this._customTestArray);
    }
}
