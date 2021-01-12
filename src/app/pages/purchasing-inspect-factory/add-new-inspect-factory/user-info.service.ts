import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';

@Injectable({
    providedIn: 'root',
})
export class UserInfoService {
    userInfo$: Subject<any> = new Subject();
    constructor() {}
}
