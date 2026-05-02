import { Routes } from '@angular/router';
import { ProductListComponent } from './components/product-list/product-list.component';
import { PatientListComponent } from './components/patient-list/patient-list.component';
import { PatientDetailComponent } from './components/patient-detail/patient-detail.component';
import { PatientFormComponent } from './components/patient-form/patient-form.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

export const routes: Routes = [
  { path: 'products', component: ProductListComponent },
  { path: 'patients', component: PatientListComponent },
  { path: 'patients/new', component: PatientFormComponent },
  { path: 'patients/:id', component: PatientDetailComponent },

  { path: 'home', redirectTo: '', pathMatch: 'full' },

  { path: '', component: DashboardComponent, pathMatch: 'full' },

  { path: '**', redirectTo: '', pathMatch: 'full' },
];
