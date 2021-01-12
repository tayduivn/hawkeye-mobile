import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';

@Injectable({
    providedIn: 'root',
})
export class IsSaveServiceService {
    isSave$: Subject<string> = new Subject();
    constructor() {}
}
