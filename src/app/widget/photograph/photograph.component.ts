import { environment } from 'src/environments/environment.prod';
import { PageEffectService } from 'src/app/services/page-effect.service';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { ImagePicker, ImagePickerOptions } from '@ionic-native/image-picker/ngx';
import { ActionSheetOptions } from '@ionic/core';

@Component({
  selector: 'app-photograph',
  templateUrl: './photograph.component.html',
  styleUrls: ['./photograph.component.scss']
})
export class PhotographComponent implements OnInit {
  @Input() set photos(input: string[]) {
    if (!input) { return; }
    input = input.map(res => this.imgOrigin + res);
    if (!!input) { this._photos = input; }
  }
  constructor(private camera: Camera, private ec: PageEffectService, private imagePicker: ImagePicker) {}
  imgOrigin: string = environment.fileUrlPath;

  // tslint:disable-next-line: no-output-on-prefix
  @Output() onPhotograph: EventEmitter<string[]> = new EventEmitter<string[]>();
  // tslint:disable-next-line: variable-name
  _photos: string[] = [];

  options: CameraOptions = {
    quality: 100,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE
  };

  pickerOpts: ImagePickerOptions = {
    maximumImagesCount: 1,
    quality: 100
  };

  ngOnInit() {}

  photograph() {
    const option: ActionSheetOptions = {
      header: '上传方式',
      buttons: [{
        text: '拍照',
        role: '',
        icon: 'camera',
        handler: () => {
          this.graph();
        }
      }, {
        text: '选择文件',
        icon: 'folder',
        handler: () => {
          this.picker();
        }
      }],
      mode: 'ios'
    };
    this.ec.showActionSheet(option);
  }

  graph() {
    this.camera.getPicture(this.options).then(
      imageData => {
        const base64Image = 'data:image/jpeg;base64,' + imageData;
        this._photos.push(base64Image);
        this.onPhotograph.emit(this._photos);
      },
      err => {
        this.ec.showToast({
          message: '请重新拍照',
          color: 'danger'
        });
      }
    );
  }

  picker() {
    this.imagePicker.getPictures( this.pickerOpts )
        .then(
          res => {
            console.log(res);
          },
          err => {
            console.log(err);
          }
        );
  }

  remove(i: number) {
    this._photos.splice(i, 1);
    const output = this._photos.map(res => res.substring(this.imgOrigin.length, res.length));
    this.onPhotograph.emit(output);
  }
}
