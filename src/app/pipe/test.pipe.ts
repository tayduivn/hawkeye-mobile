import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'test',
})
export class TestPipe implements PipeTransform {
    transform(value: any, ...args: any[]): any {
        console.log(value);
        return value;
    }
}
