import { Component, ViewChild } from '@angular/core';
import { FirestoreService } from '../../services/firestore.service';
import { Observable } from 'rxjs';
import { Incident } from '../../models/incident';
import { GeolocationService } from '../../services/geolocation.service';
import { map } from 'rxjs/operators';
import * as _ from 'lodash';
import * as moment from 'moment';
import { IncidentViewModel } from 'src/app/models/incident-view-model';
import { PowerStatus } from 'src/app/types/power-status';
import { MapComponent } from '../../components/map/map.component';
import { IncidentColorizerService } from 'src/app/services/incident-colorizer.service';
import { NonModalDialogController } from 'src/app/services/non-modal-dialog-controller.service';
import { AddIncidentPopupComponent } from 'src/app/components/add-incident-popup/add-incident-popup.component';
import { ViewIncidentDialogComponent } from 'src/app/components/view-incident-dialog/view-incident-dialog.component';

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

  dialogShowing$ = this.nonModalDialogController.active$.pipe(
    map((active) => (active ? 'true' : 'false')) // for compatibility with *ngIf/async
  );

  get geolocationAvailable() {
    return this.geolocationService.geolocationAvailable();
  }

  @ViewChild(MapComponent) mapComponent: MapComponent;

  constructor(
    private fireStoreService: FirestoreService,
    private geolocationService: GeolocationService,
    private incidentColorizer: IncidentColorizerService,
    private nonModalDialogController: NonModalDialogController
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
    this.nonModalDialogController.dismiss();
  }

  onIncidentClicked(incident: IncidentViewModel) {
    this.nonModalDialogController.create({
      component: ViewIncidentDialogComponent,
    });
  }

  async deleteAllIncidents(incidents: IncidentViewModel[]) {
    this.nonModalDialogController.dismiss();

    const deletions = incidents.map((incident) =>
      this.fireStoreService.deleteIncident(incident.id)
    );
    await Promise.all(deletions);
  }

  async onAddIncidentClicked(status: PowerStatus) {
    this.newIncidentDateTime = new Date().toISOString();
    this.newIncidentStatus = status;
    this.nonModalDialogController.create({
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
