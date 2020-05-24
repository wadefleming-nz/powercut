import { PowerStatus } from '../types/power-status';

export interface IncidentViewModel {
  id: string;
  status: PowerStatus;
  latitude: number;
  longitude: number;
  reportedAt: string;
  age: number;
  iconFillColor: string;
}
