import { Component, Input } from '@angular/core';
import { NonModalController } from 'src/app/services/non-modal-controller.service';
import { PowerStatus } from 'src/app/types/power-status';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-view-incident-dialog',
  templateUrl: './view-incident-dialog.component.html',
  styleUrls: ['./view-incident-dialog.component.scss'],
})
export class ViewIncidentDialogComponent {
  // TODO: pass entire incident?
  @Input()
  incidentId: string;

  @Input()
  status: PowerStatus;

  @Input()
  reportedAtDateTime: string;

  constructor(
    private nonModalController: NonModalController,
    private fireStoreService: FirestoreService
  ) {}

  async onDeleteClicked() {
    await this.fireStoreService.deleteIncident(this.incidentId);
    this.nonModalController.dismiss();
  }

  onCloseClicked() {
    this.nonModalController.dismiss();
  }
}
