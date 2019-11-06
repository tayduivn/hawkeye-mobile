import {
  FileUploadService,
  VideoOther
} from "./../../services/file-upload.service";
import { FileChooser } from "@ionic-native/file-chooser/ngx";
import { PageEffectService } from "src/app/services/page-effect.service";
import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import {
  MediaCapture,
  CaptureError,
  MediaFile
} from "@ionic-native/media-capture/ngx";
import { ActionSheetOptions } from "@ionic/core";
import { Chooser } from "@ionic-native/chooser/ngx";
import { FilePath } from "@ionic-native/file-path/ngx";

@Component({
  selector: "app-videotape",
  templateUrl: "./videotape.component.html",
  styleUrls: ["./videotape.component.scss"]
})
export class VideotapeComponent implements OnInit {
  @Input() set videos(input: MediaFile[][]) {
    if (!!input) {
      this.videos = input;
    }
  }

  @Input() type: string;
  @Input() apply_inspection_no: string;
  @Input() contract_no: string;
  @Input() sku: string;
  @Input() box_type: "outer" | "inner";

  constructor(
    public mediaCapture: MediaCapture,
    private fileChooser: FileChooser,
    private chooser: Chooser,
    private filePath: FilePath,
    private ec: PageEffectService,
    private uploadService: FileUploadService
  ) {}

  @Output() onComplete: EventEmitter<MediaFile[][]> = new EventEmitter<
    MediaFile[][]
  >();

  _videos: MediaFile[][] = [];

  ngOnInit() {
    this.uploadService.fileTransfer.onProgress(event => {
      console.log(event);
    });
  }

  upload(obj: any) {
    let params: VideoOther = {
      type: this.type,
      apply_inspection_no: this.apply_inspection_no,
      contract_no: this.contract_no,
      box_type: this.box_type,
      sku: this.sku
    };
    this.uploadService.upload({ fileUrl: obj.filePath, params: params });
  }

  videotape() {
    const option: ActionSheetOptions = {
      header: "上传方式",
      buttons: [
        {
          text: "录像",
          role: "",
          icon: "camera",
          handler: () => {
            this.tape();
          }
        },
        {
          text: "选择文件",
          icon: "folder",
          handler: () => {
            this.fileChoose();
          }
        }
      ],
      mode: "ios"
    };
    this.ec.showActionSheet(option);
  }

  fileChoose() {
    this.ec.showAlert({
      message: "选择中……",
      backdropDismiss: false
    });

    this.fileChooser.open().then(uri => {
      this.filePath
        .resolveNativePath(uri)
        .then(url => {
          let obj: any = {
            name: "test",
            fullPath: url,
            type: "video",
            lastModifiedDate: null,
            size: null
          };
          console.log(obj);
          this.ec.clearEffectCtrl();
          this._videos.push([obj]);
          this.onComplete.emit(this._videos);
          this.upload(obj);
        })
        .catch(err => console.log(err));
    });
    return;
    this.chooser.getFile("video/*").then(res => {
      console.log(res);
      this.filePath
        .resolveNativePath(res.uri)
        .then(url => {
          let obj: any = {
            name: res.name,
            fullPath: url,
            type: res.mediaType,
            lastModifiedDate: null,
            size: null
          };
          console.log(obj);
          this.ec.clearEffectCtrl();
          this._videos.push([obj]);
          this.onComplete.emit(this._videos);
        })
        .catch(err => console.log(err));
    });
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
