import {
  Directive,
  Output,
  EventEmitter,
  NgZone,
  OnInit,
  Input,
} from '@angular/core';
import { MapsAPILoader, AgmMap } from '@agm/core';
import { IonSearchbar } from '@ionic/angular';
import { first } from 'rxjs/operators';

// based on https://github.com/SebastianM/angular-google-maps/issues/467#issuecomment-342562167
// adapted for ionic search bar
@Directive({
  selector: '[appGoogleAddressSearch]',
})
export class AppGoogleAddressSearchDirective implements OnInit {
  private autocomplete: google.maps.places.Autocomplete;

  @Input()
  agmMap: AgmMap = null;

  @Output() placeChanged = new EventEmitter<google.maps.places.PlaceResult>();

  constructor(
    private ionSearchBar: IonSearchbar,
    private ngZone: NgZone,
    private mapsAPILoader: MapsAPILoader
  ) {}

  ngOnInit() {
    this.ionSearchBar.getInputElement().then((inputElement) =>
      this.mapsAPILoader.load().then(() => {
        this.autocomplete = new google.maps.places.Autocomplete(inputElement);

        this.autocomplete.addListener('place_changed', () => {
          this.ngZone.run(() => {
            const place: google.maps.places.PlaceResult = this.autocomplete.getPlace();
            this.placeChanged.emit(place);
          });
        });

        this.setupBiasToMapBounds();
      })
    );
  }

  setupBiasToMapBounds() {
    this.agmMap.mapReady
      .pipe(first())
      .subscribe((gMap: google.maps.Map) =>
        this.autocomplete.bindTo('bounds', gMap)
      );
  }
}
