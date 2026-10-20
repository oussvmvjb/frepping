import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { adminRoutes } from './admin.routes';
import { AdminLayoutComponent } from './layout/admin-layout.component';
import { AdminDashboardComponent } from './pages/dashboard/admin-dashboard.component';
import { ProductsComponent } from './pages/products/products.component';
import { CategoriesListComponent } from './pages/categories-list/categories-list.component';
import { CreateProductComponent } from './pages/create-product/create-product.component';
import { EditProductPlaceholderComponent } from './pages/edit-product-placeholder/edit-product-placeholder.component';
import { AdminOrdersComponent } from './pages/orders/admin-orders.component';
import { OrderDetailComponent } from './pages/order-detail/order-detail.component';
import { InventoryComponent } from './pages/inventory/inventory.component';
import { GiftCardsComponent } from './pages/gift-cards/gift-cards.component';
import { PromosComponent } from './pages/promos/promos.component';
import { DeliveryOptionsComponent } from './pages/delivery-options/delivery-options.component';
import { UsersListComponent } from './pages/users/users-list.component';
import { UserDetailComponent } from './pages/user-detail/user-detail.component';

@NgModule({
  declarations: [
    AdminLayoutComponent,
    AdminDashboardComponent,
    ProductsComponent,
    CategoriesListComponent,
    CreateProductComponent,
    EditProductPlaceholderComponent,
    AdminOrdersComponent,
    OrderDetailComponent,
    InventoryComponent,
    GiftCardsComponent,
    PromosComponent,
    DeliveryOptionsComponent,
    UsersListComponent,
    UserDetailComponent,
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
