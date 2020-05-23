import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AdminProductsComponent } from './admin-products/admin-products.component';
import { AdminOrdersComponent } from './admin-orders/admin-orders.component';
import { AddEditProductComponent } from './add-edit-product/add-edit-product.component';
import { ViewModalComponent } from './view-modal/view-modal.component';
import { NavigationComponent } from './navigation/navigation.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    PageNotFoundComponent,
    AdminProductsComponent,
    AdminOrdersComponent,
    AddEditProductComponent,
    ViewModalComponent,
    NavigationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule { }
