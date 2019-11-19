import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class LoadingService {
    loading: boolean = false;
    loadingChange: Subject<boolean> = new Subject<boolean>();
    constructor() {}

    setLoading(val: boolean) {
        this.loading = val;
        this.loadingChange.next(this.loading);
    }

    getLoading(): boolean {
        return this.loading;
    }
}
