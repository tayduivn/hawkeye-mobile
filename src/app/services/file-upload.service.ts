import { PageEffectService } from "src/app/services/page-effect.service";
import { UserInfoService } from "./user-info.service";
import { OnInit } from "@angular/core";
import { Injectable } from "@angular/core";
import {
  FileTransfer,
  FileTransferObject,
  FileUploadOptions
} from "@ionic-native/file-transfer/ngx";

export interface UploadObject {
  fileUrl: string;
  params: VideoOther
  trustAllHosts?: boolean;
}

export interface VideoOther{
  type:string
  apply_inspection_no:string
  contract_no:string
  sku:string
  box_type:'outer'|'inner'
}

@Injectable({
  providedIn: "root"
})
export class FileUploadService implements OnInit {
  fileTransfer: FileTransferObject = this.transfer.create();

  constructor(
    private transfer: FileTransfer,
    private userInfo: UserInfoService,
    private es: PageEffectService
  ) {}

  ngOnInit(): void {
    this.fileTransfer.onProgress = listener => {
      console.log(listener);
    };
  }

  upload(params: UploadObject) {
    let options: FileUploadOptions = {
      httpMethod: "POST",
      fileKey: "video",
      fileName: "video",
      params:params.params,
      headers: {
        Authorization: this.userInfo.info
          ? `Bearer ${this.userInfo.info.api_token}`
          : undefined
      }
    };

    // this.fileTransfer.onProgress((event) => {
    //   console.log(event)
    // })

    this.fileTransfer
      .upload(
        params.fileUrl,
        "http://192.168.1.144/api/v1/task/upload_video_post",
        options
      )
      .then(res => {
        this.es.showAlert({
          message: "上传成功！"
        });
        console.log(res.response);
      });
  }
}
