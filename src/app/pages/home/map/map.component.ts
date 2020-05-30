import {
  Component,
  Input,
  ChangeDetectorRef,
  Output,
  EventEmitter,
} from '@angular/core';
import { IncidentViewModel } from 'src/app/models/incident-view-model';
import { LatLngLiteral } from '@agm/core';
import { CacheService } from 'src/app/services/cache.service';
import { GoogleSymbol } from '@agm/core/services/google-maps-types';
import { Point } from 'src/app/models/point';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent {
  latitude = 51.447359;
  longitude = -0.336917;

  centerLatitude = this.latitude;
  centerLongitude = this.longitude;

  initialZoom = 12;
  zoom = this.initialZoom;

  centerIndicatorVisible = true;
  centerIndicatorRedisplayDelay = 250;

  maxAge = 60; // TODO use same value as in home.page.ts

  lightningPath = 'M7 2v11h3v9l7-12h-4l4-8z';
  icon: GoogleSymbol = {
    path: this.lightningPath,
    fillColor: 'hsl(0, 100%, 50%)',
    fillOpacity: 1.0,
    strokeColor: '#000000',
    strokeWeight: 1,
    scale: 2,
    anchor: new Point(10, 22),
  };

  @Input()
  incidents: IncidentViewModel[];

  @Input()
  allowMarkerClick = true;

  @Output()
  incidentClicked = new EventEmitter<IncidentViewModel>();

  constructor(
    private changeDetector: ChangeDetectorRef,
    private iconCache: CacheService<GoogleSymbol>
  ) {}

  protected centerChanged(coords: LatLngLiteral) {
    this.centerLatitude = coords.lat;
    this.centerLongitude = coords.lng;

    this.redisplayCenterIndicator();
  }

  private redisplayCenterIndicator() {
    if (!this.centerIndicatorVisible) {
      setTimeout(
        () => (this.centerIndicatorVisible = true),
        this.centerIndicatorRedisplayDelay
      );
    }
  }

  // TODO
  protected mapClicked() {
    //this.clearActiveIncident();
  }

  protected trackByIncidentId(_: number, incident: IncidentViewModel) {
    return incident.id;
  }

  public animateTo(
    coords: { latitude: number; longitude: number },
    zoom?: number
  ) {
    this.hackToFixAnimation(zoom);

    this.latitude = coords.latitude;
    this.longitude = coords.longitude;
    if (zoom) {
      this.zoom = zoom;
    }
  }

  // https://github.com/SebastianM/angular-google-maps/issues/1026#issuecomment-569965653
  private hackToFixAnimation(zoom?: number) {
    this.latitude = 0;
    this.longitude = 0;
    if (zoom) {
      this.zoom = 0;
    }
    this.changeDetector.detectChanges();
  }

  // newer markers should appear higher
  protected getIncidentZIndex(incident: IncidentViewModel) {
    return this.maxAge - incident.age;
  }

  protected getIncidentIcon(incident: IncidentViewModel) {
    return this.iconCache.getOrCreate(incident.iconFillColor, {
      ...this.icon,
      fillColor: incident.iconFillColor,
    });
  }
}