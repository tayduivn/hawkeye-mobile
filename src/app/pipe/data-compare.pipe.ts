import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'dataCompare',
})
export class DataComparePipe implements PipeTransform {
    transform(value: any[], apply_no?: number, contract_id?: number): any {
        let rVal: any[] = [],
            factories: any[] = value;
        if (apply_no) {
            factories = factories.filter(res => res.apply_inspection_no == apply_no);
        }
        factories.forEach(res => {
            res.contract_data.forEach(element => {
                element.sku && element.sku.length && (rVal = rVal.concat(element.sku));
            });
        });
        return rVal;
    }
}
