import { EnumDictionary } from '../types/enum-dictionary';
import { PowerStatus } from '../types/power-status';
import { IncidentColorDefinition } from '../models/incident-color-definition';

export const colorDefinitions: EnumDictionary<
  PowerStatus,
  IncidentColorDefinition
> = {
  [PowerStatus.On]: {
    // green
    hue: 130,
    saturation: 55,
    lightnessRange: { darkest: 50, lightest: 90 },
  },
  [PowerStatus.Off]: {
    // red
    hue: 0,
    saturation: 100,
    lightnessRange: { darkest: 55, lightest: 95 },
  },
};

export const types: EnumDictionary<PowerStatus, string> = {
  [PowerStatus.On]: 'Power restored',
  [PowerStatus.Off]: 'Power outage',
};

export const minAge = 0;
export const maxAge = 60;
