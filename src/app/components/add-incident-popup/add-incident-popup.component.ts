import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FirestoreService } from 'src/app/services/firestore.service';
import { PowerStatus } from 'src/app/types/power-status';
import { IncidentAddedPage } from 'src/app/pages/incident-added/incident-added.page';
import { PopupController } from 'src/app/services/popup-controller.service';

@Component({
  selector: 'app-add-incident-popup',
  templateUrl: './add-incident-popup.component.html',
  styleUrls: ['./add-incident-popup.component.scss'],
})
export class AddIncidentPopupComponent implements OnInit {
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
    private popupController: PopupController,
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

    this.incidentAdded.emit();
    this.popupController.dismiss();
  }

  onAddPopupCancelClicked() {
    this.popupController.dismiss();
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
