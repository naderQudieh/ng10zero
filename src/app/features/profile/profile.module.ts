import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ProfileComponent } from './profile.component';
import { PersonalInformationComponent } from './personal-information/personal-information.component';
import { WishlistComponent } from './wishlist/wishlist.component';
import { OrderHistoryComponent } from './order-history/order-history.component';
import { AddressBookComponent } from './address-book/address-book.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ProfileRoutingModule } from './profile-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { MaterialModule } from '../../shared/material/material.module';
import { SideBarComponent } from './side-bar/side-bar.component';
import { AddressFormComponent } from './address-form/address-form.component';
import { OrderDetailsComponent } from './order-details/order-details.component';


@NgModule({
  declarations: [
    ProfileComponent,
    PersonalInformationComponent,
    WishlistComponent,
    OrderHistoryComponent,
    AddressBookComponent,
    ChangePasswordComponent,
    SideBarComponent,
    AddressFormComponent,
    OrderDetailsComponent
  ],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    SharedModule,
    MaterialModule,
    RouterModule
  ]
})
export class ProfileModule { }
