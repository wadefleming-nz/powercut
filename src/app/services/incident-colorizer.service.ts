import { Injectable } from '@angular/core';
import { PowerStatus } from '../types/power-status';
import { transformBetweenRanges } from '../shared/utilities/transform-between-ranges';
import * as _ from 'lodash';
import { roundToWhole } from '../shared/utilities/round-to-whole';
import * as incidentConstants from '../constants/incident-constants';

@Injectable({
  providedIn: 'root',
})
export class IncidentColorizerService {
  getColor(status: PowerStatus, age: number) {
    const colorDef = incidentConstants.colorDefinitions[status];
    const lightness = this.getLightnessPercentBasedOnAge(
      age,
      colorDef.lightnessRange
    );
    return `hsl(${colorDef.hue}, ${colorDef.saturation}%, ${lightness}%)`;
  }

  private getLightnessPercentBasedOnAge(
    age: number,
    range: { darkest: number; lightest: number }
  ) {
    const { darkest, lightest } = range;
    const lightness = transformBetweenRanges(
      age,
      { min: incidentConstants.minAge, max: incidentConstants.maxAge },
      { min: darkest, max: lightest }
    );
    return _.clamp(roundToWhole(lightness, 5), darkest, lightest);
  }
}
