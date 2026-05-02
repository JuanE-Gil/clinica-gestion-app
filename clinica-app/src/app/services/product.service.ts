import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/products';

  // GET ALL PRODUCTS
  getProducts() {
    return this.http.get<Product[]>(this.apiUrl);
  }

  // GET A SINGLE PRODUCT
  getProduct(id: number) {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  // CREATE A NEW PRODUCT
  createProduct(product: Product) {
    return this.http.post<Product>(this.apiUrl, product);
  }

  // UPDATE AN EXISTING PRODUCT
  updateProduct(id: number, product: Product) {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, product);
  }

  // DELETE A PRODUCT
  deleteProduct(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}


