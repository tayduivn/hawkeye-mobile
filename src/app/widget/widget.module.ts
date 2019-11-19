import { ItemByItemDescComponent } from './item-by-item-desc/item-by-item-desc.component';
import { VideotapeComponent } from './videotape/videotape.component';
import { PhotographComponent } from './photograph/photograph.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { SKUInfoComponent } from './sku-info/sku-info.component';
import { DirectiveModule } from '../directives/directive.module';
import { Camera } from '@ionic-native/camera/ngx';
import { MediaCapture } from '@ionic-native/media-capture/ngx';
import { Media } from '@ionic-native/media/ngx';
import { VideoPlayer } from '@ionic-native/video-player/ngx';
import { VideoPlayerDirective } from './video-player.directive';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { Chooser } from '@ionic-native/chooser/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';

@NgModule({
    declarations: [
        SKUInfoComponent,
        PhotographComponent,
        VideotapeComponent,
        VideoPlayerDirective,
        ItemByItemDescComponent,
        VideoPlayerDirective,
    ],
    imports: [CommonModule, IonicModule, DirectiveModule, ReactiveFormsModule, FormsModule, FlexLayoutModule],
    exports: [SKUInfoComponent, PhotographComponent, VideotapeComponent, VideoPlayerDirective, ItemByItemDescComponent],
    providers: [Camera, MediaCapture, Media, VideoPlayer, ImagePicker, FileChooser, Chooser, FilePath],
})
export class WidgetModule {}
