import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AdminProductsComponent } from './admin-products/admin-products.component';
import { AdminOrdersComponent } from './admin-orders/admin-orders.component';
import { AddEditProductComponent } from './add-edit-product/add-edit-product.component';
import { LoginSignUpComponent } from './login-sign-up/login-sign-up.component';


const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginSignUpComponent },
  // { path: 'products/:id', component: ProductsComponent },
  // { path: 'products', component: ProductsComponent },
  // { path: 'order', component: OrderComponent},
  { path: 'administrator/products/edit/:id', component: AddEditProductComponent },
  { path: 'administrator/products/add', component: AddEditProductComponent },
  { path: 'administrator/products', component: AdminProductsComponent },
  { path: 'administrator/orders', component: AdminOrdersComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
