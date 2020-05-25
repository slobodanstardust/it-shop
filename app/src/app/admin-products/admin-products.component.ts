import { Component, OnInit } from '@angular/core';

import { Product } from '../models/product';
import { ProductsData } from '../models/products-data';
import { ProductsService } from '../services/products.service';


@Component({
  selector: 'its-admin-products',
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.css']
})

export class AdminProductsComponent implements OnInit {
  products: Product[] = [];
  pageCount: number;
  count: number;
  parameters: any = {
    page: null,
    pageSize: null
  }

  nextDisabled: boolean;
  lastDisabled: boolean;
  previousDisabled: boolean;
  firstDisabled: boolean;

  clickedProduct: Product;
  deletedProduct: Product;
  
  deleteAlert: string = 'none';
  resetAlert: string = 'none';

  constructor(private productsService: ProductsService) { }

  ngOnInit (): void {
    this.parameters.page = 1;
    this.parameters.pageSize = 5
    this.loadProducts();
  }

  loadProducts (): void {
    this.calculatePageCount();
    this.productsService.getProducts(this.parameters).subscribe((data: ProductsData) => {
      this.products = data.products;
      this.pageCount = data.pageCount;
      this.count = data.count;
      this.setPagination();
      console.log(this.products)
    })
  }

  // Need it to prevent empty page bug on page size change.
  // I calculate it like this because I need new pageCount before I get it from the server.
  calculatePageCount (): void {
    if (this.parameters.page > this.count / this.parameters.pageSize) {
      this.parameters.page = Math.ceil(this.count / this.parameters.pageSize);
    }
  }

  setPagination (): void {
    if (this.parameters.page == this.pageCount) {
      this.nextDisabled = true;
      this.lastDisabled = true;
    } else {
      this.nextDisabled = false;
      this.lastDisabled = false;
    }
    if (this.parameters.page == 1) {
      this.previousDisabled = true;
      this.firstDisabled = true;
    } else {
      this.previousDisabled = false;
      this.firstDisabled = false;
    }
  }

  changePageSize (pageSize: number): void {
    this.parameters.pageSize = pageSize;
    this.loadProducts();
  }

  nextPage (): void {
    this.parameters.page++;
    this.loadProducts();
  }

  lastPage (): void {
    this.parameters.page = this.pageCount;
    this.loadProducts();
  }

  previousPage (): void {
    this.parameters.page--;
    this.loadProducts();
  }

  firstPage (): void {
    this.parameters.page = 1;
    this.loadProducts();
  }

  askDelete (productId: string): void {
    this.clickedProduct = this.products.find(({ _id }) => _id === productId);
  }

  showView (productId: string): void {
    this.clickedProduct = this.products.find(({ _id }) => _id === productId);
    console.log(this.clickedProduct)
  }

  onDelete (productId: string): void {
    this.productsService.deleteProduct(productId).subscribe((data: Product) => {
      this.deletedProduct = data;
      this.loadProducts();
      this.deleteAlert = 'block';
    })
  }

  dismissAlert (element: string): void {
    if (element === 'delete') this.deleteAlert = 'none';
    if (element === 'reset') this.resetAlert = 'none';
  }

  resetProductsData (): void {
    const parameters = { reset: 'yes' };
    this.productsService.resetProducts(parameters).subscribe((data: Product[]) => this.resetAlert = 'block');
  }
}
