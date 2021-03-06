import { VideoPlayComponent } from './widget/video-play/video-play.component';
import { PartsComponent } from './widget/parts/parts.component';
import { QRScanner } from '@ionic-native/qr-scanner/ngx';
import { Camera } from '@ionic-native/camera/ngx';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { DefaultInterceptor } from './services/interceptor';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InspectSettingBoxComponent } from './widget/inspect-setting-box/inspect-setting-box.component';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { ScanComponent } from './widget/scan/scan.component';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { DescriptionComponent } from './widget/description/description.component';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { SecureStorage } from '@ionic-native/secure-storage/ngx';
import { QueueComponent } from './pages/implement-inspection/queue/queue.component';
import { AlertModalComponent } from './pages/arraying-container/done-array-list/alert-modal/alert-modal.component';
import { AlertInstalledModalComponent } from './pages/arraying-container/installed-cabinets/alert-installed-modal/alert-installed-modal.component';
import { AlertStatisticsModalComponent } from './pages/arraying-container/alert-statistics-modal/alert-statistics-modal.component';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { Network } from '@ionic-native/network/ngx';
import { File } from '@ionic-native/file/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { FeedbackComponent } from './pages/rework-inspect/feedback/feedback.component';
import { DirectiveModule } from './directives/directive.module';
import { AlertThisBatchDetailsComponent } from './pages/arraying-container/done-array-list/alert-this-batch-details/alert-this-batch-details.component';
import { DetailsModelComponent } from './pages/arraying-container/installed-cabinets/details-model/details-model.component';
@NgModule({
    declarations: [
        AppComponent,
        InspectSettingBoxComponent,
        ScanComponent,
        PartsComponent,
        VideoPlayComponent,
        DescriptionComponent,
        QueueComponent,
        FeedbackComponent,
        PartsComponent,
        AlertModalComponent,
        AlertInstalledModalComponent,
        AlertStatisticsModalComponent,
        AlertThisBatchDetailsComponent,
        DetailsModelComponent,
    ],
    entryComponents: [
        InspectSettingBoxComponent,
        ScanComponent,
        PartsComponent,
        VideoPlayComponent,
        DescriptionComponent,
        QueueComponent,
        FeedbackComponent,
        PartsComponent,
        AlertModalComponent,
        AlertInstalledModalComponent,
        AlertStatisticsModalComponent,
        AlertThisBatchDetailsComponent,
        DetailsModelComponent
    ],
    imports: [
        BrowserModule,
        IonicModule.forRoot(),
        AppRoutingModule,
        FormsModule,
        BrowserAnimationsModule,
        HttpClientModule,
        DirectiveModule,
    ],
    providers: [
        Camera,
        StatusBar,
        SplashScreen,
        { provide: HTTP_INTERCEPTORS, useClass: DefaultInterceptor, multi: true },
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
        { provide: LocationStrategy, useClass: HashLocationStrategy },
        QRScanner,
        FileTransfer,
        BarcodeScanner,
        SecureStorage,
        BackgroundMode,
        File,
        Network,
        FileOpener,
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
