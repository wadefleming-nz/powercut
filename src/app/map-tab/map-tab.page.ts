import { Component } from '@angular/core';
import { LatLngLiteral } from '@agm/core';
import * as _ from 'lodash';
import { FirestoreService } from '../services/firestore.service';
import { Observable } from 'rxjs';
import { Incident } from '../models/incident';

@Component({
  selector: 'app-map-tab',
  templateUrl: './map-tab.page.html',
  styleUrls: ['./map-tab.page.scss'],
})
export class MapTabPage {
  latitude = 51.447359;
  longitude = -0.336917;
  zoom = 12;
  addMarkerMode = false;
  incidents$: Observable<Incident[]>;

  get draggableCursor() {
    return this.addMarkerMode ? 'crosshair' : '';
  }

  constructor(private fireStoreService: FirestoreService) {
    this.incidents$ = this.fireStoreService.getAllIncidents();
  }

  addClicked() {
    this.addMarkerMode = !this.addMarkerMode;
  }

  deleteClicked() {}

  mapClicked(event: { coords: LatLngLiteral }) {
    if (this.addMarkerMode) {
      this.addMarker(event.coords.lat, event.coords.lng);
      this.addMarkerMode = false;
    }
  }

  async addMarker(latitude: number, longitude: number) {
    await this.fireStoreService.createIncident({
      latitude,
      longitude,
      reportedAt: new Date(),
    });
  }

  nextLetter(letter: string) {
    return String.fromCharCode(letter.charCodeAt(0) + 1);
  }
}
