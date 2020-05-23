import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-incident-added',
  templateUrl: './incident-added.page.html',
  styleUrls: ['./incident-added.page.scss'],
})
export class IncidentAddedPage {
  twitterShareUrl = `https://twitter.com/intent/tweet?url=${environment.appUrl}&via=${environment.twitterHandle}&text=${environment.twitterShareMessage}`;

  constructor(public modalController: ModalController) {}

  shareToFacebookClicked() {}

  shareToTwitterClicked() {
    window.open(encodeURI(this.twitterShareUrl), 'twitter');
  }

  dismissModal() {
    this.modalController.dismiss();
  }
}
