import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GalleryDirective } from './gallery.directive';
import { ChipboardDirective } from './chipboard.directive';

@NgModule({
    declarations: [GalleryDirective, ChipboardDirective],
    imports: [CommonModule],
    exports: [GalleryDirective, ChipboardDirective],
})
export class DirectiveModule {}
