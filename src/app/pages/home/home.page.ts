import { Component, ViewChild } from '@angular/core';
import { FirestoreService } from '../../services/firestore.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { Incident } from '../../models/incident';
import { GeolocationService } from '../../services/geolocation.service';
import { switchMap, map } from 'rxjs/operators';
import * as _ from 'lodash';
import * as moment from 'moment';
import { ModalController } from '@ionic/angular';
import { roundToWhole } from 'src/app/shared/utilities/round-to-whole';
import { transformBetweenRanges } from 'src/app/shared/utilities/transform-between-ranges';
import { IncidentViewModel } from 'src/app/models/incident-view-model';
import { IncidentAddedPage } from '../incident-added/incident-added.page';
import { PowerStatus } from 'src/app/types/power-status';
import { IncidentColorDefinition } from 'src/app/models/incident-color-definition';
import { EnumDictionary } from 'src/app/types/enum-dictionary';
import { MapComponent } from './map/map.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {
  geolocateZoom = 20;

  incidentColorDefinitions: EnumDictionary<
    PowerStatus,
    IncidentColorDefinition
  > = {
    [PowerStatus.On]: {
      // green
      hue: 130,
      saturation: 55,
      lightnessRange: { darkest: 50, lightest: 90 },
    },
    [PowerStatus.Off]: {
      // red
      hue: 0,
      saturation: 100,
      lightnessRange: { darkest: 55, lightest: 95 },
    },
  };

  incidentTypes: EnumDictionary<PowerStatus, string> = {
    [PowerStatus.On]: 'Power restored',
    [PowerStatus.Off]: 'Power outage',
  };

  minAge = 0;
  maxAge = 60;

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

  @ViewChild(MapComponent) mapComponent: MapComponent;

  constructor(
    private fireStoreService: FirestoreService,
    private geolocationService: GeolocationService,
    public modalController: ModalController
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
    const iconFillColor = this.getIconFillColor(incident.status, age);
    return { ...incident, age, iconFillColor };
  }

  getIncidentType(status: PowerStatus): string {
    return this.incidentTypes[status];
  }

  getIconFillColor(status: PowerStatus, age: number) {
    const colorDef = this.incidentColorDefinitions[status];
    const lightness = this.getLightnessPercentBasedOnAge(
      age,
      colorDef.lightnessRange
    );
    return `hsl(${colorDef.hue}, ${colorDef.saturation}%, ${lightness}%)`;
  }

  getLightnessPercentBasedOnAge(
    age: number,
    range: { darkest: number; lightest: number }
  ) {
    const { darkest, lightest } = range;
    const lightness = transformBetweenRanges(
      age,
      { min: this.minAge, max: this.maxAge },
      { min: darkest, max: lightest }
    );
    return _.clamp(roundToWhole(lightness, 5), darkest, lightest);
  }

  async deleteClicked(incidents: IncidentViewModel[]) {
    await this.deleteAllIncidents(incidents);
  }

  onMapClicked() {
    this.clearActiveIncident();
  }

  incidentClicked(incident: IncidentViewModel) {
    this.activeIncidentId = incident.id;
  }

  addReportOnClicked() {
    setTimeout(() => this.addIncident(PowerStatus.On), 0); // setTimeout so that fab list collapses immediately
  }

  addReportOffClicked() {
    setTimeout(() => this.addIncident(PowerStatus.Off), 0); // setTimeout so that fab list collapses immediately
  }

  showAddIncidentPopup() {
    this.showAddIncidentPopupSubject.next(true);
  }

  hideAddIncidentPopup() {
    this.showAddIncidentPopupSubject.next(false);
  }

  async addPopupAddClicked() {
    // TODO
    // await this.presentIncidentAddedModal();
    // const id = await this.fireStoreService.createIncident({
    //   status: this.newIncidentStatus,
    //   latitude: this.centerLatitude,
    //   longitude: this.centerLongitude,
    //   reportedAt: this.newIncidentDateTime,
    // });
    // this.hideAddIncidentPopup();
    // this.centerIndicatorVisible = false;
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

  async addIncident(status: PowerStatus) {
    this.clearActiveIncident();
    this.newIncidentDateTime = new Date().toISOString();
    this.newIncidentStatus = status;
    this.showAddIncidentPopup();
  }

  async presentIncidentAddedModal() {
    const modal = await this.modalController.create({
      component: IncidentAddedPage,
      swipeToClose: true,
      cssClass: 'modal-partial-screen',
      // componentProps: { incident: this.activeIncident$ },
    });
    return await modal.present();
  }

  async geolocationClicked() {
    if (this.geolocationService.geolocationAvailable()) {
      const coords = await this.geolocationService.getUserLocation();
      this.mapComponent.animateTo(coords, this.geolocateZoom);
    }
  }
}
