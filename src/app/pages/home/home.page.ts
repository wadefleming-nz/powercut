import { Component, ChangeDetectorRef } from '@angular/core';
import { FirestoreService } from '../../services/firestore.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { Incident } from '../../models/incident';
import { GeolocationService } from '../../services/geolocation.service';
import { LatLngLiteral, ControlPosition } from '@agm/core';
import { switchMap, map } from 'rxjs/operators';
import * as _ from 'lodash';
import { GoogleSymbol } from '@agm/core/services/google-maps-types';
import { Point } from '../../models/point';
import { CacheService } from '../../services/cache.service';
import * as moment from 'moment';
import { Platform, ModalController } from '@ionic/angular';
import { roundToWhole } from 'src/app/shared/utilities/round-to-whole';
import { transformBetweenRanges } from 'src/app/shared/utilities/transform-between-ranges';
import { IncidentViewModel } from 'src/app/models/incident-view-model';
import { IncidentAddedPage } from '../incident-added/incident-added.page';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {
  latitude = 51.447359;
  longitude = -0.336917;

  centerLatitude = this.latitude;
  centerLongitude = this.longitude;

  initialZoom = 12;
  geolocateZoom = 20;
  zoom = this.initialZoom;
  zoomControlOptions = { position: ControlPosition.LEFT_TOP };

  centerIndicatorVisible = true;
  centerIndicatorRedisplayDelay = 250;

  lightningPath = 'M7 2v11h3v9l7-12h-4l4-8z';
  icon: GoogleSymbol = {
    path: this.lightningPath,
    fillColor: 'hsl(0, 100%, 50%)',
    fillOpacity: 1.0,
    strokeColor: '#000000',
    strokeWeight: 1,
    scale: 2,
    anchor: new Point(10, 22),
  };

  minAge = 0;
  maxAge = 60;

  newIncidentDateTime: string;

  incidents$ = new Observable<IncidentViewModel[]>();

  activeIncidentIdSubject = new BehaviorSubject<string>(null);
  activeIncident$ = this.activeIncidentIdSubject.pipe(
    switchMap((id) =>
      this.incidents$.pipe(
        map((incidents) => incidents.find((i) => i.id === id))
      )
    )
  );

  showAddIncidentPopupSubject = new BehaviorSubject<boolean>(false);
  showAddIncidentPopup$ = this.showAddIncidentPopupSubject.pipe(
    map((showPopup) => (showPopup ? 'true' : 'false')) // use non-falsy strings for compatibility with *ngIf async
  );

  get geolocationAvailable() {
    return this.geolocationService.geolocationAvailable();
  }

  set activeIncidentId(id: string) {
    this.activeIncidentIdSubject.next(id);
  }

  constructor(
    private fireStoreService: FirestoreService,
    private geolocationService: GeolocationService,
    private changeDetector: ChangeDetectorRef,
    private iconCache: CacheService<GoogleSymbol>,
    public platform: Platform,
    public modalController: ModalController
  ) {
    this.incidents$ = this.fireStoreService
      .getAllIncidents()
      .pipe(
        map((incidents) =>
          _.map(incidents, (incident) => this.createIncidentViewModel(incident))
        )
      );
  }

  centerChanged(coords: LatLngLiteral) {
    this.centerLatitude = coords.lat;
    this.centerLongitude = coords.lng;

    this.redisplayCenterIndicator();
  }

  redisplayCenterIndicator() {
    if (!this.centerIndicatorVisible) {
      setTimeout(
        () => (this.centerIndicatorVisible = true),
        this.centerIndicatorRedisplayDelay
      );
    }
  }

  createIncidentViewModel(incident: Incident): IncidentViewModel {
    const age = moment().diff(moment(incident.reportedAt), 'minutes'); // TODO change to hours or something else
    const iconLightness = this.getLightnessPercentBasedOnAge(age);
    return { ...incident, age, iconLightness };
  }

  trackByIncidentId(_: number, incident: IncidentViewModel) {
    return incident.id;
  }

  // newer markers should appear higher
  getIncidentZIndex(incident: IncidentViewModel) {
    return this.maxAge - incident.age;
  }

  getIncidentIcon(incident: IncidentViewModel) {
    return this.iconCache.getOrCreate(incident.iconLightness, {
      ...this.icon,
      fillColor: `hsl(0, 100%, ${incident.iconLightness}%)`,
    });
  }

  getLightnessPercentBasedOnAge(age: number) {
    const [darkest, lightest] = [50, 90];

    const lightness = transformBetweenRanges(
      age,
      { min: this.minAge, max: this.maxAge },
      { min: darkest, max: lightest }
    );
    return _.clamp(roundToWhole(lightness, 10), darkest, lightest);
  }

  mapClicked() {
    this.clearActiveIncident();
  }

  async addClicked() {
    await this.addIncident();
  }

  async deleteClicked(incidents: IncidentViewModel[]) {
    await this.deleteAllIncidents(incidents);
  }

  incidentClicked(incident: IncidentViewModel) {
    this.activeIncidentId = incident.id;
  }

  showAddIncidentPopup() {
    this.showAddIncidentPopupSubject.next(true);
  }

  hideAddIncidentPopup() {
    this.showAddIncidentPopupSubject.next(false);
  }

  async addPopupAddClicked() {
    await this.presentIncidentAddedModal();

    const id = await this.fireStoreService.createIncident({
      latitude: this.centerLatitude,
      longitude: this.centerLongitude,
      reportedAt: this.newIncidentDateTime,
    });

    this.hideAddIncidentPopup();
    this.activeIncidentId = id;
    this.centerIndicatorVisible = false;
  }

  addPopupCancelClicked() {
    this.hideAddIncidentPopup();
  }

  async activePopupDeleteClicked(id: string) {
    await this.fireStoreService.deleteIncident(id);
  }

  activePopupCloseClicked() {
    this.clearActiveIncident();
  }

  clearActiveIncident() {
    this.activeIncidentId = null;
  }

  async deleteAllIncidents(incidents: IncidentViewModel[]) {
    this.clearActiveIncident();

    const deletions = incidents.map((incident) =>
      this.fireStoreService.deleteIncident(incident.id)
    );
    await Promise.all(deletions);
  }

  async addIncident() {
    this.clearActiveIncident();
    this.newIncidentDateTime = new Date().toISOString();
    this.showAddIncidentPopup();
  }

  async presentIncidentAddedModal() {
    const modal = await this.modalController.create({
      component: IncidentAddedPage,
      swipeToClose: true,
      //cssClass: 'my-custom-class',
      // componentProps: { incident: this.activeIncident$ },
    });
    return await modal.present();
  }

  async geolocationClicked() {
    if (this.geolocationService.geolocationAvailable()) {
      const coords = await this.geolocationService.getUserLocation();
      this.animateTo(coords, this.geolocateZoom);
    }
  }

  animateTo(coords: { latitude: number; longitude: number }, zoom?: number) {
    this.hackToFixAnimation(zoom);

    this.latitude = coords.latitude;
    this.longitude = coords.longitude;
    if (zoom) {
      this.zoom = zoom;
    }
  }

  // https://github.com/SebastianM/angular-google-maps/issues/1026#issuecomment-569965653
  hackToFixAnimation(zoom?: number) {
    this.latitude = 0;
    this.longitude = 0;
    if (zoom) {
      this.zoom = 0;
    }
    this.changeDetector.detectChanges();
  }
}
