import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';
import { AgmSnazzyInfoWindowModule } from '@agm/snazzy-info-window';
import { SharedModule } from '../../shared/shared.module';
import { HomePageRoutingModule } from './home-routing.module';
import { IncidentAddedPageModule } from '../incident-added/incident-added.module';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    HomePageRoutingModule,
    AgmSnazzyInfoWindowModule,
    SharedModule,
    ComponentsModule,
    IncidentAddedPageModule,
  ],
  declarations: [HomePage],
})
export class HomePageModule {}
