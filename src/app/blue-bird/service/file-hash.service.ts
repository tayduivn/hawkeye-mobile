import { Injectable } from '@angular/core';
import { Chunk } from './file-chunk.service';
import { PageEffectService } from '../../services/page-effect.service';

@Injectable({
    providedIn: 'root'
})
export class FileHashService {
    constructor(private ec: PageEffectService) {}

    initHashWorker(fileChunkList: Chunk[]): Promise<string> {
        return new Promise(reject => {
            let worker = new Worker('../assets/js/hash.js');
            this.ec.showLoad({
              message:'正在获取文件hash……',
            })
            worker.postMessage({ fileChunkList });
            worker.onmessage = e => {
                const { percentage, hash } = e.data;
                this.ec.clearEffectCtrl()
                if (hash) {
                    reject(hash as string);
                }
            };
        });
    } 

    fileToBlob(file: File): Promise<any> {
        return new Promise(reject => {
            let worker = new Worker('../assets/js/filetoblob.js');
            worker.postMessage({ file });
            worker.onmessage = e => {
                const { blob } = e.data;
                reject(blob);
            };
        });
    }

    
}
