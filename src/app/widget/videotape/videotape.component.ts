import { FileUploadService, VideoOther } from './../../services/file-upload.service';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { PageEffectService } from 'src/app/services/page-effect.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MediaCapture, CaptureError, MediaFile } from '@ionic-native/media-capture/ngx';
import { ActionSheetOptions } from '@ionic/core';
import { FilePath } from '@ionic-native/file-path/ngx';
import { VideoPlayComponent } from '../video-play/video-play.component';

export type FieldType =
    | 'throw_box_video'
    | 'appearance_video'
    | 'functions_video'
    | 'bearing_test_video'
    | 'water_content_test_video'
    | 'factory_sample_room'
    | 'factory_other'
    | 'gross_weight_pic'
    | 'throw_box'
    | 'size_pic'
    | 'packing_pic'
    | 'product_place_pic'
    | 'instructions_and_accessories_pic'
    | 'over_all_pic'
    | 'net_weight_pic'
    | 'bearing_test_pic'
    | 'water_content_test_pic'
    | 'inspection_complete_pic'
    | 'contract_sku_pic'
    | 'factory_environment_pic'
    | 'factory_sample_room_pic'
    | 'factory_other_pic';

@Component({
    selector: 'app-videotape',
    templateUrl: './videotape.component.html',
    styleUrls: ['./videotape.component.scss'],
})
export class VideotapeComponent implements OnInit {
    progress: number = 0;
    @Input() set videos(input: string[]) {
        if (!!input && input.length != 0) {
            this._up_data = input;
        }
    }

    @Input() type: string;
    @Input() apply_inspection_no: string;
    @Input() contract_no: string;
    @Input() sku: string;
    @Input() box_type: 'outer' | 'inner';

    constructor(
        public mediaCapture: MediaCapture,
        private fileChooser: FileChooser,
        private filePath: FilePath,
        private ec: PageEffectService,
        private uploadService: FileUploadService,
    ) {}

    @Output() onComplete: EventEmitter<MediaFile[][]> = new EventEmitter<MediaFile[][]>();

    _videos: MediaFile[][] = [];
    _up_data:string [] = []
    ngOnInit() {
        this.uploadService.fileTransfer.onProgress(progressEvent => {
            if (progressEvent.lengthComputable) {
                this.progress = progressEvent.loaded / progressEvent.total;
                console.log(progressEvent.loaded / progressEvent.total);
            }
        });
    }

    upload(obj: any) {
        let params: VideoOther = {
            type: this.type,
            apply_inspection_no: this.apply_inspection_no,
            contract_no: this.contract_no,
            box_type: this.box_type,
            sku: this.sku,
        };
        this.uploadService.uploadVideo({ fileUrl: obj.filePath, params: params });
    }

    videotape() {
        // if (this.progress < 1 && this.progress > 0) {
        //     this.ec.showToast({
        //         message: '等待当前视频上传',
        //         color: 'danger',
        //     });
        //     return;
        // }
        const option: ActionSheetOptions = {
            header: '上传方式',
            buttons: [
                {
                    text: '录像',
                    role: '',
                    icon: 'camera',
                    handler: () => {
                        this.tape();
                    },
                },
                {
                    text: '选择文件',
                    icon: 'folder',
                    handler: () => {
                        this.fileChoose();
                    },
                },
            ],
            mode: 'ios',
        };
        this.ec.showActionSheet(option);
    }

    fileChoose() {
        this.ec.showAlert({
            message: '选择中……',
            backdropDismiss: false,
        });

        this.fileChooser.open({mime:'video/mp4'}).then(uri => {
            this.filePath
                .resolveNativePath(uri)
                .then(url => {
                    let obj: any = {
                        name: `${this.type}_${this._videos.length + 1}.mp4`,
                        filePath: url,
                        type: 'video',
                        lastModifiedDate: null,
                        size: null,
                    };
                    this.ec.clearEffectCtrl();
                    this._videos.push([obj]);
                    this.onComplete.emit(this._videos);
                    this.upload(obj);
                })
                .catch(err => console.log(err));
        });
    }

    tape() {
        this.mediaCapture.captureVideo({ limit: 1, quality: 30 }).then(
            (mediaFiles: any[]) => {
                console.log(mediaFiles);
                this._videos.push(mediaFiles);
                this.upload(mediaFiles[0]);
                this.onComplete.emit(this._videos);
            },
            (err: CaptureError) => {},
        );
    }

    play(p:string){
        this.ec.showModal({
            component:VideoPlayComponent,
            componentProps:{source:p}
        })
    }
}
