import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartManager } from '../../../core/managers/cart.manager';
import { LocalStorage } from '../../../core/helpers/localStorage';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.scss']
})
export class ShoppingCartComponent implements OnInit {

  cartItems;

  constructor(
    public router: Router, 
    public cartManager: CartManager,
    public localStorage: LocalStorage
    ) {}

  ngOnInit() {
    this.cartManager.getCart();
  }
}
