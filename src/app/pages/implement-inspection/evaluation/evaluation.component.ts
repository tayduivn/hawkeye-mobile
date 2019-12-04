import { StorageService } from 'src/app/services/storage.service';
import { PageEffectService } from 'src/app/services/page-effect.service';
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-evaluation',
    templateUrl: './evaluation.component.html',
    styleUrls: ['./evaluation.component.scss'],
})
export class EvaluationComponent implements OnInit {
    constructor(private es: PageEffectService, private storage: StorageService) {}

    ngOnInit() {}
}
