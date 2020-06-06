import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FirestoreService } from 'src/app/services/firestore.service';
import { PowerStatus } from 'src/app/types/power-status';
import { IncidentAddedPage } from 'src/app/pages/incident-added/incident-added.page';

@Component({
  selector: 'app-add-incident-popup',
  templateUrl: './add-incident-popup.component.html',
  styleUrls: ['./add-incident-popup.component.scss'],
})
export class AddIncidentPopupComponent implements OnInit {
  @Input()
  show = true;

  @Input()
  status: PowerStatus;

  @Input()
  reportedAtDateTime: string;

  // TODO consolidate with longitude?
  @Input()
  latitude: number;

  @Input()
  longitude: number;

  @Output()
  incidentAdded = new EventEmitter();

  constructor(
    private modalController: ModalController,
    private fireStoreService: FirestoreService
  ) {}

  ngOnInit() {}

  async onAddPopupAddClicked() {
    await this.presentIncidentAddedModal();
    await this.fireStoreService.createIncident({
      status: this.status,
      latitude: this.latitude,
      longitude: this.longitude,
      reportedAt: this.reportedAtDateTime,
    });
    //this.hideAddIncidentPopup();
    this.show = false;
    this.incidentAdded.emit();
  }

  onAddPopupCancelClicked() {
    //this.hideAddIncidentPopup();
    this.show = false;
  }

  async presentIncidentAddedModal() {
    const modal = await this.modalController.create({
      component: IncidentAddedPage,
      swipeToClose: true,
      cssClass: 'modal-partial-screen',
    });
    return await modal.present();
  }
}
