import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Patient } from '../../models/patient.model';
import { PatientService } from '../../services/patient.service';

@Component({
  selector: 'app-patient-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './patient-list.component.html',
})
export class PatientListComponent implements OnInit {
  private patientService = inject(PatientService);

  allPatients = signal<Patient[]>([]);
  searchTerm = signal('');

  filteredPatients = computed(() => {
    const term = this.searchTerm().toLowerCase();
    return this.allPatients().filter(
      (p) => p.full_name.toLowerCase().includes(term) || p.dni.includes(term)
    );
  });

  ngOnInit() {
    this.patientService.getPatients().subscribe((data) => this.allPatients.set(data));
  }

  updateSearch(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchTerm.set(value);
  }
}
