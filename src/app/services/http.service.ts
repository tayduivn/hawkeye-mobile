import { UserInfoService } from "./user-info.service";
import { LoadingService } from "./loading.service";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

export interface publicParams {
  url: string;
  params?: any;
}

@Injectable({
  providedIn: "root"
})
export class HttpService {
  constructor(
    private http: HttpClient,
    private loading: LoadingService,
    private userInfo: UserInfoService
  ) {}

  get(params: publicParams, showLoading?: boolean): Observable<any> {
    //登陆后的get请求
    !showLoading && this.loading.setLoading(true);
    return this.http.get(environment.apiUrl + params.url, {
      headers: {
        Authorization: this.userInfo.info
          ? `Bearer ${this.userInfo.info.api_token}`
          : undefined
      },
      params: params.params
    });
  }

  delete(params: publicParams, showLoading?: boolean): Observable<any> {
    !showLoading && this.loading.setLoading(true);
    return this.http.delete(
      environment.apiUrl + params.url + "/" + params.params,
      {
        headers: {
          Authorization: this.userInfo.info
            ? `Bearer ${this.userInfo.info.api_token}`
            : undefined
        }
      }
    );
  }

  post(params: publicParams, showLoading?: boolean): Observable<any> {
    !showLoading && this.loading.setLoading(true);
    let obj: any = {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: this.userInfo.info
        ? `Bearer ${this.userInfo.info.api_token}`
        : undefined
    };
    !this.userInfo.info && delete obj.Authorization;
    return this.http.post(
      environment.apiUrl + params.url,
      JSON.stringify(params.params),
      {
        headers: obj
      }
    );
  }
}
