import { Pipe, PipeTransform } from '@angular/core';
import { InspectGroup } from '../services/inspection.service';

@Pipe({
  name: 'showFactory'
})
export class ShowFactoryPipe implements PipeTransform {

  transform(value: InspectGroup, ...args: any[]): any {
    let rval:string = ''
    value.info.forEach(factory => rval += factory.factory_name + '、')
    return rval;
  }

}
