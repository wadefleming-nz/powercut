import { Component, ChangeDetectorRef } from '@angular/core';
import { FirestoreService } from '../services/firestore.service';
import { Observable } from 'rxjs';
import { Incident } from '../models/incident';
import * as firebase from 'firebase/app';
import { GeolocationService } from '../services/geolocation.service';
import { LatLngLiteral } from '@agm/core';

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

  centerIndicatorVisible = true;

  incidents$: Observable<Incident[]>;
  activeIncident: Incident = null;

  get geolocationAvailable() {
    return this.geolocationService.geolocationAvailable();
  }

  constructor(
    private fireStoreService: FirestoreService,
    protected geolocationService: GeolocationService,
    private changeDetector: ChangeDetectorRef
  ) {
    this.incidents$ = this.fireStoreService.getAllIncidents();
  }

  centerChanged(coords: LatLngLiteral) {
    this.centerLatitude = coords.lat;
    this.centerLongitude = coords.lng;

    this.centerIndicatorVisible = true;
  }

  trackByIncidentId(_: number, incident: Incident) {
    return incident.id;
  }

  mapClicked() {
    this.activeIncident = null;
  }

  async addClicked() {
    await this.addIncident();
  }

  async deleteClicked(incidents: Incident[]) {
    await this.deleteAllIncidents(incidents);
  }

  incidentClicked(incident: Incident) {
    this.activeIncident = incident;
  }

  async deleteAllIncidents(incidents: Incident[]) {
    const deletions = incidents.map((incident) =>
      this.fireStoreService.deleteIncident(incident.id)
    );
    await Promise.all(deletions);
  }

  async addIncident() {
    this.centerIndicatorVisible = false;

    await this.fireStoreService.createIncident({
      latitude: this.centerLatitude,
      longitude: this.centerLongitude,
      reportedAt: firebase.firestore.Timestamp.fromDate(new Date()),
    });
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
