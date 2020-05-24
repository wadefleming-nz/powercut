import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppGoogleAddressSearchDirective } from './google-address-search.directive';

@NgModule({
  declarations: [AppGoogleAddressSearchDirective],
  imports: [CommonModule],
  exports: [AppGoogleAddressSearchDirective],
})
export class GoogleAddressSearchModule {}
