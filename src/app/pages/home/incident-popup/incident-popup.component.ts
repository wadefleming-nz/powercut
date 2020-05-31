import { Component, Input, Output, EventEmitter } from '@angular/core';
import { PowerStatus } from 'src/app/types/power-status';
import * as incidentConstants from '../../../constants/incident-constants';

@Component({
  selector: 'app-incident-popup',
  templateUrl: './incident-popup.component.html',
  styleUrls: ['./incident-popup.component.scss'],
})
export class IncidentPopupComponent {
  @Input()
  reportedAtDateTime: string;

  @Input()
  status: PowerStatus;

  @Input()
  actionButtonLabel: string;

  @Input()
  closeButtonLabel: string;

  @Output()
  actionClicked = new EventEmitter();

  @Output()
  closeClicked = new EventEmitter();

  getIncidentType(status: PowerStatus): string {
    return incidentConstants.types[status];
  }
}
