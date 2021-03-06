import { Injectable } from '@angular/core';
import { RequestService } from 'src/app/blue-bird/service/request.service';
import { environment } from 'src/environments/environment';
import { UserInfoService } from 'src/app/services/user-info.service';
import { PageEffectService } from 'src/app/services/page-effect.service';
import { Network } from '@ionic-native/network/ngx';
import { ImageOther, VideoOther } from 'src/app/services/file-upload.service';
import { Observable, Subscription, BehaviorSubject, Subject } from 'rxjs';
import { File as AndroidFile } from '@ionic-native/file/ngx';
import { VerifyResponse, UploadParams, FieldType } from 'src/app/widget/videotape/videotape.component';
import { FileChunkService, Chunk } from 'src/app/blue-bird/service/file-chunk.service';
import { FileHashService } from 'src/app/blue-bird/service/file-hash.service';
import { HttpService } from 'src/app/services/http.service';

export interface QueueNode<T> {
    type: 'img' | 'video' | 'file';
    size: number; //blob的size
    payload: T; //服务器上传的额外参数  ImageOther || UploadParams
    blob?: Blob;
    percentage?: number; //进度 通过XHR的onProgress事件得来
    hash?: number | string; //文件唯一hash -> image的是通过字符串的charCode计算,video的是通过文件唯一hash计算+其切片index
    chunks?: QueueNode<UploadParams>[]; //只有video有
    fileHash?: string | number; //video专属
    index?: number; //video专属
    chunksLength?: number; //chunks数量
    already?: number; //已经上传的数量
}

@Injectable({
    providedIn: 'root',
})
export class UploadQueueService {
    status: boolean = false; // 是否在下载
    isSuspend: boolean = false; //是否暂停状态
    queue: Array<QueueNode<any>> = []; //上传队列 数组队列
    videoQueue: Array<QueueNode<any>> = []; //视频上传队列
    alreadyUploadQueue: Array<QueueNode<any>> = []; //已上传数组队列
    onChangeUploadStatus: BehaviorSubject<boolean> = new BehaviorSubject(this.isSuspend);
    alreadyUpProgress: boolean = false; //已经点过“上传进度”按钮 状态

    getImgData: BehaviorSubject<{ data: Blob; elem: ImageOther }> = new BehaviorSubject(null);

    //保存一个全局图片状态
    globalImgCache: Subscription;
    //保存一个全局视频状态
    globalVideoCache: Subscription;

    alreadyUploadPayload$: Subject<QueueNode<ImageOther>> = new Subject();
    constructor(
        private request: RequestService,
        private userInfo: UserInfoService,
        private es: PageEffectService,
        private network: Network,
        private file: AndroidFile,
        private fileReq: RequestService,
        private fileChunk: FileChunkService,
        private fileHash: FileHashService,
        private http: HttpService,
    ) {
        network.onChange().subscribe(res => {
            // alert("在uploadQueue service");
            // console.log('---- 重新进入 ----')
            let msg: string = '',
                color: string = 'success';
            if (!this.queue || !this.queue.length) return;
            switch (network.type) {
                case '2g':
                    msg = `当前网络环境为2g,系统判定暂停上传任务。`;
                    color = 'warning';
                    this.suspend();
                    break;
                case '3g':
                    msg = `当前网络环境为3g,系统判定暂停上传任务。`;
                    color = 'warning';
                    this.suspend();
                    break; 
                case '4g':
                    msg = `当前网络环境为4g,上传任务自动进行。`;
                    color = 'success';
                    this.restart();
                    break;
                case 'wifi':
                    msg = `当前网络环境为wifi,上传任务自动进行。`;
                    color = 'success';
                    this.restart();
                    break;
                default: {
                    msg = `当前没有网络连接,系统暂停上传任务。`;
                    color = 'danger';
                    this.suspend();
                }
            }
            this.es.showToast({
                message: msg,
                color: color,
            });
        });
    }
    num: number = 0;
    /**
     * 向已上传队列里增加成员
     * @param ele  成员 - node
     */
    push(ele: QueueNode<any>) {
        this.queue.push(ele);
        this.duplicateRemoval();
        !this.status && this.run();
        // this.queue = this.duplicateRemoval();  TODO有问题
        return true;
    }

