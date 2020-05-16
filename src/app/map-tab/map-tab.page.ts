import { Component } from '@angular/core';
import { MapMarker } from '../models/map-marker';
import { LatLngLiteral } from '@agm/core';
import * as _ from 'lodash';
import { FirestoreService } from '../services/firestore.service';

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

  markers: MapMarker[] = [
    {
      latitude: 51.447468,
      longitude: -0.336917,
      label: 'A',
      info: '5 Albert Road',
    },
    {
      latitude: 51.457359,
      longitude: -0.346917,
      label: 'B',
      info: 'Isleworth',
    },
    {
      latitude: 51.444359,
      longitude: -0.356917,
      label: 'C',
      info: 'Chertsey Road',
    },
  ];

  get draggableCursor() {
    return this.addMarkerMode ? 'crosshair' : '';
  }

  constructor(private fireStoreService: FirestoreService) {}

  addClicked() {
    this.addMarkerMode = !this.addMarkerMode;
  }

  mapClicked(event: { coords: LatLngLiteral }) {
    if (this.addMarkerMode) {
      this.addMarker(event.coords.lat, event.coords.lng);
      this.addMarkerMode = false;
    }
  }

  async addMarker(latitude: number, longitude: number) {
    this.markers.push({
      latitude,
      longitude,
      label: this.getNextLabelLetter(),
      info: 'test',
    });

    await this.fireStoreService.createIncident({
      latitude,
      longitude,
      reportedAt: new Date(),
    });
  }

  getNextLabelLetter() {
    const lastLetter = _.last(this.markers)?.label;
    const nextLetter =
      !lastLetter || lastLetter === 'Z' ? 'A' : this.nextLetter(lastLetter);
    return nextLetter;
  }

  nextLetter(letter: string) {
    return String.fromCharCode(letter.charCodeAt(0) + 1);
  }
}
