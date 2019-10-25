import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { MediaCapture, CaptureError,MediaFile } from "@ionic-native/media-capture/ngx";

@Component({
  selector: "app-videotape",
  templateUrl: "./videotape.component.html",
  styleUrls: ["./videotape.component.scss"]
})
export class VideotapeComponent implements OnInit {

  @Input() set videos(input:MediaFile[][]){
      if(!!input) this.videos = input
  }

  @Output() onComplete:EventEmitter<MediaFile[][]> = new EventEmitter<MediaFile[][]>()

  constructor(public mediaCapture: MediaCapture) {}
  ngOnInit() {}

  _videos: MediaFile[][] = [
   
  ]

  videotape() {
    this.mediaCapture.captureVideo({ limit: 1, quality: 30 }).then(
      (mediaFiles: any[]) => {
        console.log(mediaFiles);
        this._videos.push(mediaFiles);
        this.onComplete.emit(this._videos)
      },
      (err: CaptureError) => {}
    );
  }
}
