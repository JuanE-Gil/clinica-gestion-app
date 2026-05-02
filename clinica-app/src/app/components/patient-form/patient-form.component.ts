import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { PatientService } from '../../services/patient.service';

@Component({
  selector: 'app-patient-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './patient-form.component.html',
  styleUrl: './patient-form.component.css',
})
export class PatientFormComponent {
  private fb = inject(FormBuilder);
  private patientService = inject(PatientService);
  private router = inject(Router);

  patientForm: FormGroup;
  isSubmitting = signal(false);
  errorMessage = signal<string | null>(null);

  constructor() {
    this.patientForm = this.fb.group({
      full_name: ['', [Validators.required, Validators.minLength(3)]],
      dni: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{9}$')]],
      address: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  onSubmit() {
    if (this.patientForm.valid) {
      this.isSubmitting.set(true);
      this.errorMessage.set(null);

      this.patientService.createPatient(this.patientForm.value).subscribe({
        next: () => {
          console.log('✅ Paciente creado con éxito');
          this.router.navigate(['/patients']);
        },
        error: (err) => {
          this.isSubmitting.set(false);
          this.errorMessage.set(err.error.error || 'Ocurrió un error inesperado');
        },
      });
    }
  }
}
