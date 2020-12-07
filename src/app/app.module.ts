import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CatalogComponent } from './catalog/catalog.component';
import { NavComponent } from './nav/nav.component';
import { CartComponent } from './cart/cart.component';
import { SettingsComponent } from './settings/settings.component';
import { FlexLayoutModule } from "@angular/flex-layout";
import { ItemComponent } from './item/item.component';
import { DropdownDirective} from './nav/dropdown.directive'
import { CarouselComponent } from './item/carousel/carousel.component';
import { CarouselInvoiceComponent} from './invoice/carousel-invoice/carousel-invoice.component'
import { RouterModule, Routes } from '@angular/router';
import { generalService } from './service/general.service';
import { itemService } from './item/item.service';
import { cartService } from './cart/cart.service';
import { catalogService } from './catalog/catalog.service';
import { InvoiceComponent } from './invoice/invoice.component';
import { invoiceService } from './invoice/invoice.service';
import {FormsModule } from '@Angular/forms';


const appRoutes: Routes = [
  {path: 'item', component: ItemComponent},
  {path: 'item/:item', component: ItemComponent},
  {path: '', component: CatalogComponent},
  {path: 'cart', component: CartComponent},
  {path: 'purchaseHistory', component: InvoiceComponent},
  {path: 'settings', component: SettingsComponent}
];
@NgModule({
  declarations: [
    AppComponent,
    CatalogComponent,
    NavComponent,
    CartComponent,
    SettingsComponent,
    ItemComponent,
    DropdownDirective,
    CarouselComponent,
    InvoiceComponent,
    CarouselInvoiceComponent
  ],
  imports: [
    FlexLayoutModule,
    BrowserModule,
    FormsModule,
    NgbModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [catalogService, cartService, itemService, generalService, invoiceService],
  bootstrap: [AppComponent]
})
export class AppModule { }
