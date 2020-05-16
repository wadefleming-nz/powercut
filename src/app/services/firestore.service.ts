import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';
import { Incident } from 'src/app/models/incident';

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  incidentsPath = 'incidents';
  incidentCollection: AngularFirestoreCollection<Incident>;

  constructor(public firestore: AngularFirestore) {
    this.incidentCollection = this.firestore.collection<Incident>(
      this.incidentsPath
    );
  }

  async createIncident(incident: Omit<Incident, 'id'>) {
    const id = this.firestore.createId();
    return await this.incidentCollection.doc(id).set({ id, ...incident });
  }

  getAllIncidents() {
    return this.incidentCollection.valueChanges();
  }

  getIncident(id: string) {
    return this.incidentCollection.doc<Incident>(id).valueChanges();
  }

  async deleteIncident(id: string) {
    await this.incidentCollection.doc(id).delete();
  }
}
