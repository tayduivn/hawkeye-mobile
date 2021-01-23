import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-photo-evection',
    templateUrl: './photo-evection.component.html',
    styleUrls: ['./photo-evection.component.scss'],
})
export class PhotoEvectionComponent implements OnInit {
    constructor() {}
    environment = environment;
    ngOnInit() {}
    _photos: string[];
    // 移除图片
    remove() {}
    // 实现拍照
    graph() {}
    // 实现选择文件
    doCheckImg() {}
}
