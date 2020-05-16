import { Component } from '@angular/core';
import { LatLngLiteral } from '@agm/core';
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
  addingIncident = false;
  incidents$: Observable<Incident[]>;

  get draggableCursor() {
    return this.addingIncident ? 'crosshair' : '';
  }

  constructor(private fireStoreService: FirestoreService) {
    this.incidents$ = this.fireStoreService.getAllIncidents();
  }

  addClicked() {
    this.addingIncident = !this.addingIncident;
  }

  async deleteClicked(incidents: Incident[]) {
    this.deleteAllIncidents(incidents);
  }

  async deleteAllIncidents(incidents: Incident[]) {
    const deletions = incidents.map((incident) =>
      this.fireStoreService.deleteIncident(incident.id)
    );
    await Promise.all(deletions);
  }

  mapClicked(event: { coords: LatLngLiteral }) {
    if (this.addingIncident) {
      this.addIncident(event.coords.lat, event.coords.lng);
      this.addingIncident = false;
    }
  }

  async addIncident(latitude: number, longitude: number) {
    await this.fireStoreService.createIncident({
      latitude,
      longitude,
      reportedAt: new Date(),
    });
  }
}
