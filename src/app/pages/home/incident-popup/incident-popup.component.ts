import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IncidentViewModel } from 'src/app/models/incident-view-model';
import { PowerStatus } from 'src/app/types/power-status';
import * as incidentConstants from '../../../constants/incident-constants';

@Component({
  selector: 'app-incident-popup',
  templateUrl: './incident-popup.component.html',
  styleUrls: ['./incident-popup.component.scss'],
})
export class IncidentPopupComponent {
  @Input()
  incident: IncidentViewModel;

  @Input()
  show = false;

  @Input()
  actionButtonLabel: string;

  @Output()
  actionClicked = new EventEmitter();

  @Output()
  cancelClicked = new EventEmitter();

  getIncidentType(status: PowerStatus): string {
    return incidentConstants.types[status];
  }
}
