import { Component, ViewChild } from '@angular/core';
import { FirestoreService } from '../../services/firestore.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { Incident } from '../../models/incident';
import { GeolocationService } from '../../services/geolocation.service';
import { switchMap, map } from 'rxjs/operators';
import * as _ from 'lodash';
import * as moment from 'moment';
import { IncidentViewModel } from 'src/app/models/incident-view-model';
import { PowerStatus } from 'src/app/types/power-status';
import { MapComponent } from '../../components/map/map.component';
import { IncidentColorizerService } from 'src/app/services/incident-colorizer.service';
import { PopupController } from 'src/app/services/popup-controller.service';
import { AddIncidentPopupComponent } from 'src/app/components/add-incident-popup/add-incident-popup.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {
  geolocateZoom = 18;

  newIncidentDateTime: string;
  newIncidentStatus: PowerStatus;

  incidents$ = new Observable<IncidentViewModel[]>();

  activeIncidentIdSubject = new BehaviorSubject<string>(null);
  activeIncident$ = this.activeIncidentIdSubject.pipe(
    switchMap((id) =>
      this.incidents$.pipe(
        map((incidents) => incidents.find((i) => i.id === id))
      )
    )
  );

  get geolocationAvailable() {
    return this.geolocationService.geolocationAvailable();
  }

  set activeIncidentId(id: string) {
    this.activeIncidentIdSubject.next(id);
  }

  @ViewChild(MapComponent) mapComponent: MapComponent;

  constructor(
    private fireStoreService: FirestoreService,
    private geolocationService: GeolocationService,
    private incidentColorizer: IncidentColorizerService,
    private popupController: PopupController
  ) {
    this.incidents$ = this.fireStoreService
      .getRecentIncidents()
      .pipe(
        map((incidents) =>
          _.map(incidents, (incident) => this.createIncidentViewModel(incident))
        )
      );
  }

  createIncidentViewModel(incident: Incident): IncidentViewModel {
    const age = moment().diff(moment(incident.reportedAt), 'minutes'); // TODO change to hours or something else
    const iconFillColor = this.incidentColorizer.getColor(incident.status, age);
    return { ...incident, age, iconFillColor };
  }

  async onDeleteAllIncidentsRequested(incidents: IncidentViewModel[]) {
    await this.deleteAllIncidents(incidents);
  }

  onMapClicked() {
    this.clearActiveIncident();
  }

  onIncidentClicked(incident: IncidentViewModel) {
    this.activeIncidentId = incident.id;
  }

  async onActivePopupDeleteClicked(id: string) {
    await this.fireStoreService.deleteIncident(id);
  }

  onActivePopupCloseClicked() {
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

  async onAddIncidentClicked(status: PowerStatus) {
    this.clearActiveIncident();
    this.newIncidentDateTime = new Date().toISOString();
    this.newIncidentStatus = status;
    this.popupController.create({
      component: AddIncidentPopupComponent,
    });
  }

  onIncidentAdded() {
    this.mapComponent.centerIndicatorVisible = false;
  }

  async onGeolocationClicked() {
    if (this.geolocationService.geolocationAvailable()) {
      const coords = await this.geolocationService.getUserLocation();
      this.mapComponent.animateTo(coords, this.geolocateZoom);
    }
  }
}
