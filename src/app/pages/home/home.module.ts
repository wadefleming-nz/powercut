import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';
import { ExploreContainerComponentModule } from '../../explore-container/explore-container.module';
import { AgmCoreModule } from '@agm/core';
import { AgmSnazzyInfoWindowModule } from '@agm/snazzy-info-window';
import { environment } from '../../../environments/environment';
import { SharedModule } from '../../shared/shared.module';
import { HomePageRoutingModule } from './home-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    HomePageRoutingModule,
    ExploreContainerComponentModule,
    AgmCoreModule.forRoot({
      apiKey: environment.googleApiKey,
    }),
    AgmSnazzyInfoWindowModule,
    SharedModule,
  ],
  declarations: [HomePage],
})
export class HomePageModule {}
