import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';

@Injectable({
    providedIn: 'root',
})
export class FlahListService {
    flash$: Subject<any> = new Subject();
    constructor() {}
}
