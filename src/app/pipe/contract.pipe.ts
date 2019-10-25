import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'contract'
})
export class ContractPipe implements PipeTransform {

  transform(value: any,factory:string): any {
    if (!value) return
    let some = []
    value.forEach(element => {
      if(element.factory_code == factory){
        some = element.sku_data
      }
    });
    return some
  }

}
