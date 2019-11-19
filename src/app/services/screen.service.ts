import { Injectable, OnInit } from '@angular/core';
import { Observable, fromEvent, Subject } from 'rxjs';

export type ScreenAngle = 'Horizontal' | 'Vertical';

@Injectable({
    providedIn: 'root',
})
export class ScreenService {
    get screenAngle(): ScreenAngle {
        let rval: ScreenAngle;
        if (screen.orientation.angle == 0 || screen.orientation.angle == 180) rval = 'Vertical';
        else rval = 'Horizontal';
        return rval;
    }

    get ScreenHeight(): number {
        return document.documentElement.clientHeight;
    }

    onResize: Subject<ScreenAngle> = new Subject<ScreenAngle>();

    screenResize: Observable<any> = fromEvent(window, 'orientationchange');

    constructor() {
        this.screenResize.subscribe(res => {
            this.onResize.next(this.screenAngle);
        });
    }
}
