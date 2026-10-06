import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ShopComponent } from './pages/shop/shop.component';
import { ProductDetailsComponent } from './pages/product-details/product-details.component';
import { TryOnComponent } from './pages/try-on/try-on.component';
import { CartComponent } from './pages/cart/cart.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { StorePageComponent } from './pages/store-page/store-page.component';
import { SellerDashboardComponent } from './pages/seller/seller-dashboard/seller-dashboard.component';
import { AuthGuard } from './services/auth.guard';
import { RoleGuard } from './services/role.guard';

// Dev/test routes kept but not shown in production navigation
import { TestViewerComponent } from './test-viewer/test-viewer.component';
import { ModelViewerComponent } from './components/model-viewer/model-viewer.component';

const routes: Routes = [
  // ── Public ──────────────────────────────────────────────────────────────
  { path: '', component: HomeComponent },
  { path: 'shop', component: ShopComponent },
  { path: 'product/:id', component: ProductDetailsComponent },
  { path: 'cart', component: CartComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'stores/:slug', component: StorePageComponent },

  // ── Authenticated ────────────────────────────────────────────────────────
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },

  // ── Seller ───────────────────────────────────────────────────────────────
  {
    path: 'seller',
    component: SellerDashboardComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['SELLER', 'ADMIN', 'SUPER_ADMIN'] },
  },

  // ── Admin (lazy, guards applied inside admin.routes.ts) ──────────────────
  {
    path: 'admin',
    loadChildren: () =>
      import('./admin/admin.module').then((m) => m.AdminModule),
  },

  // ── Dev/test routes ──────────────────────────────────────────────────────
  { path: 'test-3d', component: TestViewerComponent },
  { path: 'mod', component: ModelViewerComponent },

  // ── Fallback ─────────────────────────────────────────────────────────────
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}