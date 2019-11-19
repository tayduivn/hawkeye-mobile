import { Pipe, PipeTransform } from '@angular/core';
import { project } from '../services/task.service';

@Pipe({
    name: 'inspectionObj',
})
export class inspectionObjPipe implements PipeTransform {
    transform(value: project, args?: any): project {
        let some: project = JSON.parse(JSON.stringify(value));
        for (let key in some.sku_sys) {
            some.sku_sys[key] = '';
        }
        some = this.sku_other_set_passed(some);
        some = this.sku_other_set_remark(some);
        return some;
    }

    sku_other_set_passed(project: project): project {
        //默认设置为通过
        let some: project = JSON.parse(JSON.stringify(project));

        for (let key in some.sku_other) {
            some.sku_other[key].is_standard = 1;
        }

        return some;
    }

    sku_other_set_remark(project: project): project {
        let some: project = JSON.parse(JSON.stringify(project));

        for (let key in some.sku_other) {
            some.sku_other[key].remark = some.sku_other[key].InspectionRequiremen;
        }

        return some;
    }
}
