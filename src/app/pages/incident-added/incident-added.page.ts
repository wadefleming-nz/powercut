import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-incident-added',
  templateUrl: './incident-added.page.html',
  styleUrls: ['./incident-added.page.scss'],
})
export class IncidentAddedPage implements OnInit {
  @Input() modal: HTMLIonModalElement;

  constructor(public modalController: ModalController) {}

  ngOnInit() {}

  dismissModal() {
    this.modalController.dismiss();
  }
}
