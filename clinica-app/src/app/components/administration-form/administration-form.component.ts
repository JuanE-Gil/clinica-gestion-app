import { Component, inject, OnInit, signal, computed, Input, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PatientService } from '../../services/patient.service';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-administration-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './administration-form.component.html',
  styleUrl: './administration-form.component.css',
})
export class AdministrationFormComponent implements OnInit {
  @Input() preselectedPatientId: string | null = null;
  @Output() onSave = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private patientService = inject(PatientService);
  private productService = inject(ProductService);

  adminForm: FormGroup;
  patients = signal<any[]>([]);
  nurses = signal<any[]>([]);
  treatments = signal<any[]>([]);
  products = signal<any[]>([]);
  estimatedTotal = signal(0);

  constructor() {
    this.adminForm = this.fb.group({
      patientId: [''],
      nurseId: [''],
      treatmentId: [''],
      items: this.fb.array([]),
    });

    this.adminForm.valueChanges.subscribe(() => this.calculateEstimation());
  }

  ngOnInit() {
    this.patientService.getPatients().subscribe((d) => {
      this.patients.set(d);
      if (this.preselectedPatientId) {
        this.adminForm.patchValue({ patientId: this.preselectedPatientId });
      }
    });
    this.patientService.getNurses().subscribe((d) => this.nurses.set(d));
    this.patientService.getTreatments().subscribe((d) => this.treatments.set(d));
    this.productService.getProducts().subscribe((d) => this.products.set(d));
    this.addItem();
  }

  get items() {
    return this.adminForm.get('items') as FormArray;
  }

  addItem() {
    const itemForm = this.fb.group({
      productId: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
    });
    this.items.push(itemForm);
  }

  removeItem(index: number) {
    this.items.removeAt(index);
  }

  calculateEstimation() {
    const tId = this.adminForm.value.treatmentId;
    const selectedT = this.treatments().find((t) => t.id === tId);
    let total = selectedT ? Number(selectedT.base_cost) : 0;

    this.adminForm.value.items.forEach((item: any) => {
      const prod = this.products().find((p) => p.id === item.productId);
      if (prod) total += Number(prod.price_sale) * item.quantity;
    });
    this.estimatedTotal.set(total);
  }

  onSubmit() {
    if (this.adminForm.valid) {
      this.patientService.addAdministration(this.adminForm.value).subscribe({
        next: () => {
          this.onSave.emit();
        },
      });
    }
  }
}
