import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Patient } from '../models/patient.model';

@Injectable({
  providedIn: 'root',
})
export class PatientService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000';

  // GET ALL PATIENTS
  getPatients() {
    return this.http.get<Patient[]>(`${this.apiUrl}/patients`);
  }

  getPatientById(id: string) {
    return this.http.get<Patient>(`${this.apiUrl}/patients/${id}`);
  }

  getPatientHistory(id: string) {
    return this.http.get<any[]>(`${this.apiUrl}/patients/${id}/history`);
  }

  getNurses() {
    return this.http.get<any[]>(`${this.apiUrl}/nurses`);
  }

  getTreatments() {
    return this.http.get<any[]>(`${this.apiUrl}/treatments`);
  }

  createPatient(patient: Patient) {
    return this.http.post(`${this.apiUrl}/patients`, patient);
  }

  addAdministration(data: any) {
    return this.http.post(`${this.apiUrl}/administration`, data);
  }
}
