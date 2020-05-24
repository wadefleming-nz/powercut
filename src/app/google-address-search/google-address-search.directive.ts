import { Directive, Output, EventEmitter, NgZone } from '@angular/core';
import { MapsAPILoader } from '@agm/core';
import { IonSearchbar } from '@ionic/angular';

// based on https://github.com/SebastianM/angular-google-maps/issues/467#issuecomment-342562167
// adapted for ionic search bar
@Directive({
  selector: '[appGoogleAddressSearch]',
})
export class AppGoogleAddressSearchDirective {
  @Output() placeChanged = new EventEmitter<google.maps.places.PlaceResult>();

  constructor(
    ionSearchBar: IonSearchbar,
    ngZone: NgZone,
    mapsAPILoader: MapsAPILoader
  ) {
    ionSearchBar.getInputElement().then((inputElement) =>
      mapsAPILoader.load().then(() => {
        const autocomplete = new google.maps.places.Autocomplete(inputElement);

        autocomplete.addListener('place_changed', () => {
          ngZone.run(() => {
            const place: google.maps.places.PlaceResult = autocomplete.getPlace();
            this.placeChanged.emit(place);
          });
        });
      })
    );
  }
}