    /**
     * 队列去重
     */
    duplicateRemoval(): QueueNode<any>[] {
        let hash = {},
            data: QueueNode<any>[] = this.queue;
        data = data.reduce((preVal, curVal) => {
            hash[curVal.hash] ? '' : (hash[curVal.hash] = true && preVal.push(curVal));
            return preVal;
        }, []);
        return data;
    }

    /**
     * 队列出列 -
     */
    pop(payload?: { path: string; type: FieldType }, notEmitImg?: boolean) {
        let qNode = this.queue.shift();
        if (!qNode) return;
        let node = {
            type: qNode.type, //mediaType
            size: qNode.size,
            percentage: 100,
            payload: qNode.payload,
            path: payload.path,
        };
        // qNode.payload.type = payload.type;
        this.alreadyUploadQueue.push(node);
        //console.log('------ 回传 -----', node.path);
        !notEmitImg && this.alreadyUploadPayload$.next(node);
        return qNode;
    }

    //获取队首
    get front(): QueueNode<any> {
        return this.queue[0];
    }

    //获取队尾
    get rear(): QueueNode<any> {
        return this.queue[this.queue.length - 1];
    }

    //清空队列
    clear() {
        this.queue = [];
    }

    //获取队长
    get size(): number {
        return this.queue.length;
    }

    //暂停机制
    suspend() {
        if (!this.requestList || !this.requestList.length) return;
        this.requestList[0].abort();
        this.isSuspend = true;
        this.status = false;
        this.onChangeUploadStatus.next(this.isSuspend);
    }

    //重新开始
    restart() {
        this.queue = [...this.queue];
        this.requestList = [];
        this.isSuspend = false;
        this.status = true;
        this.upload();
        this.onChangeUploadStatus.next(this.isSuspend);
    }

    /**
     * run方法 自动上传
     */
    run() {
        this.status = true;
        this.onChangeUploadStatus.next(false);
        // if (!this.networkLogic()) return;
        this.upload();
    }

    //Add 外部调用
    add(ele: QueueNode<any>) {
        if (ele.type == 'img') {
            this.push(ele);
        } else this.packingVideo(ele);
    }

    requestList: XMLHttpRequest[] = [];

    /**
     * 上传视频
     */
    async packingVideo(ele: QueueNode<any>) {
        //此地做视频分片 断点续传功能
        //文件切片
        const fileChunkList = await this.fileChunk.handleFile(ele.blob);
        //主动将整个Blob置为null 释放缓存
        ele.blob = null;
        //文件hash
        const hash = await this.fileHash.initHashWorker(fileChunkList);
        ele.payload.hash = hash;
        //验证上传
        const {
            data: { uploadedList, shouldUpload },
        } = await this.verifyUpload(hash, ele.payload.path, ele.payload);
        if (!shouldUpload) {
            alert('文件已上传');
            return;
        } else {
            // 此地将切片push到队列
            this.chunkToQueueNode(uploadedList ? uploadedList : [], fileChunkList, ele);
        }
    }

    /**
     * 网速判断
     */
    networkLogic(): boolean {
        let val: boolean = true;
        // if (this.network.type == 'none') {
        //     val = false;
        //     this.suspend();
        //     this.es.showToast({
        //         message: '当前网络环境不佳，上传任务搁置',
        //         color: 'danger',
        //     });
        // }
        return val;
    }

    //驱动上传
    async driveUpload(node: QueueNode<ImageOther | UploadParams>): Promise<any> {
        if (!node) return true;
        let formData: FormData = new FormData();
        try {
            //组装额外参数 区分图片和视频
            for (let key in node.payload) {
                formData.append(key, node.payload[key]);
            }
            if (node.type == 'video') {
                formData.append('sort_index', (node as any).sort_index as any);
                formData.append('apply_inspection_no', (node as any).apply_inspection_no);
                formData.append('contract_no', (node as any).contract_no);
                formData.append('sku', (node as any).sku);
                formData.append('chunk', (node as any).chunk);
                formData.append('chunk_total', (node as any).chunk_total);
                formData.delete('hash');
            }
            // console.log('-----  上传之前FormData  -----');
            // console.log(node.payload)
        } catch (e) {
            console.log('getFront没有', this.queue, node);
        }
        node.type == 'img' && formData.append('file', node.blob);
        //将结果返回
        return await this.request.request({
            url: `${environment.apiUrl}${
                node.type == 'img' ? '/task/add_inspection_task_img2' : '/task/add_inspection_task_video'
            }`,
            requestList: this.requestList,
            onProgress: this.createProgressHandler(this.front), //此处优化 闭包
            data: formData,
            headers: {
                Authorization: this.userInfo.info ? `Bearer ${this.userInfo.info.api_token}` : undefined,
                // 'Content-Type':'multipart/form-data'
            },
        });
    }

