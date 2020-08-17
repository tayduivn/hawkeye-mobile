import { LoadingService } from './loading.service';
import { PageEffectService } from './page-effect.service';
import { Injectable } from '@angular/core';
import {
    HttpInterceptor,
    HttpRequest,
    HttpHandler,
    HttpErrorResponse,
    HttpSentEvent,
    HttpHeaderResponse,
    HttpProgressEvent,
    HttpResponse,
    HttpUserEvent,
} from '@angular/common/http';
import { Router } from '@angular/router';

import { Observable, of } from 'rxjs';
import { mergeMap, catchError, timeout, retryWhen, scan, delay, tap, takeWhile } from 'rxjs/operators';
import { renewInitRequestTime, maxRenewInitRequest } from '../config/config';
import { environment } from 'src/environments/environment';

@Injectable()
export class DefaultInterceptor implements HttpInterceptor {
    public errArr: Array<number> = [401, 404, 500, 502, 301];
    filterUrls: string = '/task/add_inspection_task_img /task/add_inspection_task_video';
    constructor(private router: Router, private loading: LoadingService, public effectCtrl: PageEffectService) {}

    intercept(
        req: HttpRequest<any>,
        next: HttpHandler,
    ): Observable<HttpSentEvent | HttpHeaderResponse | HttpProgressEvent | HttpResponse<any> | HttpUserEvent<any>> {
        // req = req.clone({
        //   setHeaders: {
        //     Authorization: `Bearer ${this.baseData.userInfo.api_token}`
        //   }
        // });
        // console.log('HttpInterceptor req', req);
        return next.handle(req).pipe(
            mergeMap((event: any) => {
                // 允许统一对请求错误处理，这是因为一个请求若是业务上错误的情况下其HTTP请求的状态是200的情况下需要
                if (event instanceof HttpResponse && event.status == 200) return this.handleData(event);
                // 若一切都正常，则后续操作
                return of(event);
            }),
            timeout(renewInitRequestTime),
            retryWhen(err$ => {
                //重试 节奏控制器
                // takeWhile(req => (req as any).url.indexOf(this.filterUrls) != -1),
                return err$.pipe(
                    scan((errCount, err: HttpErrorResponse) => {
                        if (errCount >= maxRenewInitRequest || this.errArr.indexOf(err.status) != -1) {
                            throw err;
                        }
                        return errCount + 1;
                    }, 0),
                    delay(3000),
                    tap(errCount => {
                        if (errCount == 1) {
                            //第一次重试时显示友好信息
                            this.effectCtrl.showToast({
                                message: '网络错误，正在进行第一次重新请求',
                                color: 'warning',
                            });
                        } else if (errCount == 2) {
                            this.effectCtrl.toastCtrl.dismiss();
                            this.effectCtrl.showToast({
                                message: '网络错误，正在进行第二次重新请求',
                                color: 'warning',
                            });
                        } else {
                        }
                    }),
                );
            }),
            catchError((err: HttpErrorResponse) => this.handleData(err)),
        );
    }

    private handleData(event: HttpResponse<any> | HttpErrorResponse): Observable<any> {
        // console.log('HttpInterceptor handleData', event);
        // 可能会因为 `throw` 导出无法执行 `_HttpClient` 的 `end()` 操作
        // this.injector.get(_HttpClient).end();
        // 业务处理：一些通用操作
        this.loading.setLoading(false);
        // this.effectCtrl.showLoad({
        //     message: '加载中…'
        // })
        switch (event.status) {
            case 200:
                !environment.production && console.log('成功发送请求');
                // 业务层级错误处理，以下是假定restful有一套统一输出格式（指不管成功与否都有相应的数据格式）情况下进行处理
                // 例如响应内容：
                //  错误内容：{ status: 1, msg: '非法参数' }
                //  正确内容：{ status: 0, response: {  } }
                // 则以下代码片断可直接适用
                // if (event instanceof HttpResponse) {
                //     const body: any = event.body;
                //     if (body && body.status !== 0) {
                //         this.msg.error(body.msg);
                //         // 继续抛出错误中断后续所有 Pipe、subscribe 操作，因此：
                //         // this.http.get('/').subscribe() 并不会触发
                //         return throwError({});
                //     } else {
                //         // 重新修改 `body` 内容为 `response` 内容，对于绝大多数场景已经无须再关心业务状态码
                //         return of(new HttpResponse(Object.assign(event, { body: body.response })));
                //         // 或者依然保持完整的格式
                //         return of(event);
                //     }
                // }
                
                this.clearEffectElem();
                if (event instanceof HttpResponse) {
                    const body: any = event.body;
                    if (body && body.retCode === 1002) {
                        // this.msg.error(body.comment);
                        this.router.navigate(['/login']);
                    }
                }
                break;
            case 401: // 未登录状态码
                this.effectCtrl.alertCtrl
                    .getTop() //跨域的时候有时会发送两次请求  为了避免有两个弹框 先判断
                    .then(alert => {
                        if (!alert) {
                            this.effectCtrl.showAlert({
                                header: '提示',
                                message: '登陆无效，请重新登录',
                                backdropDismiss: false,
                                buttons: [
                                    {
                                        text: 'ok',
                                        handler: () => {
                                            this.effectCtrl.alertCtrl.dismiss().then(() => {
                                                sessionStorage.removeItem('USER_INFO');
                                                this.router.navigate(['/login']);
                                                this.clearEffectElem();
                                            });
                                        },
                                    },
                                ],
                            });
                        }
                    });
                break;
            case 403:
            case 404:
                this.clearEffectElem();
                this.effectCtrl.showToast({
                    message: '请求错误，请稍后重试！',
                    color: 'danger',
                });
            case 500:
                this.clearEffectElem();
                this.effectCtrl.showAlert({
                    header: '提示',
                    message: '服务器出错啦',
                    backdropDismiss: false,
                    buttons: [
                        {
                            text: 'ok',
                            handler: () => {
                                this.effectCtrl.alertCtrl.dismiss();
                            },
                        },
                    ],
                });
                break;
            default:
                if (event instanceof HttpErrorResponse) {
                    console.warn('未可知错误，大部分是由于后端不支持CORS或无效配置引起', event);
                }
                this.clearEffectElem();
                this.effectCtrl.showAlert({
                    header: '提示',
                    message: '网络错误，请稍后重试',
                    buttons: ['ok'],
                });
                break;
        }
        return of(event);
    }

    private clearEffectElem() {
        this.effectCtrl.toastCtrl.getTop().then((e: any) => {
            if (e && e.id) {
                this.effectCtrl.toastCtrl.dismiss();
            }
        });
        this.effectCtrl.loadCtrl.getTop().then((e: any) => {
            if (e && e.id) {
                this.effectCtrl.loadCtrl.dismiss();
            }
        });
        this.effectCtrl.alertCtrl.getTop().then((e: any) => {
            if (e && e.id) {
                this.effectCtrl.alertCtrl.dismiss();
            }
        });
        this.effectCtrl.loadCtrl.getTop().then((e: any) => {
            if (e && e.id){
                this.effectCtrl.loadCtrl.dismiss();
            }
        })
    }
}
