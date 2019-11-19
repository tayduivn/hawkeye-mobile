import { Directive, ElementRef, OnDestroy, HostListener } from '@angular/core';
declare var Viewer: any; // 2. 消除 tsc 编译器报错

@Directive({
    selector: '[imgGallery]',
})
export class GalleryDirective implements OnDestroy {
    viewer: any;
    @HostListener('click') onclick() {
        this.viewer.update();
    }

    constructor(private el: ElementRef) {
        this.viewer = new Viewer(this.el.nativeElement, {
            inline: false,
            toolbar: false,
        });
    }

    ngOnDestroy(): void {
        //销毁viewer
        this.viewer && this.viewer.destroy();
    }
}
