import { Injectable } from '@angular/core';
import { FileTransfer, FileTransferObject, FileUploadOptions } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';

@Injectable({
    providedIn: 'root',
})
export class UploadImgService {
    constructor(private transfer: FileTransfer, private file: File) {}

    fileTransfer: FileTransferObject = this.transfer.create();

    upload() {
        let options: FileUploadOptions = {
            fileKey: 'file',
            fileName: 'name.jpg',
            headers: {},
        };

        this.fileTransfer.upload('', '', options).then(
            data => {
                console.log(data);
                // success
            },
            err => {
                // error
            },
        );
    }
}
