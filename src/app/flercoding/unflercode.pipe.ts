import { Pipe, PipeTransform } from '@angular/core';
import { unflercode } from './flercode';
import FlercordLocalStorage from '../LocalStorage/FlercordLocalStorage';

@Pipe({
  name: 'unflercode',
  standalone: true
})
export class UnflercodePipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): unknown {
    if (!FlercordLocalStorage.flercode) return value
    return unflercode(value);
  }

}
