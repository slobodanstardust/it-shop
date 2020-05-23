import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ProductsData } from '../models/products-data';
import { Product } from '../models/product';

const PRODUCTS_URL: string = 'http://localhost:3000/products';


@Injectable({
  providedIn: 'root'
})

export class ProductsService {
  constructor(private httpClient: HttpClient) { }

  getProducts (parameters?: any): Observable<ProductsData> {
    let queryParameters = {};
    if (parameters) {
      queryParameters = {
        params: new HttpParams()
          .set('page', parameters.page || '')
          .set('pageSize', parameters.pageSize || '')
          // .set('sort', parameters.sort || '')
          // .set('sortDirection', parameters.sortDirection || '')
      }
    }
    return this.httpClient.get(PRODUCTS_URL, queryParameters).pipe(map((data: any) => new ProductsData(data)));
  }

  getProductById (productId: string): Observable<Product> {
    return this.httpClient.get(PRODUCTS_URL + '/' + productId).pipe(map((data: any) => new Product(data)));
  }

  updateProduct (product: Product): Observable<Product> {
    return this.httpClient.put(PRODUCTS_URL + '/' + product._id, product).pipe(map((data: any) => new Product(data.document)));
  }

  deleteProduct (productId: string): Observable<Product> {
    return this.httpClient.delete(PRODUCTS_URL + '/' + productId).pipe(map((data: any) => new Product(data.document)));
  }

  addProduct (newProduct: Product): Observable<Product> {
    return this.httpClient.post(PRODUCTS_URL + '/', newProduct).pipe(map((data: any) => new Product(data.document)));
  }

  resetProducts (parameters: any): Observable<Product[]> {
    const queryParameters = {
      params: new HttpParams()
        .set('reset', parameters.reset)
    };
    return this.httpClient.get(PRODUCTS_URL, queryParameters).pipe(map((data: any) => {
      return data.insertedDocuments.map((item: any) => new Product(item));
    }));
  }
}
