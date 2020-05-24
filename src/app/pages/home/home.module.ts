import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';
import { AgmCoreModule } from '@agm/core';
import { AgmSnazzyInfoWindowModule } from '@agm/snazzy-info-window';
import { environment } from '../../../environments/environment';
import { SharedModule } from '../../shared/shared.module';
import { HomePageRoutingModule } from './home-routing.module';
import { IncidentAddedPageModule } from '../incident-added/incident-added.module';
import { GoogleAddressSearchModule } from 'src/app/google-address-search/google-address-search.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    HomePageRoutingModule,
    AgmCoreModule.forRoot({
      apiKey: environment.googleApiKey,
      libraries: ['places'],
    }),
    AgmSnazzyInfoWindowModule,
    SharedModule,
    IncidentAddedPageModule,
    GoogleAddressSearchModule,
  ],
  declarations: [HomePage],
})
export class HomePageModule {}
