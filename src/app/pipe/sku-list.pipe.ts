import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'skuList',
})
export class SkuListPipe implements PipeTransform {
    transform(value: any, ...args: any[]): any {
        if (!value) return;
        let some = [];
        value.forEach(element => {
            some = some.concat(element.contract.sku_lists);
        });
        return some;
    }
}
