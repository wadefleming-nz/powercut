import { Component, Input, Output, EventEmitter } from '@angular/core';
import { PowerStatus } from 'src/app/types/power-status';
import * as incidentConstants from '../../constants/incident-constants';

@Component({
  selector: 'app-incident-dialog',
  templateUrl: './incident-dialog.component.html',
  styleUrls: ['./incident-dialog.component.scss'],
})
export class IncidentDialogComponent {
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
