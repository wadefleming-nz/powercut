import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-incident-added',
  templateUrl: './incident-added.page.html',
  styleUrls: ['./incident-added.page.scss'],
})
export class IncidentAddedPage {
  constructor(public modalController: ModalController) {}

  dismissModal() {
    this.modalController.dismiss();
  }
}
