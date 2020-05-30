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
  private incidentsPath = 'incidents';
  private recentIncidentsLimit = 100;

  private incidentCollection: AngularFirestoreCollection<Incident>;
  private recentIncidentCollection: AngularFirestoreCollection<Incident>;

  constructor(public firestore: AngularFirestore) {
    this.initializeCollections();
  }

  private initializeCollections() {
    this.incidentCollection = this.firestore.collection<Incident>(
      this.incidentsPath
    );
    this.recentIncidentCollection = this.firestore.collection<Incident>(
      this.incidentsPath,
      (ref) => ref.orderBy('reportedAt').limitToLast(this.recentIncidentsLimit)
    );
  }

  async createIncident(incident: Omit<Incident, 'id'>) {
    const id = this.firestore.createId();
    await this.incidentCollection.doc(id).set({ id, ...incident });
    return id;
  }

  getRecentIncidents() {
    return this.recentIncidentCollection.valueChanges();
  }

  getIncident(id: string) {
    return this.incidentCollection.doc<Incident>(id).valueChanges();
  }

  async deleteIncident(id: string) {
    await this.incidentCollection.doc(id).delete();
  }
}
