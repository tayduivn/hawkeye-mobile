import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "accInspObj"
})
export class AccInspObjPipe implements PipeTransform {
  transform(
    value: Array<any>,
    args?: any
  ): Array<any> {
    let some: Array<any> = JSON.parse(JSON.stringify(value));
    some.forEach((element, i) => {
      element.data.forEach((acc, j) => {
        for (let key in acc) {
          if (key == "AccessoryCode" || key == "ProductCode") {
            acc[key] = acc[key];
          } else acc[key] = "";
        }
      });
    });
    return some;
  }
}
