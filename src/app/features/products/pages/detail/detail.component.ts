import { Component, OnInit } from '@angular/core';
import {AppState} from 'src/app/core/app.state';
import {Store} from '@ngrx/store';
import {ActivatedRoute, Router} from '@angular/router';
import {GetProduct} from '../../store/product.actions';
import {AddToCart} from '../../store/cart.actions';
import { Product, Cart } from '../../product.model';
 

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.less']
})
export class DetailComponent implements OnInit {
  product$;
  currency = '₽';

  constructor(
      private store: Store<AppState>,
      private router: Router,
      private route: ActivatedRoute
  ) {
    this.store.dispatch(new GetProduct(this.route.snapshot.params.id));
    this.getProduct();
  }
  getProduct() {
    //this.product$ = this.store.select(selectSelectedProduct);
  }
  ngOnInit() {
  }

  addToCart(product: Product, count: number) {
    const cartProduct  = {
      product,
      count 
    };
    this.store.dispatch(new AddToCart(cartProduct));
  }
}
