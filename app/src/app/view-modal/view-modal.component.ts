import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Product } from '../models/product';


@Component({
  selector: 'its-view-modal',
  templateUrl: './view-modal.component.html'
})

export class ViewModalComponent implements OnInit {
  @Input() clickedProduct: Product;
  @Output() delete = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
  }

  onDelete (): void {
    this.delete.emit(this.clickedProduct._id);
  }
}