    /**
     * 通用上传API
     * 递归
     */
    async upload() {
        let chunkNode: Array<QueueNode<ImageOther | UploadParams>> = [];
        //此处判断是否有chunks
        if (this.front.chunks && this.front.chunks.length) {
            //如果有则将chunks转为队列
            chunkNode = this.front.chunks;
        } else {
            chunkNode = [this.front];
        }
        //chunkNode 是一个数组（队列里的队列）
        if (chunkNode && chunkNode.length && chunkNode[0].type == 'video') {
            //先执行一维队列里的二维队列，执行完了在依次向下递归执行
            const next = await this.driveUpload(chunkNode[0]);
            if (next.data && JSON.parse(next.data).status == 1) {
                chunkNode.shift();
                if (chunkNode.length) {
                    //如果还有切片则上传
                    this.upload();
                    return;
                }
                console.log('此时最后一次切片的respose',next);
                
                if (JSON.parse(next.data).data && JSON.parse(next.data).data.canMerge === true) {
                    //否则 则合并切片
                    const msg = await this.mergeRequest(this.front);
                    //合并完成之后 判断状态 如果成功则删除缓存 在让主队列的front出列
                    if (msg.status === 1 && this.front) {
                        // this.pop(msg.data);
                        this.pop(msg.data[0], msg.data.status === 'already');
                        if (this.size) {
                            this.upload();
                            //此处判断如果一维队列没有queue可传 则将总状态（status）置为false
                        } else this.status = false;
                        return;
                    }
                } else {
                    this.cancel();
                    return;
                }
            } else {
                this.cancel();
                alert('上传出错，请重新上传');
            }
        }

        console.log('视频上传不应该执行到这里  ');
        const next = await this.driveUpload(chunkNode[0]);

        //如果next为 则直接跳过 上传下一个
        if (next === true || (next && next.data && !JSON.parse(next.data).error) || next === 1) {
            try {
                //console.log('------ 返回值 -------', JSON.parse(next.data));
                //!Important  此处判断因为后台去重后返回的值status 为 already时 不pop队列 不删除缓存 继续往下执行方法
                //再出队列 将已经上传的node的线上url发布出去 等待photograph component订阅
                this.pop(JSON.parse(next.data).data[0], JSON.parse(next.data).status === 'already');
            } catch (e) {
                //console.log(this.front);
            }
            if (this.size && this.front) {
                this.upload();
            } else this.status = false;
        } else {
            //暂停上传
            this.es.showToast({
                color: 'danger',
                message: '当前网络状态不好，系统自动暂停上传',
            });
            this.front.percentage = 0;
        }
    }

    // 用闭包保存每个 chunk 的进度数据
    createProgressHandler(item: QueueNode<any>) {
        if (!item) return;
        try {
            return (e: { loaded: number; total: number }) => {
                if (item.type == 'img') {
                    item.percentage = parseInt(String((e.loaded / e.total) * 100));
                } else {
                    //在此增加计算已经上传了的切片
                    (item as any).current = parseInt(String((e.loaded / e.total) * 100));
                    if ((item as any).current === 100) {
                        item.percentage = 100 - (item.chunks.length / item.chunksLength) * 100;
                        console.log('--------------------- 切片完成 ---------------------', item.percentage);
                    }
                }
            };
        } catch (e) {
            console.log(e, item);
        }
    }

