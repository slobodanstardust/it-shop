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
  addedProduct: Product;
  activeProduct: Product;
  imageFile: File;

  updateAlert: string = 'none';
  addAlert: string = 'none';
  submitted: boolean = false;
  imageTest: boolean = true;

  memoryRe: RegExp = /^\d{1,3}GB|^\dTB/;
  displayRe: RegExp = /^\d{1,2}\.?\d? inch/;

  formData: FormData;  

  addEdit: FormGroup = this.formBuilder.group({
    _id: [''],
    category: ['', [Validators.required]],
    brand: ['', [Validators.required]],
    name: ['', [Validators.required, Validators.minLength(2)]],
    processor: ['', [Validators.required]],
    memory: ['', [Validators.required, Validators.pattern(this.memoryRe)]],
    storage: ['', [Validators.required, Validators.pattern(this.memoryRe)]],
    display: ['', [Validators.required, Validators.pattern(this.displayRe)]],
    price: [null, [Validators.required, Validators.min(1)]],
    image: [''],
    imagePath: ['']
  });
  
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
    this.formGroupToFormData(this.addEdit);

    this.submitted = true;
    if (this.addEdit.valid && this.imageTest) {
      this.productsService.updateProduct(this.formData).subscribe((data: Product) => {
        this.activeProduct = data;
        this.updateAlert = 'flex';
      });
    }
  }

  onRevert (): void {
    this.addEdit.patchValue(this.activeProduct);
  }
  
  onSubmit (): void {
    this.formGroupToFormData(this.addEdit);

    this.submitted = true;
    if (this.addEdit.valid) {
      this.productsService.addProduct(this.formData).subscribe((data: Product) => {
        this.addedProduct = data;
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
    if (files[0].size <= (1024 * 1024 * 5) && files[0].type === 'image/jpeg' || files[0].type === 'image/png') {
      this.imageTest = true;
      this.imageFile = files[0];
      this.addEdit.get('image').setValue(this.imageFile);
    } else {
      this.imageTest = false;
    }
  }

  formGroupToFormData(formGroup: FormGroup): void {
    this.formData = new FormData();

    Object.keys(formGroup.controls).forEach((key: string) => {
      const abstractControl = formGroup.get(key);

      /*    
      If the control is an instance of FormGroup, i.e a nested FormGroup,
      then recursively call this same method (logKeyValuePairs) passing it
      the FormGroup so we can get to the form controls in it.
      */
      if (abstractControl instanceof FormGroup) {
        this.formGroupToFormData(abstractControl);
      }
      else { // If the control is not a FormGroup then we know it's a FormControl
        this.formData.append(key, abstractControl.value);
      }
    });

    this.formData.set('price', String(this.addEdit.get('price').value)); // FormData can't send integers.
  }
}
