import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { ProductsService } from '../services/products.service';
import { Product } from '../models/product';


@Component({
  selector: 'its-add-edit-product',
  templateUrl: './add-edit-product.component.html'
})

export class AddEditProductComponent implements OnInit {
  productId: string;
  activeProduct: Product;
  imageFile: File;

  updateAlert: string = 'none';
  addAlert: string = 'none';
  submitted: boolean = false;

  memoryRe: RegExp = /^\d{1,3}GB|^\dTB/;
  displayRe: RegExp = /^\d{1,2}\.?\d? inch/;

  addEdit: FormGroup = this.formBuilder.group({
    _id: [''],
    category: [''],
    brand: [''],
    name: [''],
    processor: [''],
    memory: [''],
    storage: [''],
    display: [''],
    price: [null],
    image: [''],
    imagePath: ['']
  })

/* 
  addEdit: FormGroup = this.formBuilder.group({
    _id: [''],
    category: ['', [Validators.required]],
    brand: ['', [Validators.required]],
    name: ['', [Validators.required, Validators.minLength(2)]],
    processor: ['', [Validators.required]],
    memory: ['', [Validators.required, Validators.pattern(this.memoryRe)]],
    storage: ['', [Validators.required, Validators.pattern(this.memoryRe)]],
    display: ['', [Validators.required, Validators.pattern(this.displayRe)]],
    price: [null, [Validators.required, Validators.min(1)]]
  }) */
  
  constructor(
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private productsService: ProductsService
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((data: any) => this.productId = data.id);
    if (this.productId) {
      this.productsService.getProductById(this.productId).subscribe((data: Product) => {
        this.activeProduct = data;
        this.addEdit.patchValue(this.activeProduct);
      })
    }
  }
  
  onUpdate (): void {
    const formData = new FormData();
    formData.append('_id', this.activeProduct._id);
    formData.append('name', this.addEdit.get('name').value);
    formData.append('image', this.addEdit.get('image').value);
    formData.append('imagePath', this.addEdit.get('imagePath').value);

    this.submitted = true;
    if (this.addEdit.valid) {
      this.productsService.updateProduct(formData).subscribe((data: Product) => {
        this.activeProduct = data;
        this.updateAlert = 'flex';
      });
    }
  }

  onRevert (): void {
    this.addEdit.patchValue(this.activeProduct);
  }
  
  onSubmit (): void {
    const formData = new FormData();
    formData.append('name', this.addEdit.get('name').value);
    formData.append('image', this.addEdit.get('image').value);

    this.submitted = true;
    if (this.addEdit.valid) {
      this.productsService.addProduct(formData).subscribe((data: Product) => {
        this.activeProduct = data;
        this.addAlert = 'flex';
      });
    }
  }
  
  onClear (): void {
    this.addEdit.reset();
  }

  dismissAlert (element: string): void {
    if (element === 'update') this.updateAlert = 'none';
    if (element === 'add') this.addAlert = 'none';
  }

  onFileSelected (files: FileList): void {
    this.imageFile = files[0];
    this.addEdit.get('image').setValue(this.imageFile);
  }
}
