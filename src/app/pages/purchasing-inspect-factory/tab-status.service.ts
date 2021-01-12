import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';

@Injectable({
    providedIn: 'root',
})
export class TabStatusService {
    canClick$: Subject<{ flag: boolean; type: string }> = new Subject();
    constructor() {}
}
