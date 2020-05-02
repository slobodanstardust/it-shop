import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AdministratorComponent } from './administrator/administrator.component';


const routes: Routes = [
  { path: 'home', component: HomeComponent },
  // { path: 'products/:id', component: ProductsComponent },
  // { path: 'products', component: ProductsComponent },
  // { path: 'order', component: OrderComponent},
  { path: 'administrator', component: AdministratorComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
