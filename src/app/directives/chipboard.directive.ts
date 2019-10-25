import { PageEffectService } from './../services/page-effect.service';
import { Directive,  HostListener} from '@angular/core';
declare var ClipboardJS: any
@Directive({
  selector: '[Chipboard]'
})

//must be input  " class='chip-text' Chipboard"

export class ChipboardDirective {
  @HostListener('click', ['$event']) onclick(e:any) {
    let _this = this
    const clipText = new ClipboardJS('.chip-text', {
      text: function (trigger: HTMLElement) {
        return trigger.innerText
      }
    })
    clipText.on('success', function (e:any) {
      _this.PageEffectService.showToast({
        message:'复制成功',
        color:'success',
      })
      clipText.destroy()
    })
  }
  constructor(private PageEffectService:PageEffectService) {}
}

