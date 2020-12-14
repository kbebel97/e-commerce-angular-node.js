import { NgModule } from '@angular/core'
import { Router, RouterModule, Routes } from '@angular/router'
import { CartComponent } from './cart/cart.component';
import { CatalogComponent } from './catalog/catalog.component';
import { InvoiceComponent } from './invoice/invoice.component';
import { ItemComponent } from './item/item.component';
import { LoginComponent } from './login/login.component';
import { MenuComponent } from './menu/menu.component';
// import { MenuComponent } from './menu/menu.component';
import { SettingsComponent } from './settings/settings.component';

const appRoutes: Routes = [
  {path: '', redirectTo: '/login', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'item', component: ItemComponent},
  {path: 'item/:item', component: ItemComponent},
  {path: 'catalog', component: CatalogComponent},
  {path: 'cart', component: CartComponent},
  {path: 'purchaseHistory', component: InvoiceComponent},
  {path: 'settings', component: SettingsComponent},
  {path: 'menus', component: MenuComponent, children: [
    {path: 'catalog', component: CatalogComponent},
    {path: 'cart', component: CartComponent},
    {path: 'purchaseHistory', component: InvoiceComponent},
    {path: 'settings', component: SettingsComponent}
  ]}
  // {path: 'menus/:email', component: MenuComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})

export class AppRoutingModule {

}
