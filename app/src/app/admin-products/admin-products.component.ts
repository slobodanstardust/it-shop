import { Component, OnInit, Input } from '@angular/core';

import { Product } from '../models/product';
import { ProductsData } from '../models/products-data';
import { ProductsService } from '../services/products.service';


@Component({
  selector: 'its-admin-products',
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.css']
})

export class AdminProductsComponent implements OnInit {
  productsData: ProductsData;

  products: Product[] = [];

  parameters: any = {
    page: null,
    pageSize: null,
    name: '',
    price: ''
  }

  clickedProduct: Product;
  deletedProduct: Product;
  
  deleteAlert: string = 'none';
  resetAlert: string = 'none';

  constructor(private productsService: ProductsService) { }

  ngOnInit (): void {
    this.parameters.page = 1;
    this.parameters.pageSize = 5;
    this.loadProducts();
  }

  loadProducts (): void {
    this.productsService.getProducts(this.parameters).subscribe((data: ProductsData) => {
      this.productsData = data;
      this.products = data.products;
    })
  }

  onPageChange (paginationData: any): void { // This method is linked to my pagination component.
    this.parameters.page = paginationData.page;
    this.parameters.pageSize = paginationData.pageSize;
    this.loadProducts();
  }

  showView (productId: string): void {
    this.clickedProduct = this.products.find(({ _id }) => _id === productId);
  }

  askDelete (productId: string): void {
    this.clickedProduct = this.products.find(({ _id }) => _id === productId);
  }

  onDelete (productId: string): void {
    this.productsService.deleteProduct(productId).subscribe((data: Product) => {
      this.deletedProduct = data;
      this.loadProducts();
      this.deleteAlert = 'block';
    })
  }
  
  resetProductsData (): void {
    const parameters = { reset: 'yes' };
    this.productsService.resetProducts(parameters).subscribe((data: Product[]) => this.resetAlert = 'block');
  }

  dismissAlert (element: string): void {
    if (element === 'delete') this.deleteAlert = 'none';
    if (element === 'reset') this.resetAlert = 'none';
  }

  onSortName (): void {
    this.parameters.price = '';
    if (this.parameters.name === 'desc' || !this.parameters.name) this.parameters.name = 'asc';
    else this.parameters.name = 'desc';
    this.loadProducts();
  }

  onSortPrice (): void {
    this.parameters.name = '';
    if (this.parameters.price === 'desc' || !this.parameters.price) this.parameters.price = 'asc';
    else this.parameters.price = 'desc';
    this.loadProducts();
  }
}
