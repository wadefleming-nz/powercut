import { NgModule } from '@angular/core';
import { FormatIsoDatePipe } from './pipes/format-iso-date.pipe';

@NgModule({
  declarations: [FormatIsoDatePipe],
  exports: [FormatIsoDatePipe],
})
export class SharedModule {}
