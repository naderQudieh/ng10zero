import { ViewEncapsulation, Injectable, AfterContentChecked, ChangeDetectorRef, Component, NgZone, OnInit, HostListener,
  ElementRef, Inject, ViewChild, ChangeDetectionStrategy, OnDestroy, AfterViewInit
} from '@angular/core';
import { fadeOut } from '../../../../core/animations/index';
import { style, animate, query, animation, animateChild, useAnimation, group, sequence, transition, state, trigger, query as q, stagger } from '@angular/animations';
import { ViewportScroller } from '@angular/common';
import { select, Store, ActionsSubject  } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { concatMapTo, catchError, switchMap, delay,debounceTime, takeUntil, startWith, filter, tap, map, throttleTime, mergeMap, scan, retry } from 'rxjs/operators';
import { fromEvent,Observable, throwError, Subscription, Subject, BehaviorSubject, of } from 'rxjs';
import { ScrollStrategy, Overlay, ViewportRuler, ConnectionPositionPair, CdkScrollable, CdkConnectedOverlay } from '@angular/cdk/overlay';
import { CdkVirtualScrollViewport, ScrollDispatcher } from '@angular/cdk/scrolling';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ROUTE_ANIMATIONS_ELEMENTS, routeAnimations } from '../../../../core/core.module';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll'; 
import { Validators, FormBuilder } from '@angular/forms';
import {
  AddToCartSuccess, ECartActions, UpdateCartQty, UpdateCartQtySuccess,
  GetCartSuccess, LoadCartInError, RemoveFromCart, CleanCartSuccess, RemoveFromCartSuccess
} from '../../store/cart.actions';
import { CleanCart, GetCart, getCartState, AddToCart, GetProducts, ProductsState, CartState, selectProducts } from '../../store';
import { Product, CartItem, CartSummary} from '../../product.model';
import { CartEffects, ProductEffects, CheckoutEffects } from '../../store' 

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['../products.component.scss'],
  animations: [ 
    trigger('fadeOut', [
      state('void', style({ opacity: 0, backgroundColor: 'gray' })),
      transition(':leave', animate('400ms ease-in'))
    ])

  ], 
  encapsulation: ViewEncapsulation.None
})
export class CartComponent implements OnInit  {
  cartQtyNumber = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] 
  cartSummary = {
    customer_id: 0,
    cart_total: 0,
    cart_qty: 0,
    discount: 0,
    total_payable: 0,
    cartItems: []
  }
  subsc = new Subscription();
  public RemoveSuccess$: Observable<RemoveFromCartSuccess>
  constructor(  private router: Router, private actionsSubject: ActionsSubject , private cartEffects: CartEffects, private store: Store<CartState>, private cdRef: ChangeDetectorRef,  private formBuilder: FormBuilder) {
   
  }

  ngOnInit(): void {   
    this.store.pipe(select(getCartState)).subscribe(data => {
      this.cartSummary.cartItems = [];  
      this.cdRef.detectChanges(); 
      this.cartSummary = Object.assign({}, data['cart']);
      this.cdRef.detectChanges(); 
    });
   
      //this.subsc = this.actionsSubject.pipe( ofType(ECartActions.RemoveFromCartSuccess)).subscribe(data => {
      //   let product_id =  data['payload'] ;
      //}); 
  }

  updateCart(qty: any, cart: CartItem) { 
    let _qty = 0;
    if (typeof (qty) === 'string') {
      _qty = parseInt(qty);
    } else {
      _qty = qty
    }
    let productid = cart.product.product_Id;
    this.store.dispatch(new UpdateCartQty({ id: cart.product.product_Id, qty: _qty }));
  }

  removeFromCart(event, cart: CartItem) { 
    let idxRemove = -1;
    for (let i = 0; i < this.cartSummary.cartItems.length; i++) {
      if (this.cartSummary.cartItems[i].product.product_Id === cart.product.product_Id) {
        idxRemove = i;
        break;
      }
    }
    if (idxRemove > -1) { 
      this.cartSummary.cartItems.splice(idxRemove, 1);
    }
    of('dummy').pipe(delay(200)).subscribe(val => {
      this.store.dispatch(new RemoveFromCart(cart.product.product_Id));
    });
   
  }
 
  decreaseValue() {

  }

  increaseValue() {

  }


  GoCheckOut() {
    
    this.router.navigate(['/products/checkout']); 
  }
}
