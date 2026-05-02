import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css',
})
export class ProductListComponent implements OnInit {
  private productService = inject(ProductService);

  products = signal<Product[]>([]);
  showDeleteModal = signal(false);
  showFormModal = signal(false);
  isEditing = signal(false);

  tempProduct: any = { name: '', amount: 0, price: 0 };
  selectedId: number | null = null;

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getProducts().subscribe((data) => {
      this.products.set(data);
      console.log('✅ Insumo cargado desde el servidor');
    });
  }

  saveProduct() {
    if (this.isEditing()) {
      // --- (PUT) ---
      this.productService.updateProduct(this.tempProduct.id, this.tempProduct).subscribe({
        next: (updatedProduct) => {
          this.products.update((prods) =>
            prods.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
          );
          console.log('✅ Insumo actualizado en el servidor');
          this.showFormModal.set(false);
        },
        error: (err) => console.error('❌ Error al actualizar:', err),
      });
    } else {
      // --- (POST) ---
      this.productService.createProduct(this.tempProduct).subscribe({
        next: (newProduct) => {
          this.products.update((prods) => [...prods, newProduct]);
          console.log('✅ Insumo creado en el servidor');
          this.showFormModal.set(false);
        },
        error: (err) => console.error('❌ Error al crear:', err),
      });
    }
  }

  openAddModal() {
    this.isEditing.set(false);
    this.tempProduct = { name: '', amount: 0, price: 0 };
    this.showFormModal.set(true);
  }

  openEditModal(product: any) {
    this.isEditing.set(true);
    this.tempProduct = { ...product };
    this.showFormModal.set(true);
  }
  openDeleteModal(id: number) {
    this.selectedId = id;
    this.showDeleteModal.set(true);
  }

  confirmDelete() {
    if (this.selectedId) {
      this.productService.deleteProduct(this.selectedId).subscribe({
        next: () => {
          this.products.update((prods) => prods.filter((p) => p.id !== this.selectedId));
          this.showDeleteModal.set(false);
          this.selectedId = null;
          console.log('✅ Insumo eliminado del servidor');
        },
        error: (err) => console.error('❌ Error al eliminar:', err),
      });
    }
  }
}
