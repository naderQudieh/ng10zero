import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { CheckoutRoutingModule } from './checkout-routing.module';
import { PaymentComponent } from './payment/payment.component';
import { ConfirmationComponent } from './confirmation/confirmation.component';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { CartItemComponent } from './shopping-cart/cart-item/cart-item.component';
import { ShippingInformationComponent } from './shipping-information/shipping-information.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CheckoutStepperComponent } from './checkout-stepper/checkout-stepper.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { ProdcartComponent } from './shopping-cart/prodcart/prodcart.component';
import { PromocodeComponent } from './promocode/promocode.component';


@NgModule({
  declarations: [
    PaymentComponent,
    ConfirmationComponent,
    ShoppingCartComponent,
    ShippingInformationComponent,
    CartItemComponent,
    CheckoutStepperComponent,
    CheckoutComponent,
    ProdcartComponent,
    PromocodeComponent
  ],
  imports: [
    CommonModule,
    CheckoutRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ],
  exports: [
    SharedModule
  ]
})
export class CheckoutModule { }
