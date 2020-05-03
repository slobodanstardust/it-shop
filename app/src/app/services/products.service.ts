import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ProductsData } from '../models/products-data';

const PRODUCTS_URL: string = 'http://localhost:3000/products';


@Injectable({
  providedIn: 'root'
})

export class ProductsService {
  constructor(private httpClient: HttpClient) { }

  getProducts (): Observable<ProductsData> {
    return this.httpClient.get(PRODUCTS_URL).pipe(map((data: any) => new ProductsData(data)));
  }
}
