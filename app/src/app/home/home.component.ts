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
  products: Product[] = [];

  constructor(private productsService: ProductsService) { }

  ngOnInit(): void {
    this.productsService.getProducts().subscribe((data: ProductsData) => this.products = data.products);
  }

}
