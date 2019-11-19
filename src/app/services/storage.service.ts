import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class StorageService {
    sessionStorage: any = window.sessionStorage;

    constructor() {
        if (!this.sessionStorage) {
            throw new Error('您的浏览器不支持本地存储（LocalStorage）！');
        }
    }

    set(key: string, value: any): void {
        this.sessionStorage.setItem(key, JSON.stringify(value));
    }

    get(key: string): any {
        let value = this.sessionStorage.getItem(key);
        try {
            value = JSON.parse(value);
        } catch (e) {}
        return value;
    }

    remove(key: string): any {
        this.sessionStorage.removeItem(key);
    }

    clear(): any {
        this.sessionStorage.clear();
    }
}
