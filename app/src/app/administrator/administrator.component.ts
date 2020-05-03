import { Component, OnInit } from '@angular/core';

import { Product } from '../models/product';
import { ProductsData } from '../models/products-data';
import { ProductsService } from '../services/products.service';


@Component({
  selector: 'its-administrator',
  templateUrl: './administrator.component.html',
  styleUrls: ['./administrator.component.css']
})


export class AdministratorComponent implements OnInit {
  products: Product[] = [];

  constructor(private productsService: ProductsService) { }

  ngOnInit(): void {
    this.productsService.getProducts().subscribe((data: ProductsData) => {
      this.products = data.products;
      console.log(this.products);
    })
  }
}
