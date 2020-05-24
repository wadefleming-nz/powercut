import { PowerStatus } from '../types/power-status';

export interface Incident {
  id: string;
  status: PowerStatus;
  latitude: number;
  longitude: number;
  reportedAt: string;
}
