import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'formatIsoDate',
})
export class FormatIsoDatePipe implements PipeTransform {
  transform(isoDate: string, format: string = 'LL LT'): any {
    return moment(isoDate).format(format);
  }
}
