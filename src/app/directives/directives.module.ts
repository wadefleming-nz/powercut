import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppGoogleAddressSearchDirective } from './google-address-search/google-address-search.directive';

const directives = [AppGoogleAddressSearchDirective];

@NgModule({
  declarations: directives,
  imports: [CommonModule],
  exports: directives,
})
export class DirectivesModule {}
