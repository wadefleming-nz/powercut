import {
  Directive,
  Output,
  EventEmitter,
  ElementRef,
  NgZone,
} from '@angular/core';
import { MapsAPILoader } from '@agm/core';

// based on https://github.com/SebastianM/angular-google-maps/issues/467#issuecomment-342562167
@Directive({
  selector: '[appGoogleAddressSearch]',
})
export class AppGoogleAddressSearchDirective {
  @Output() placeChanged = new EventEmitter<google.maps.places.PlaceResult>();

  constructor(
    private el: ElementRef,
    private ngZone: NgZone,
    private mapsAPILoader: MapsAPILoader
  ) {
    this.mapsAPILoader.load().then(() => {
      const autocomplete = new google.maps.places.Autocomplete(
        this.el.nativeElement
      );

      autocomplete.addListener('place_changed', () => {
        this.ngZone.run(() => {
          const place: google.maps.places.PlaceResult = autocomplete.getPlace();
          this.placeChanged.emit(place);
        });
      });
    });
  }
}
