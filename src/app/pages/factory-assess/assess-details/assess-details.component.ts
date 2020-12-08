import { Component, OnInit } from '@angular/core';
import { Button } from 'protractor';
import { PageEffectService } from 'src/app/services/page-effect.service';

@Component({
    selector: 'app-assess-details',
    templateUrl: './assess-details.component.html',
    styleUrls: ['./assess-details.component.scss'],
})
export class AssessDetailsComponent implements OnInit {
    constructor(private es: PageEffectService) {}
    onSubmit() {
        this.showAlert();
    }
    showAlert() {
        this.es.showAlert({
            message: '评估提交后将不可修改,是否提交?',
            buttons: [
                {
                    text: '确定',
                    handler: () => {
                        // 此处发送请求
                        console.log('确认提交');
                    },
                },
                {
                    text: '取消',
                },
            ],
        });
    }
    ngOnInit() {}
}
