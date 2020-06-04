import { Component, OnInit } from '@angular/core';

import { ProductsService } from '../services/products.service';
import { Product } from '../models/product';
import { ProductsData } from '../models/products-data';


@Component({
  selector: 'its-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
  productsData: ProductsData;
  products: Product[] = [];

  parameters: any = {
    page: null,
    pageSize: null
  }

  constructor(private productsService: ProductsService) { }

  ngOnInit(): void {
    this.parameters.page = 1;
    this.parameters.pageSize = 6;
    this.loadProducts();
  }

  loadProducts (): void {
    this.productsService.getProducts(this.parameters).subscribe((data: ProductsData) => {
      this.productsData = data;
      this.products = data.products;
    });
  }

  onPageChange (paginationData: any): void {
    this.parameters.page = paginationData.page;
    this.parameters.pageSize = paginationData.pageSize;
    this.loadProducts();
  }
}
