import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './services/auth.interceptor';
import { AppRoutingModule } from './app-routing.module';
import { DollyGalleryComponent } from './components/dolly-gallery/dolly-gallery.component';
import { FlexCarouselComponent } from './components/flex-carousel/flex-carousel.component';
import { SidebarNavComponent } from './layout/sidebar-nav/sidebar-nav.component';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { BlurTextComponent } from './shared/blur-text/blur-text.component';
import { DitherVeilComponent } from './shared/dither-veil/dither-veil.component';
import { DriftWallComponent } from './shared/drift-wall/drift-wall.component';
import { LiquidEtherComponent } from './shared/liquid-ether/liquid-ether.component';
import { ShopComponent } from './pages/shop/shop.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IntroComponent } from './components/intro/intro.component';
import { ProductDetailsComponent } from './pages/product-details/product-details.component';
import { TryOnComponent } from './pages/try-on/try-on.component';
import { CartComponent } from './pages/cart/cart.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { ModelViewerComponent } from './components/model-viewer/model-viewer.component';
import { TestViewerComponent } from './test-viewer/test-viewer.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { StorePageComponent } from './pages/store-page/store-page.component';
import { SellerDashboardComponent } from './pages/seller/seller-dashboard/seller-dashboard.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ShopComponent,
    IntroComponent,
    ProductDetailsComponent,
    TryOnComponent,
    CartComponent,
    ProfileComponent,
    ModelViewerComponent,
    LoginComponent,
    RegisterComponent,
    StorePageComponent,
    SellerDashboardComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    DollyGalleryComponent,
    FlexCarouselComponent,
    SidebarNavComponent,
    BlurTextComponent,
    DitherVeilComponent,
    DriftWallComponent,
    LiquidEtherComponent
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
