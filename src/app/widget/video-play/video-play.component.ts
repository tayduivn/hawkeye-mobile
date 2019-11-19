import { environment } from './../../../environments/environment';
import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'app-video-play',
    templateUrl: './video-play.component.html',
    styleUrls: ['./video-play.component.scss'],
})
export class VideoPlayComponent implements OnInit {
    @Input() set source(input: string) {
      if(!!input){
        this._source = this.origin + '/' + input
      }
    }
    origin = environment.usFileUrl

    _source: string;
    constructor() {}

    ngOnInit() {}
}
