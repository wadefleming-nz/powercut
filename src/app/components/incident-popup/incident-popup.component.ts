import { Component, Input, Output, EventEmitter } from '@angular/core';
import { PowerStatus } from 'src/app/types/power-status';
import * as incidentConstants from '../../constants/incident-constants';

@Component({
  selector: 'app-incident-popup',
  templateUrl: './incident-popup.component.html',
  styleUrls: ['./incident-popup.component.scss'],
})
export class IncidentPopupComponent {
  @Input()
  editable: boolean;

  @Input()
  reportedAtDateTime: string;

  @Input()
  status: PowerStatus;

  @Input()
  leftButtonLabel: string;

  @Input()
  rightButtonLabel: string;

  @Output()
  leftButtonClicked = new EventEmitter();

  @Output()
  rightButtonClicked = new EventEmitter();

  getIncidentType(status: PowerStatus): string {
    return incidentConstants.types[status];
  }
}
