// src/app/product.service.ts
import { Injectable } from '@angular/core';

export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private products: Product[] = [
    { id: 1, name: 'Product 1', price: 100, description: 'Description for Product 1', imageUrl: 'assets/images/headset.webp' },
    { id: 2, name: 'Product 2', price: 200, description: 'Description for Product 2', imageUrl: 'https://m.media-amazon.com/images/I/61ERDR3tATL.AC_UF1000,1000_QL80.jpg' },
    { id: 3, name: 'Product 3', price: 300, description: 'Description for Product 3', imageUrl: 'https://digital-devices.weebly.com/uploads/2/7/1/1/27118291/8780046_orig.jpg' },
    { id: 4, name: 'Product 4', price: 400, description: 'Description for Product 4', imageUrl: 'https://s.alicdn.com/@sc04/kf/Hd521db5e65a74fbd90100ff61e1c5f840.jpg_720x720q50.jpg' },
    { id: 5, name: 'Product 5', price: 500, description: 'Description for Product 5', imageUrl: 'https://via.placeholder.com/150' }
  ];

  constructor() {}

  getProducts(): Product[] {
    return this.products;
  }
}