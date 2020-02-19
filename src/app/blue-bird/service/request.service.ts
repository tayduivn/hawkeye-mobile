import { Injectable } from "@angular/core";

export interface FileParam {
  chunk: Blob;
  hash: string;
  filename: string;
  fileHash: string;
}
@Injectable()
export class RequestService {
  constructor() {}

  request({
    url,
    method = "post",
    data,
    headers = {},
    onProgress = e => e,
    requestList = []
  }): Promise<any> {
    return new Promise(resolve => {
      const xhr: XMLHttpRequest = new XMLHttpRequest();
      xhr.upload.onprogress = onProgress;
      xhr.open(method, url);
      Object.keys(headers).forEach(key =>
        xhr.setRequestHeader(key, headers[key])
      );
      xhr.send(data);
      xhr.onload = e => {
        // 将请求成功的 xhr 从列表中删除
        if (requestList) {
          const xhrIndex = requestList.findIndex(item => item === xhr);
          requestList.splice(xhrIndex, 1);
        }
        resolve({
          data: (e.target as any).response
        });
      };
      // 暴露当前 xhr 给外部  通过引用类型暴漏
      requestList && requestList.push(xhr);
    });
  }
}
