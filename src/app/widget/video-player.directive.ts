import { Directive, HostListener, Input } from '@angular/core';
import { VideoPlayer } from "@ionic-native/video-player/ngx";

@Directive({
  selector: '[appVideoPlayer]'
})
export class VideoPlayerDirective {
  @HostListener('click', ['$event']) onclick(e:any) {
    this.videoPlayer.play(this.source,{volume:.5,scalingMode:400})
          .then(() => {
            console.log("video completed");
          })
          .catch(err => {
            console.log(err);
          });
  }
    
  @Input() source:string

  constructor(private videoPlayer: VideoPlayer) { }

}
