import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Chunk } from "./file-chunk.service";

@Injectable()
export class FileHashService {
  constructor() {}

  initHashWorker(fileChunkList: Chunk[]): Promise<string> {
    return new Promise(reject => {
      let worker = new Worker("./assets/hash.js");

      worker.postMessage({ fileChunkList });
      worker.onmessage = e => {
        const { percentage, hash } = e.data;
        if (hash) {
          reject(hash as string);
        }
      };
    });
  }
}
