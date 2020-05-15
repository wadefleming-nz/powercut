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

  markers: MapMarker[] = [
    {
      latitude: 51.447359,
      longitude: -0.336917,
      label: 'A',
    },
    {
      latitude: 51.457359,
      longitude: -0.346917,
      label: 'B',
    },
  ];

  constructor() {}

  ngOnInit() {}
}
