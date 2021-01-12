import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';

@Injectable({
    providedIn: 'root',
})
export class IsDisabledService {
    isDisabled$: Subject<boolean> = new Subject();
    constructor() {}
}
