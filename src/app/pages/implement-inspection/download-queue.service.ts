import { Injectable } from '@angular/core';

export interface DownPayload {
    type: 'img' | 'video' | 'file';
    size: number;
}

@Injectable({
    providedIn: 'root',
})
export class DownloadQueueService {
    queue: Array<DownPayload> = [];
    constructor() {}

    push(ele: DownPayload) {
        this.queue.push(ele);
        return true;
    }

    pop() {
        return this.queue.shift();
    }

    //获取队首
    getFront() {
        return this.queue[0];
    }

    //获取队尾
    getRear() {
        return this.queue[this.queue.length - 1];
    }

    //清空队列
    clear() {
        this.queue = [];
    }

    //获取队长
    get size() {
        return this.queue.length;
    }

    /*********************  链式队列  *********************/

    // queue: Array<QueueNode> = [];
    // _length = 0;
    // _front: QueueNode; //队首指针
    // _rear: QueueNode; //队尾指针

    // get size() {
    //     return this._length;
    // }

    // get front() {
    //     return this._front;
    // }

    // get rear() {
    //     return this._rear;
    // }

    // push(ele: DownPayload) {
    //     let node: QueueNode = new QueueNode(ele),
    //         temp: QueueNode;

    //     if (this._length == 0) {
    //         this._front = node;
    //     } else {
    //         temp = this._rear;
    //         temp.next = node;
    //     }
    //     this._rear = node;
    //     this._length++;
    //     this.queue.push(node)
    //     return true;
    // }

    // pop() {
    //     let temp: QueueNode = this._front;
    //     this._front = this._front.next;
    //     this._length--;
    //     temp.next = null;
    //     return temp;
    // }

    // toString(): string {
    //     let string = '',
    //         temp = this._front;
    //     while (temp) {
    //         string += JSON.stringify(temp.node) + ' ';
    //         temp = temp.next;
    //     }
    //     return string;
    // }
    /*********************  链式队列  *********************/
}

export class QueueNode {
    node: DownPayload;
    next: QueueNode;
    constructor(ele: DownPayload) {
        this.node = ele;
    }
}
