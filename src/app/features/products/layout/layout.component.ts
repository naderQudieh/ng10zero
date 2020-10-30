import { Component, OnInit, Inject, ChangeDetectorRef, ChangeDetectionStrategy, OnDestroy, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTE_ANIMATIONS_ELEMENTS, routeAnimations } from '../../../core/core.module'; 
import { select, Store } from '@ngrx/store';
import { fromEvent, BehaviorSubject, Subject, Observable, throwError } from 'rxjs';
import { debounceTime, takeUntil, startWith, filter, tap, map, throttleTime, mergeMap, scan } from 'rxjs/operators';
import {
  CleanCart,GetCart,getCartState,
  AddToCart, GetProducts, ProductsState, CartState, selectProducts  
} from '../store';
import { Product, CartItem , CartSummary} from '../product.model';
import { CartService, CheckoutService, ProductService } from '../services';
import { EventService } from "src/app/core/services";

@Component({
  selector: 'anms-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['../pages/products.component.scss'],
  animations: [routeAnimations] 
})
export class LayoutComponent implements OnInit {
  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;
  totalItems: number = 0;
  constructor(private cdRef: ChangeDetectorRef, private store: Store<CartState>,
    private cartService: CartService, private checkoutService: CheckoutService, private productService: ProductService,
     private router: Router ) {  

    cartService.getCartSummary().subscribe((cartSummary) => {
      this.totalItems = cartSummary.cart_qty;
      console.log(this.totalItems); 
    });

    this.store.select(getCartState).subscribe(cart => {
      console.log(cart)
    });

  }

  ngOnInit(): void {
    
  }
  GoProducts() {
    if (this.totalItems == 0) {
      this.router.navigateByUrl('/products');
    } else {
      this.router.navigateByUrl('/products/cart');
    }
   
  }
  CleanCart() { 
    this.store.dispatch(new CleanCart());
  }

  
}
