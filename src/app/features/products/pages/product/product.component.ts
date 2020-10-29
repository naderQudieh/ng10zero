import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { ROUTE_ANIMATIONS_ELEMENTS, routeAnimations } from '../../../../core/core.module';
import { Product, CartItem } from '../../product.model';
import { AddToCart, GetProducts, RemoveFromCart, ProductsState, CartState, selectProducts } from '../../store';

@Component({
  animations: [routeAnimations],
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['../products.component.scss'],
})
export class ProductComponent implements OnInit {
  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;
  inCart = false;
  @Input() product: Product;

  constructor(private router: Router, private route: ActivatedRoute, private store: Store<CartState>) {

  }
  ngOnInit() {
    console.log(this.product);
  }


  addToCart(product: Product) {
    let count = 1;
    let _price = product.unit_price; 
    const cart: CartItem = {
      product: product,
      count: count,
      total_value: product.unit_price * count
    };
    
    this.store.dispatch(new AddToCart(cart));
  }
  removeFromCart(product: Product) {
    let id = product.product_Id
    this.store.dispatch(new RemoveFromCart(id));
  }
 

  navigateDetail(id: string) {
    this.router.navigate(['/products', id]);
  }


  getGUID() {
  var uuidValue = "", k, randomValue;
  for (k = 0; k < 32; k++) {
    randomValue = Math.random() * 16 | 0;

    if (k == 8 || k == 12 || k == 16 || k == 20) {
      uuidValue += "-"
    }
    uuidValue += (k == 12 ? 4 : (k == 16 ? (randomValue & 3 | 8) : randomValue)).toString(16);
  }
  return uuidValue;
}  
}
