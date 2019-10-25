import { UserInfoService } from './user-info.service';
import { Injectable } from "@angular/core";
import { Observable, fromEvent } from "rxjs";
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: "root"
})
export class NativeAjaxService {
  _xhr: XMLHttpRequest = new XMLHttpRequest();

  onProgress: Observable<any> = fromEvent(this._xhr, "progress");

  constructor(private user:UserInfoService) {
    

    let that = this;
    this._xhr.onreadystatechange = function() {
      if (that._xhr.readyState === 4 && that._xhr.status === 200) {
        console.log(that._xhr.responseText);
      }
    };

    this.onProgress.subscribe(res => {
      if (res.lengthComputable) {
        console.log(Math.ceil((res.loaded * 100) / res.total) + "%");
      }
    })
  }

  send(photo:any){
    debugger
    this._xhr.open("POST", 'http://192.168.1.144/api/v1' + "/file/upload")
    this._xhr.setRequestHeader('Authorization',`Bearer ${this.user.info.api_token}`)
    // this._xhr.setRequestHeader('Access-Control-Expose-Headers',`Authorization`)
    // this._xhr.setRequestHeader('Content-Type',`text/plain; charset=UTF-8`)
    var formData:FormData = new FormData();
    formData.append('photo',photo)
    formData.append('type','RoughWeight')
    formData.append('task_id','1')
    formData.append('contract_id','35')
    formData.append('sku','CW12N0279-22')
  

    this._xhr.send(formData)
  }
}
