import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FloatingButtonsComponent } from './floating-buttons/floating-buttons.component';
import { IncidentDialogComponent } from './incident-dialog/incident-dialog.component';
import { MapComponent } from './map/map.component';
import { AgmCoreModule } from '@agm/core';
import { environment } from '../../environments/environment';
import { CommonModule } from '@angular/common';
import { DirectivesModule } from '../directives/directives.module';
import { AddIncidentDialogComponent } from './add-incident-dialog/add-incident-dialog.component';
import { NonModalDialogComponent } from './non-modal-dialog/non-modal-dialog.component';
import { ViewIncidentDialogComponent } from './view-incident-dialog/view-incident-dialog.component';

const components = [
  FloatingButtonsComponent,
  IncidentDialogComponent,
  AddIncidentDialogComponent,
  ViewIncidentDialogComponent,
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
