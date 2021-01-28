import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';

@Injectable({
    providedIn: 'root',
})
export class FlashPageService {
    flashPage$: Subject<any> = new Subject();
    constructor() {}
}
