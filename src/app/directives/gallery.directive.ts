import { Directive, ElementRef, OnDestroy, HostListener, Input } from '@angular/core';
declare var Viewer: any; // 2. 消除 tsc 编译器报错

@Directive({
    selector: '[imgGallery]',
})
export class GalleryDirective implements OnDestroy {
    viewer: any;

    _url: string = '';
    @Input() set url(Input: string) {
        if (!!Input) {
            if (Input.indexOf('_compress') != -1) {
                this._url =
                    Input.substr(0, Input.lastIndexOf('_')) + Input.substr(Input.lastIndexOf('.'), Input.length);
            }
        }
    }
    @HostListener('click') onclick() {
        this.viewer.update();
    }

    constructor(private el: ElementRef) {
        this.viewer = new Viewer(this.el.nativeElement, {
            inline: false,
            toolbar: false,
            url(image) {
                if (image.src.indexOf('_compress') != -1) {
                    return (
                        image.src.substr(0, image.src.lastIndexOf('_')) +
                        image.src.substr(image.src.lastIndexOf('.'), image.src.length)
                    );
                } else return image.src;
            },
        });
    }

    ngOnDestroy(): void {
        //销毁viewer
        this.viewer && this.viewer.destroy();
    }
}
