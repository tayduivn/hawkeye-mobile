import { StorageService } from './storage.service';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class UserInfoService {
    info: any = {
        api_token: '',
        company_no: '',
        id: null,
        name: '',
        email: '',
        level: null,
        department: '',
    };

    constructor(private storage: StorageService) {
        this.info = this.storage.get('USER_INFO');
    }
}
