import {
  Directive,
  Output,
  EventEmitter,
  NgZone,
  OnInit,
  Input,
  OnDestroy,
} from '@angular/core';
import { MapsAPILoader, AgmMap } from '@agm/core';
import { IonSearchbar } from '@ionic/angular';
import { first } from 'rxjs/operators';
import { Subscription } from 'rxjs';

// based on https://github.com/SebastianM/angular-google-maps/issues/467#issuecomment-342562167
// adapted for ionic search bar
@Directive({
  selector: '[appGoogleAddressSearch]',
})
export class AppGoogleAddressSearchDirective implements OnInit, OnDestroy {
  private subscription = new Subscription();
  private autocomplete: google.maps.places.Autocomplete;
  private options: google.maps.places.AutocompleteOptions = {
    fields: ['geometry.location'],
  };

  @Input()
  agmMap: AgmMap = null;

  @Output() placeChanged = new EventEmitter<google.maps.places.PlaceResult>();

  constructor(
    private ionSearchBar: IonSearchbar,
    private ngZone: NgZone,
    private mapsAPILoader: MapsAPILoader
  ) {}

  ngOnInit() {
    this.ionSearchBar.getInputElement().then((inputElement) => {
      this.mapsAPILoader.load().then(() => {
        this.createAutoCompleteWidget(inputElement);
        this.setupPlaceChangedEvent();
        this.setupClearSuggestionsWhenSearchCleared(inputElement);
        this.setupBiasToMapBounds();
      });
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private createAutoCompleteWidget(inputElement: HTMLInputElement) {
    this.autocomplete = new google.maps.places.Autocomplete(
      inputElement,
      this.options
    );
  }

  private setupPlaceChangedEvent() {
    this.autocomplete.addListener('place_changed', () => {
      this.ngZone.run(() => {
        const place: google.maps.places.PlaceResult = this.autocomplete.getPlace();
        this.placeChanged.emit(place);
      });
    });
  }

  private setupClearSuggestionsWhenSearchCleared(
    inputElement: HTMLInputElement
  ) {
    this.subscription.add(
      this.ionSearchBar.ionClear.subscribe(() =>
        this.hackToClearSuggestions(inputElement)
      )
    );
  }

  private hackToClearSuggestions(inputElement: HTMLInputElement) {
    inputElement.blur();
    setTimeout(() => inputElement.focus(), 100);
  }

  private setupBiasToMapBounds() {
    if (this.agmMap) {
      // TODO leave this check or not?
      this.agmMap.mapReady
        .pipe(first())
        .subscribe((gMap: google.maps.Map) =>
          this.autocomplete.bindTo('bounds', gMap)
        );
    }
  }
}
