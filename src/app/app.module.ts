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
import { SecureStorage, SecureStorageObject } from '@ionic-native/secure-storage/ngx';
import { QueueComponent } from './pages/implement-inspection/queue/queue.component';

@NgModule({
    declarations: [
        AppComponent,
        InspectSettingBoxComponent,
        ScanComponent,
        PartsComponent,
        VideoPlayComponent,
        DescriptionComponent,
        QueueComponent
    ],
    entryComponents: [
        InspectSettingBoxComponent,
        ScanComponent,
        PartsComponent,
        VideoPlayComponent,
        DescriptionComponent,
        QueueComponent
    ],
    imports: [
        BrowserModule,
        IonicModule.forRoot(),
        AppRoutingModule,
        FormsModule,
        BrowserAnimationsModule,
        HttpClientModule,
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
        SecureStorage
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
