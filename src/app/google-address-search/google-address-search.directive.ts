import { Directive, Output, EventEmitter, NgZone, OnInit } from '@angular/core';
import { MapsAPILoader } from '@agm/core';
import { IonSearchbar } from '@ionic/angular';

// based on https://github.com/SebastianM/angular-google-maps/issues/467#issuecomment-342562167
// adapted for ionic search bar
@Directive({
  selector: '[appGoogleAddressSearch]',
})
export class AppGoogleAddressSearchDirective implements OnInit {
  @Output() placeChanged = new EventEmitter<google.maps.places.PlaceResult>();

  constructor(
    private ionSearchBar: IonSearchbar,
    private ngZone: NgZone,
    private mapsAPILoader: MapsAPILoader
  ) {}

  ngOnInit() {
    this.ionSearchBar.getInputElement().then((inputElement) =>
      this.mapsAPILoader.load().then(() => {
        const autocomplete = new google.maps.places.Autocomplete(inputElement);

        autocomplete.addListener('place_changed', () => {
          this.ngZone.run(() => {
            const place: google.maps.places.PlaceResult = autocomplete.getPlace();
            this.placeChanged.emit(place);
          });
        });
      })
    );
  }
}
