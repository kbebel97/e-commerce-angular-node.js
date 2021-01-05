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
import { generalService } from './service/general.service';
import { cartService } from './cart/cart.service';
import { catalogService } from './catalog/catalog.service';
import { InvoiceComponent } from './invoice/invoice.component';
import { invoiceService } from './invoice/invoice.service';
import {FormsModule } from '@Angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import { AppRoutingModule } from './app-routing.module';
import { itemService } from './item/item.service';
import { MenuComponent } from './menu/menu.component';
import { HttpClientModule } from '@angular/common/http';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {ReactiveFormsModule} from  '@Angular/forms';
import { settingsService } from './settings/settings.service';
import { MatPaginatorModule} from '@Angular/material/paginator';
import { LoginComponent } from './auth/login/login.component';
import { authService } from './auth/auth.service';

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
    CarouselInvoiceComponent,
    MenuComponent,
    LoginComponent,

  ],
  imports: [
    FlexLayoutModule,
    BrowserModule,
    FormsModule,
    NgbModule,
    NoopAnimationsModule,
    MatFormFieldModule,
    MatSelectModule,
    AppRoutingModule,
    HttpClientModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    MatPaginatorModule
  ],
  providers: [catalogService, cartService, generalService, invoiceService, authService, itemService, settingsService],
  bootstrap: [AppComponent]
})

export class AppModule { }
