import { Component, OnInit } from '@angular/core';
import {
  CleanCart, GetCart, getCartState,
  AddToCart, GetProducts, ProductsState, CartState, selectProducts
} from '../../store';
import { Product, CartItem } from '../../product.model';
import { CartService, CheckoutService, ProductService } from '../../services';

@Component({
  selector: 'app-checkout-confirmation',
  templateUrl: './checkout-confirmation.component.html',
  styleUrls: ['../../products.component.scss'],
})
export class CheckoutConfirmationComponent implements OnInit {

  cartQtyNumber = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  cartsList: CartItem[];
  cartQty: number;
  cartValue: number;
  confirmation = "";

  constructor(
    public cartService: CartService
  ) { }

  ngOnInit(): void {
    this.cartService.getCart().subscribe(cartitems => {
      this.cartsList = cartitems;
    })

    this.cartService.CartItemsCount.subscribe(cartsummary => {
      this.cartValue = cartsummary.cart_total
      this.cartQty = cartsummary.cart_qty
    })
  }

  getinfos(){
    //this.confirmation = this.cartService.transaction.transactionConfirmation;
    //if (this.cartService.getUserSocial()){
    //  this.social = true;
    //}
  }


  notify(message){
    this.getinfos();
    alert(message);
  }

}
