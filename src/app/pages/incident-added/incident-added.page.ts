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
  facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${environment.appUrl}&quote=${environment.facebookShareMessage}`;

  constructor(public modalController: ModalController) {}

  shareToFacebookClicked() {
    window.open(encodeURI(this.facebookShareUrl), 'facebook');
    this.modalController.dismiss();
  }

  shareToTwitterClicked() {
    window.open(encodeURI(this.twitterShareUrl), 'twitter');
    this.modalController.dismiss();
  }

  dismissModal() {
    this.modalController.dismiss();
  }
}
