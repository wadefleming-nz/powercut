import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-floating-buttons',
  templateUrl: './floating-buttons.component.html',
  styleUrls: ['./floating-buttons.component.scss'],
})
export class FloatingButtonsComponent implements OnInit {
  @Input()
  enableAddDelete = true;

  constructor() {}

  ngOnInit() {}
}