    async chunkToQueueNode(uploadedList: string[] = [], fileChunkList: Chunk[], ele: QueueNode<UploadParams>) {
        //组装成QueueNode
        //Push到上传队列
        const data: QueueNode<UploadParams>[] = fileChunkList
            //组装为切片
            .map(({ file }, index) => {
                let obj = {
                    chunk: file,
                    type: ele.type,
                    payload: null,
                    size: file.size,
                    apply_inspection_no: ele.payload.apply_inspection_no,
                    contract_no: ele.payload.contract_no,
                    sku: ele.payload.sku,
                    chunk_total: fileChunkList.length,
                    percentage: uploadedList.includes(index + '') ? 100 : 0, //每个切片的进度条
                };
                obj.payload = {
                    cut_num: index,
                    filehash: ele.payload.hash,
                    hash: ele.payload.hash + '__' + index,
                    index: index,
                    upload_type: 'upload',
                    type: ele.payload.type,
                };
                return obj;
            })
            //筛选未上传的切片
            .filter(({ payload: { hash } }) => !uploadedList.includes(hash));
        ele.already = uploadedList.length;
        ele.chunks = data;
        /**
         *  此地需要判断一种情况
         *  当切片通过线上已上传的切片过滤后没有可传的切片时
         *  此时直接进行合并操作
         * */
        if (fileChunkList.length === uploadedList.length) {
            let node: QueueNode<VideoOther> = {
                type: 'video',
                size: null,
                payload: {
                    type: ele.payload.type,
                    apply_inspection_no: ele.payload.apply_inspection_no,
                    contract_no: ele.payload.contract_no,
                    sku: ele.payload.sku,
                    hash: ele.payload.hash as any,
                    sort_index: ele.payload.sort_index,
                },
            };
            const msg = await this.mergeRequest(node);

            //合并完成之后 判断状态 如果成功则删除缓存 在让主队列的front出列
            if (msg.status === 1) {
                (node as any).path = msg.data[0].path;
                this.alreadyUploadPayload$.next(node as any);
                if (this.size) {
                    this.upload();
                    //此处判断如果一维队列没有queue可传 则将总状态（status）置为false
                } else this.status = false;
                return;
            }
            return;
        }
        //此地先将chunks的数量存好，上传的时候是每传完一个就会删除
        ele.chunksLength = fileChunkList.length;
        ele.percentage = (ele.already / ele.chunksLength) * 100;

        this.push(ele); //** 此处应该在push里驱动upload
    }

    async mergeRequest(node: QueueNode<VideoOther>): Promise<any> {
        let data = {
            filehash: node.payload.hash,
            type: node.payload.type,
            apply_inspection_no: node.payload.apply_inspection_no,
            contract_no: node.payload.contract_no,
            sku: node.payload.sku,
            upload_type: 'merge',
            sort_index: node.payload.sort_index,
        };
        !node.payload.sort_index && delete data.sort_index;
        return this.http.post({ url: '/task/add_inspection_task_video', params: data }).toPromise();
    }

    async getFileEntry(url: string): Promise<any> {
        let dirPath = url.substring(0, url.lastIndexOf('/'));
        let fileName = url.substring(url.lastIndexOf('/') + 1, url.length);
        return await this.file.readAsArrayBuffer(dirPath, fileName);
    }

    //根据参数获取base64流 （每个photograph展示用）
    getCacheImagesByParams(params: ImageOther) {
        let cache: Array<ImageOther> = JSON.parse(localStorage.getItem('CURRENT_INSPECT_META_DATA_PATH'));
    }

    /**
     * 通过base64ToBlob WebWorker 得到Blob
     * @param base64
     */
    doWorkerGetBlob(base64: String): Observable<any> {
        let obs = new Observable(observer => {
            const worker: Worker = new Worker('../assets/js/dataURItoBlob.js');
            worker.postMessage({ res: base64 });
            worker.onmessage = e => {
                observer.next(e);
            };
        });
        return obs;
    }

    /**
     * 验证视频上传接口
     * @param fileHash
     * @param filePath
     */
    async verifyUpload(fileHash: string, filePath: string, params: UploadParams): Promise<VerifyResponse> {
        const { data } = await this.fileReq.request({
            url: `${environment.apiUrl}/task/add_inspection_task_video`,
            headers: {
                'content-type': 'application/json',
            },
            data: JSON.stringify({
                filehash: fileHash,
                filepath: filePath,
                type: params.type,
                apply_inspection_no: params.apply_inspection_no,
                contract_no: params.contract_no,
                sku: params.sku,
                upload_type: 'fileVerify',
            }),
        });
        return JSON.parse(data);
    }

    //取消上传 跳过第一个
    cancel() {
        this.suspend(); //暂停
        this.queue.shift(); //出队列
        this.size && this.restart(); //重新开始上传
    }
}

export function HashCode(str: string) {
    var hash: number = 0,
        i: number,
        chr: number;
    if (str.length === 0) return hash;
    for (i = 0; i < str.length; i++) {
        chr = str.charCodeAt(i);
        hash = (hash << 5) - hash + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
}
