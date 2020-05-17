import * as firebase from 'firebase/app';

export interface Incident {
  id: string;
  latitude: number;
  longitude: number;
  reportedAt: firebase.firestore.Timestamp;
}
