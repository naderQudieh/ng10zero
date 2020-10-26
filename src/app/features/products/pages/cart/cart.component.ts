import {
  ViewEncapsulation,
  Injectable, AfterContentChecked, ChangeDetectorRef, Component, NgZone, OnInit, HostListener,
  ElementRef, Inject, ViewChild, ChangeDetectionStrategy, OnDestroy, AfterViewInit
} from '@angular/core';
import { fadeOut } from '../../../../core/animations/index';
import { style, animate, query, animation, animateChild, useAnimation, group, sequence, transition, state, trigger, query as q, stagger } from '@angular/animations';
import { ViewportScroller } from '@angular/common';
import { select, Store } from '@ngrx/store';
import { ScrollStrategy, Overlay, ViewportRuler, ConnectionPositionPair, CdkScrollable, CdkConnectedOverlay } from '@angular/cdk/overlay';
import { CdkVirtualScrollViewport, ScrollDispatcher } from '@angular/cdk/scrolling';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ROUTE_ANIMATIONS_ELEMENTS, routeAnimations } from '../../../../core/core.module';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { fromEvent, BehaviorSubject, Subject, Observable, throwError } from 'rxjs';
import { debounceTime, takeUntil, startWith, filter, tap, map, throttleTime, mergeMap, scan, retry } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { Validators, FormBuilder } from '@angular/forms';
import {
  CleanCart, GetCart, getCartState,
  AddToCart, GetProducts, ProductsState, CartState, selectProducts 
} from '../../store';
import { Product, CartItem } from '../../product.model';
import { CartService, CheckoutService, ProductService } from '../../services';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['../../products.component.scss'],
  animations: [ 
    trigger('fadeOut', [
      state('void', style({ opacity: 0, backgroundColor: 'red' })),
      transition(':leave', animate('400ms ease-in'))
    ])

  ],
   
  encapsulation: ViewEncapsulation.None
})
export class CartComponent implements OnInit, OnDestroy {
  cartQtyNumber = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  cartsList: CartItem[];
  cartQty: number;
  cartValue: number;
  constructor(private cartService: CartService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {  
    this.cartService.getCart().subscribe(cartitems => { 
      this.cartsList = cartitems;  
    })
    
    this.cartService.CartItemsCount.subscribe(cartsummary => { 
      this.cartValue = cartsummary.cart_total
      this.cartQty = cartsummary.cart_qty 
    })
  }


  ngOnDestroy() {
     
  }

  decreaseValue() {

  }

  increaseValue() {

  }

  updateCart(qty: any, cart: CartItem) { 
    let productid = cart.product.product_Id;
    let idxUpdate = -1;
    for (let i = 0; i < this.cartsList.length; i++) {
      if (this.cartsList[i].product.product_Id === cart.product.product_Id) {
        this.cartsList[i].count = qty;
        idxUpdate = i;
        break;
      }
    }
    if (idxUpdate > -1) {
      this.cartService.updateCart(productid, qty) 
    } 
    let cartNow = this.CurrentCartValueQty();
    this.cartValue = cartNow[0];
    this.cartQty = cartNow[1];
  }
  removeFromCart(event, cart: CartItem) { 
    let idxRemove = -1;
    for (let i = 0; i < this.cartsList.length; i++) {
      if (this.cartsList[i].product.product_Id === cart.product.product_Id) {
        idxRemove = i;
        break;
      } 
    } 
    if (idxRemove > -1) {
      this.cartService.removeItem(cart.product.product_Id);
      this.cartsList.splice(idxRemove, 1);
      let cartNow = this.CurrentCartValueQty(); 
      this.cartValue = cartNow[0];
      this.cartQty = cartNow[1];
    }  
  }

  
 
  private CurrentCartValueQty()  { 
    let sumValue: number = 0;
    let sumQty: number = 0;
    this.cartsList.forEach(a => {
      sumQty += a.count; 
      sumValue += (a.count * a.product.unit_price); 
    });
    return [sumValue || 0, sumQty || 0];
  }
}
