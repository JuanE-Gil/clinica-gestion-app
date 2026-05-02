import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PatientService } from '../../services/patient.service';
import { AdministrationFormComponent } from '../administration-form/administration-form.component';

@Component({
  selector: 'app-patient-detail',
  imports: [RouterLink, CommonModule, AdministrationFormComponent],
  standalone: true,
  templateUrl: './patient-detail.component.html',
})
export class PatientDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private patientService = inject(PatientService);

  patientId = signal<string | null>(null);
  patient = signal<any>(null);
  history = signal<any[]>([]);
  showAdminModal = signal(false);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.patientId.set(id);
      this.loadAll();
    }
  }

  loadAll() {
    const id = this.patientId();
    if (id) {
      this.patientService.getPatientById(id).subscribe((data) => this.patient.set(data));
      this.patientService.getPatientHistory(id).subscribe((data) => this.history.set(data));
    }
  }

  calculateTotal = computed(() => {
    return this.history()
      .reduce((acc, curr) => acc + Number(curr.costo_total), 0)
      .toFixed(2);
  });

  onAttentionSaved() {
    this.showAdminModal.set(false);
    this.loadAll();
  }
}
