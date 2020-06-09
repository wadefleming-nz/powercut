import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FloatingButtonsComponent } from './floating-buttons/floating-buttons.component';
import { IncidentPopupComponent } from './incident-popup/incident-popup.component';
import { MapComponent } from './map/map.component';
import { AgmCoreModule } from '@agm/core';
import { environment } from '../../environments/environment';
import { CommonModule } from '@angular/common';
import { DirectivesModule } from '../directives/directives.module';
import { AddIncidentPopupComponent } from './add-incident-popup/add-incident-popup.component';
import { NonModalDialogComponent } from './non-modal-dialog/non-modal-dialog.component';

const components = [
  FloatingButtonsComponent,
  IncidentPopupComponent,
  AddIncidentPopupComponent,
  MapComponent,
  NonModalDialogComponent,
];

@NgModule({
  declarations: components,
  imports: [
    IonicModule,
    CommonModule,
    AgmCoreModule.forRoot({
      apiKey: environment.googleApiKey,
      libraries: ['places'],
    }),
    DirectivesModule,
  ],
  exports: components,
})
export class ComponentsModule {}
