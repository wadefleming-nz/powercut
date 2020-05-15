import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-map-tab',
  templateUrl: './map-tab.page.html',
  styleUrls: ['./map-tab.page.scss'],
})
export class MapTabPage implements OnInit {
  latitude = 51.447359;
  longitude = -0.336917;
  zoom = 12;

  constructor() {}

  ngOnInit() {}
}
