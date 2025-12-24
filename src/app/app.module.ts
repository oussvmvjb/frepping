import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { ShopComponent } from './pages/shop/shop.component';
import { BottomNavComponent } from './pages/bottom-nav/bottom-nav.component';
import { FormsModule } from '@angular/forms';
import { IntroComponent } from './components/intro/intro.component';
import { ProductDetailsComponent } from './pages/product-details/product-details.component';
import { TryOnComponent } from './pages/try-on/try-on.component';
import { CartComponent } from './pages/cart/cart.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { ModelViewerComponent } from './components/model-viewer/model-viewer.component';
import { TestViewerComponent } from './test-viewer/test-viewer.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ShopComponent,
    BottomNavComponent,
    IntroComponent,
    ProductDetailsComponent,
    TryOnComponent,
    CartComponent,
    ProfileComponent,
    ModelViewerComponent,
    TestViewerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
