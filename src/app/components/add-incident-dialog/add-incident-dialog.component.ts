import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FirestoreService } from 'src/app/services/firestore.service';
import { PowerStatus } from 'src/app/types/power-status';
import { IncidentAddedPage } from 'src/app/pages/incident-added/incident-added.page';
import { NonModalDialogController } from 'src/app/services/non-modal-dialog-controller.service';

@Component({
  selector: 'app-add-incident-dialog',
  templateUrl: './add-incident-dialog.component.html',
  styleUrls: ['./add-incident-dialog.component.scss'],
})
export class AddIncidentDialogComponent {
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
    private nonModalDialogController: NonModalDialogController,
    private modalController: ModalController,
    private fireStoreService: FirestoreService
  ) {}

  async onAddClicked() {
    await this.presentIncidentAddedModal();
    await this.fireStoreService.createIncident({
      status: this.status,
      latitude: this.latitude,
      longitude: this.longitude,
      reportedAt: this.reportedAtDateTime,
    });

    this.incidentAdded.emit();
    this.nonModalDialogController.dismiss();
  }

  onCancelClicked() {
    this.nonModalDialogController.dismiss();
  }

  private async presentIncidentAddedModal() {
    const modal = await this.modalController.create({
      component: IncidentAddedPage,
      swipeToClose: true,
      cssClass: 'modal-partial-screen',
    });
    return await modal.present();
  }
}
