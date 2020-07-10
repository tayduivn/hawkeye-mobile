import { FieldType } from './../widget/videotape/videotape.component';
import { HttpService } from './http.service';
import { environment } from 'src/environments/environment';
import { PageEffectService } from 'src/app/services/page-effect.service';
import { UserInfoService } from './user-info.service';
import { OnInit } from '@angular/core';
import { Injectable } from '@angular/core';
import { FileTransfer, FileTransferObject, FileUploadOptions } from '@ionic-native/file-transfer/ngx';
import { Observable } from 'rxjs';

export interface UploadObject {
    fileUrl: string;
    params: VideoOther;
    trustAllHosts?: boolean;
}

export interface VideoOther {
    type: string;
    apply_inspection_no: string;
    contract_no: string;
    sku: string;
    box_type: 'outer' | 'inner';
    sort_index?: number;
    path? : string; //缓存本机资源地址
    hash?: number //唯一性
}

export interface ImageOther {
    type: FieldType;        
    apply_inspection_no: string;
    contract_no: string;
    sku: string;
    box_type?: 'outer' | 'inner';
    is_inner_box?: number;
    sort_index?: number;
    path? : string; //缓存本机资源地址
    hash?: number //唯一性
}

export interface ImageResponse {
    status: number;
    message: string;
    data: string[];
}

@Injectable({
    providedIn: 'root',
})
export class FileUploadService implements OnInit {
    fileTransfer: FileTransferObject = this.transfer.create();

    constructor(
        private transfer: FileTransfer,
        private userInfo: UserInfoService,
        private es: PageEffectService,
        private http: HttpService,
    ) {}

    ngOnInit(): void {
        this.fileTransfer.onProgress = listener => {
            console.log(listener);
        };
    }

    uploadVideo(params: UploadObject) {
        this.es.showLoad({
            message: '正在上传中……',
            backdropDismiss: false,
        });
        let options: FileUploadOptions = {
            httpMethod: 'POST',
            fileKey: 'video',
            fileName: 'video',
            params: params.params,
            headers: {
                Authorization: this.userInfo.info ? `Bearer ${this.userInfo.info.api_token}` : undefined,
            },
        };

        this.fileTransfer
            .upload(params.fileUrl, `${environment.apiUrl}/task/add_inspection_task_video`, options)
            .then(res => {
                this.es.clearEffectCtrl();
                this.es.showToast({
                    message: JSON.parse(res.response).message,
                    color: JSON.parse(res.response).status ? 'success' : 'danger',
                });
                console.log(res.response);
            });
    }

    uploadImage(params: ImageOther): Observable<ImageResponse> {
        return this.http.post({ url: `/task/add_inspection_task_img`, params: params });
    }
}
