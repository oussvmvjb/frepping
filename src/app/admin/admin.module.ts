import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { adminRoutes } from './admin.routes';
import { AdminLayoutComponent } from './layout/admin-layout.component';
import { ProductsComponent } from './pages/products/products.component';
import { CategoriesListComponent } from './pages/categories-list/categories-list.component';
import { CreateProductComponent } from './pages/create-product/create-product.component';
import { EditProductPlaceholderComponent } from './pages/edit-product-placeholder/edit-product-placeholder.component';

@NgModule({
  declarations: [
    AdminLayoutComponent,
    ProductsComponent,
    CategoriesListComponent,
    CreateProductComponent,
    EditProductPlaceholderComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forChild(adminRoutes),
  ],
  exports: [
    ProductsComponent,
  ],
})
export class AdminModule {}
