import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PersonalInformationComponent } from './personal-information/personal-information.component';
import { WishlistComponent } from './wishlist/wishlist.component';
import { OrderHistoryComponent } from './order-history/order-history.component';
import { AddressBookComponent } from './address-book/address-book.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ProfileComponent } from './profile.component';
import { AddressFormComponent } from './address-form/address-form.component';
import { OrderDetailsComponent } from './order-details/order-details.component';


const routes: Routes = [
  {
    path: '',
    component: ProfileComponent,
    children: [
      {
        path: '',
        component: PersonalInformationComponent
      },
      {
        path: 'details',
        component: PersonalInformationComponent
      },
      {
        path: 'change-password',
        component: ChangePasswordComponent
      },
      {
        path: 'address',
        component: AddressBookComponent
      },
      {
        path: 'address/add',
        component: AddressFormComponent
      },
      {
        path: 'address/:id',
        component: AddressFormComponent
      },
      {
        path: 'orders',
        component: OrderHistoryComponent
      },
      {
        path: 'orders/:id',
        component: OrderDetailsComponent
      },
      {
        path: 'wishlist',
        component: WishlistComponent
      },
      { path: '', redirectTo: 'account', pathMatch: 'full' },
      { path: '**', redirectTo: 'account', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }
