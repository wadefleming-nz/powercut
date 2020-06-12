import { Component, Input } from '@angular/core';
import { NonModalController } from 'src/app/services/non-modal-controller.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { IncidentViewModel } from 'src/app/models/incident-view-model';

@Component({
  selector: 'app-view-incident-dialog',
  templateUrl: './view-incident-dialog.component.html',
  styleUrls: ['./view-incident-dialog.component.scss'],
})
export class ViewIncidentDialogComponent {
  @Input()
  incident: IncidentViewModel;

  constructor(
    private nonModalController: NonModalController,
    private fireStoreService: FirestoreService
  ) {}

  async onDeleteClicked() {
    await this.fireStoreService.deleteIncident(this.incident.id);
    this.nonModalController.dismiss();
  }

  onCloseClicked() {
    this.nonModalController.dismiss();
  }
}
