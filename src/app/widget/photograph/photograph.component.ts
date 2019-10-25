import { environment } from "src/environments/environment.prod";
import { PageEffectService } from "src/app/services/page-effect.service";
import { Component, OnInit, Output, EventEmitter, Input } from "@angular/core";
import { Camera, CameraOptions } from "@ionic-native/camera/ngx";

@Component({
  selector: "app-photograph",
  templateUrl: "./photograph.component.html",
  styleUrls: ["./photograph.component.scss"]
})
export class PhotographComponent implements OnInit {
  imgOrigin: string = environment.fileUrlPath;
  @Input() set photos(input: string[]) {
    input = input.map(res => this.imgOrigin + res);

    if (!!input) this._photos = input;
  }

  @Output() onPhotograph: EventEmitter<string[]> = new EventEmitter<string[]>();
  constructor(private camera: Camera, private ec: PageEffectService) {}
  ngOnInit() {}
  _photos: string[] = [];

  options: CameraOptions = {
    quality: 100,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE
  };

  photograph() {
    this.camera.getPicture(this.options).then(
      imageData => {
        let base64Image = "data:image/jpeg;base64," + imageData;
        this._photos.push(base64Image);
        this.onPhotograph.emit(this._photos);
      },
      err => {
        this.ec.showToast({
          message: "请重新拍照",
          color: "danger"
        });
      }
    );
  }

  remove(i: number) {
    this._photos.splice(i, 1);
    let output = this._photos.map(res => res.substring(this.imgOrigin.length,res.length))
    this.onPhotograph.emit(output);
  }
}
