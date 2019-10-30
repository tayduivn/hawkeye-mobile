import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { PageEffectService } from 'src/app/services/page-effect.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MediaCapture, CaptureError, MediaFile } from '@ionic-native/media-capture/ngx';
import { ActionSheetOptions } from '@ionic/core';

@Component({
  selector: 'app-videotape',
  templateUrl: './videotape.component.html',
  styleUrls: ['./videotape.component.scss']
})
export class VideotapeComponent implements OnInit {

  @Input() set videos(input: MediaFile[][]) {
      if (!!input) { this.videos = input; }
  }

  constructor(public mediaCapture: MediaCapture,
              private fileChooser: FileChooser,
              private ec: PageEffectService) {}

  // tslint:disable-next-line: no-output-on-prefix
  @Output() onComplete: EventEmitter<MediaFile[][]> = new EventEmitter<MediaFile[][]>();

  // tslint:disable-next-line: variable-name
  _videos: MediaFile[][] = [

  ];

  ngOnInit() {}

  videotape() {
    const option: ActionSheetOptions = {
      header: '上传方式',
      buttons: [{
        text: '录像',
        role: '',
        icon: 'camera',
        handler: () => {
          this.tape();
        }
      }, {
        text: '选择文件',
        icon: 'folder',
        handler: () => {
          this.fileChoose();
        }
      }],
      mode: 'ios'
    };
    this.ec.showActionSheet(option);
  }

  fileChoose() {
    this.fileChooser.open()
        .then(uri => console.log(uri))
        .catch(e => console.log(e));
  }

  tape() {
    this.mediaCapture.captureVideo({ limit: 1, quality: 30 }).then(
      (mediaFiles: any[]) => {
        console.log(mediaFiles);
        this._videos.push(mediaFiles);
        this.onComplete.emit(this._videos);
      },
      (err: CaptureError) => {}
    );
  }


}
