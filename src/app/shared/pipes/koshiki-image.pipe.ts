import { Pipe, PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment';

@Pipe({
  name: 'koshikiImage'
})
export class KoshikiImagePipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    return environment.domain + value;
  }

}
