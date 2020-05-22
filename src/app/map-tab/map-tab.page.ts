import { Component, ChangeDetectorRef } from '@angular/core';
import { FirestoreService } from '../services/firestore.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { Incident } from '../models/incident';
import { GeolocationService } from '../services/geolocation.service';
import { LatLngLiteral, ControlPosition } from '@agm/core';
import { switchMap, map } from 'rxjs/operators';
import * as _ from 'lodash';
import { GoogleSymbol } from '@agm/core/services/google-maps-types';
import { Point } from '../models/point';
import { CacheService } from '../services/cache.service';
import * as moment from 'moment';

@Component({
  selector: 'app-map-tab',
  templateUrl: './map-tab.page.html',
  styleUrls: ['./map-tab.page.scss'],
})
export class MapTabPage {
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
    fillColor: '#FF0000',
    fillOpacity: 1.0,
    strokeColor: '#000000',
    strokeWeight: 1,
    scale: 2,
    anchor: new Point(10, 22),
  };

  newIncidentDateTime: string;

  incidents$ = new Observable<Incident[]>();

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
    protected geolocationService: GeolocationService,
    private changeDetector: ChangeDetectorRef,
    protected iconCache: CacheService<GoogleSymbol>
  ) {
    this.incidents$ = this.fireStoreService.getAllIncidents();
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

  trackByIncidentId(_: number, incident: Incident) {
    return incident.id;
  }

  getIncidentIcon(incident: Incident) {
    let icon = this.iconCache.getValue(incident.id);
    if (!icon) {
      icon = { ...this.icon, fillOpacity: this.getOpacityBasedOnAge(incident) };
      this.iconCache.setValue(incident.id, icon);
    }

    return icon;
  }

  getOpacityBasedOnAge(incident: Incident) {
    const now = moment();
    const reportedAt = moment(incident.reportedAt);
    const age = now.diff(reportedAt, 'minutes'); // TODO change to hours or something else
    const normalized = this.normalize(age, 0, 60);
    const opacity = 1 - normalized;
    return _.round(opacity, 1);
  }

  mapClicked() {
    this.clearActiveIncident();
  }

  async addClicked() {
    await this.addIncident();
  }

  async deleteClicked(incidents: Incident[]) {
    await this.deleteAllIncidents(incidents);
  }

  incidentClicked(incident: Incident) {
    this.activeIncidentId = incident.id;
  }

  showAddIncidentPopup() {
    this.showAddIncidentPopupSubject.next(true);
  }

  hideAddIncidentPopup() {
    this.showAddIncidentPopupSubject.next(false);
  }

  async addPopupAddClicked() {
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

  async deleteAllIncidents(incidents: Incident[]) {
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
