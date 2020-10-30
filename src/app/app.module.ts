import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CatalogComponent } from './catalog/catalog.component';
import { NavComponent } from './nav/nav.component';
import { CartComponent } from './cart/cart.component';
import { PurchasesComponent } from './purchases/purchases.component';
import { SettingsComponent } from './settings/settings.component';
// ...
import { FlexLayoutModule } from "@angular/flex-layout";
import { ItemComponent } from './item/item.component';
@NgModule({
  declarations: [
    AppComponent,
    CatalogComponent,
    NavComponent,
    CartComponent,
    PurchasesComponent,
    SettingsComponent,
    ItemComponent
  ],
  imports: [
    FlexLayoutModule,
    BrowserModule,
    NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
