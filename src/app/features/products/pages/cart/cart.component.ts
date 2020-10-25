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
import { Product, Cart } from '../../product.model';
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
  cartsList: Cart[];
  cartQty: number;
  cartValue: number;
  constructor(private cartService: CartService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {  
    this.cartService.getCart().subscribe(cartitems => {
      console.log(cartitems);
      this.cartsList = cartitems; 
      this.cartQty = this.CurrentCartQty();
      this.cartValue = this.CurrentCartValue();
    })
    
    this.cartService.CartItemsCount.subscribe(total => {
      console.log(total);
      this.cartQty = this.CurrentCartQty();
      this.cartValue = this.CurrentCartValue();
    })
  }


  ngOnDestroy() {
     
  }

  decreaseValue() {

  }

  increaseValue() {

  }

  updateCart(qty: any, cart: Cart) { 
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
      this.cartQty = this.CurrentCartQty();
      this.cartValue = this.CurrentCartValue();
    } 
   
  }
  removeFromCart(event, cart: Cart) { 
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
      this.cartQty = this.CurrentCartQty();
      this.cartValue = this.CurrentCartValue();
    }  
  }

  private CurrentCartQty(): number {
    let sumValue: number = 0;
    this.cartsList.forEach(a => sumValue += (a.count));
    return sumValue || 0;
  }
 
  private CurrentCartValue(): number { 
    let sumValue: number = 0;
    this.cartsList.forEach(a => sumValue += (a.count*a.product.price) );
    return sumValue || 0;
  }
}
