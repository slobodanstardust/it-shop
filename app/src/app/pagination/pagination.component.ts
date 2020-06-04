import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';

import { ProductsData } from '../models/products-data';


@Component({
  selector: 'its-pagination',
  templateUrl: './pagination.component.html'
})

export class PaginationComponent implements OnInit, OnChanges {
  @Input () productsData: ProductsData;
  @Output () pageChange = new EventEmitter<any>();

  pageCount: number;

  paginationData: any = { // This is the data that I need to send to the parent component.
    page: null,
    pageSize: null,
  }

  firstDisabled: boolean;
  previousDisabled: boolean;
  nextDisabled: boolean;
  lastDisabled: boolean;

  constructor() { }

  ngOnInit(): void {
    this.paginationData.page = 1;
    this.paginationData.pageSize = 5;
  }

  ngOnChanges(): void { // I use on change because I need to do this operations every time productData changes.
    /*
    Calculating page count based on page count and page size.
    I don't use page count form the server because there is a bug when you change page size and your page number does't exist anymore.
    I need to know page count before I get it from the server.
    */
    if (this.productsData) {
      this.pageCount = Math.ceil(this.productsData.count / this.paginationData.pageSize);
    }
    this.setPagination();
  }

  setPagination (): void {
    if (this.paginationData.page === this.pageCount) { // If it is on the last page.
      this.nextDisabled = true;
      this.lastDisabled = true;
    } else { // If it is not on the last page.
      this.nextDisabled = false;
      this.lastDisabled = false;
    }
    if (this.paginationData.page == 1) { // If it is on the first page.
      this.previousDisabled = true;
      this.firstDisabled = true;
    } else { // If it is not on the first page.
      this.previousDisabled = false;
      this.firstDisabled = false;
    }
  }

  changePageSize (pageSize: number): void {
    this.paginationData.pageSize = pageSize;
    this.paginationData.page = 1;
    this.pageChange.emit(this.paginationData);
  }

  firstPage (): void {
    this.paginationData.page = 1;
    this.pageChange.emit(this.paginationData);
  }

  previousPage (): void {
    this.paginationData.page--;
    this.pageChange.emit(this.paginationData);
  }

  nextPage (): void {
    this.paginationData.page++;
    this.pageChange.emit(this.paginationData);
  }

  lastPage (): void {
    this.paginationData.page = this.pageCount;
    this.pageChange.emit(this.paginationData);
  }
}
