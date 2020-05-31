import { Component, Input, Output, EventEmitter } from '@angular/core';
import { PowerStatus } from 'src/app/types/power-status';

@Component({
  selector: 'app-floating-buttons',
  templateUrl: './floating-buttons.component.html',
  styleUrls: ['./floating-buttons.component.scss'],
})
export class FloatingButtonsComponent {
  powerStatus = PowerStatus;

  @Input()
  enableAddDelete = true;

  @Input()
  displayGeolocation = true;

  @Output()
  addIncidentClicked = new EventEmitter<PowerStatus>();
}
