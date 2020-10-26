import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { ConfirmationComponent } from './confirmation/confirmation.component';
import { PaymentComponent } from './payment/payment.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { CartItemComponent } from './shopping-cart/cart-item/cart-item.component';
import {  ProdcartComponent } from './shopping-cart/prodcart/prodcart.component';



const routes: Routes = [
  {
    path: 'cart',
    component: ShoppingCartComponent
  },
  {
    path: 'prodcart',
    component: ProdcartComponent
  },
  {
    path: 'cartitem',
    component: CartItemComponent
  },
  {
    path: 'payment',
    component: CheckoutComponent
  },
  {
    path: 'payment/confirmation',
    component: ConfirmationComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CheckoutRoutingModule { }
