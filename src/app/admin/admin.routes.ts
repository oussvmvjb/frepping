import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './layout/admin-layout.component';
import { AdminDashboardComponent } from './pages/dashboard/admin-dashboard.component';
import { ProductsComponent } from './pages/products/products.component';
import { CreateProductComponent } from './pages/create-product/create-product.component';
import { CategoriesListComponent } from './pages/categories-list/categories-list.component';
import { EditProductPlaceholderComponent } from './pages/edit-product-placeholder/edit-product-placeholder.component';
import { AdminOrdersComponent } from './pages/orders/admin-orders.component';
import { OrderDetailComponent } from './pages/order-detail/order-detail.component';
import { InventoryComponent } from './pages/inventory/inventory.component';
import { GiftCardsComponent } from './pages/gift-cards/gift-cards.component';
import { PromosComponent } from './pages/promos/promos.component';
import { DeliveryOptionsComponent } from './pages/delivery-options/delivery-options.component';
import { UsersListComponent } from './pages/users/users-list.component';
import { UserDetailComponent } from './pages/user-detail/user-detail.component';
import { AuthGuard } from '../services/auth.guard';
import { RoleGuard } from '../services/role.guard';

export const adminRoutes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['ADMIN', 'SUPER_ADMIN'] },
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: AdminDashboardComponent },
      { path: 'products', component: ProductsComponent },
      { path: 'products/new', component: CreateProductComponent },
      { path: 'products/:id/edit', component: EditProductPlaceholderComponent },
      { path: 'categories', component: CategoriesListComponent },
      { path: 'orders', component: AdminOrdersComponent },
      { path: 'orders/:id', component: OrderDetailComponent },
      { path: 'inventory', component: InventoryComponent },
      { path: 'gift-cards', component: GiftCardsComponent },
      { path: 'promos', component: PromosComponent },
      { path: 'delivery-options', component: DeliveryOptionsComponent },
      { path: 'users', component: UsersListComponent },
      { path: 'users/:id', component: UserDetailComponent },
    ],
  },
];
