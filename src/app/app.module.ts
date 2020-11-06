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
import { DropdownDirective} from './nav/dropdown.directive'
import { CarouselComponent } from './item/carousel/carousel.component';
import { RouterModule, Routes } from '@angular/router';
import { generalService } from './service/general.service';
import { itemService } from './item/item.service';
import { cartService } from './cart/cart.service';
import { catalogService } from './catalog/catalog.service';
import { purchasesService } from './purchases/purchases.service';

const appRoutes: Routes = [
  {path: 'item', component: ItemComponent},
  {path: 'item/:item', component: ItemComponent},
  {path: '', component: CatalogComponent},
  {path: 'cart', component: CartComponent},
  {path: 'purchaseHistory', component: PurchasesComponent},
  {path: 'settings', component: SettingsComponent}
];
@NgModule({
  declarations: [
    AppComponent,
    CatalogComponent,
    NavComponent,
    CartComponent,
    PurchasesComponent,
    SettingsComponent,
    ItemComponent,
    DropdownDirective,
    CarouselComponent
  ],
  imports: [
    FlexLayoutModule,
    BrowserModule,
    NgbModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [catalogService, cartService, itemService, generalService, purchasesService],
  bootstrap: [AppComponent]
})
export class AppModule { }