import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';

@Injectable()
export class EmitService {
    info$: Subject<any> = new Subject();
    constructor() {}
}
