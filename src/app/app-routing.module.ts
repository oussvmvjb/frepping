import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ShopComponent } from './pages/shop/shop.component';
/*import { ShopComponent } from './pages/shop/shop.component';
import { ProductDetailsComponent } from './pages/product-details/product-details.component';
import { TryOnComponent } from './pages/try-on/try-on.component';
import { CartComponent } from './pages/cart/cart.component';
import { ProfileComponent } from './pages/profile/profile.component';
*/
const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'shop', component: ShopComponent },
  /*{ path: 'product/:id', component: ProductDetailsComponent },
  { path: 'try-on', component: TryOnComponent },
  { path: 'cart', component: CartComponent },
  { path: 'profile', component: ProfileComponent },*/
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }