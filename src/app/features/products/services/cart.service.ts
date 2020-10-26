/// <reference path="../../../core/constants/api.constants.ts" />
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Store, StoreModule, select } from '@ngrx/store';
import { environment } from '../../../../environments/environment';
import { catchError, delay, tap, map } from 'rxjs/operators';
import { Observable, throwError, Subscription, Subject, BehaviorSubject, of } from 'rxjs';
import { AppState } from '../../../core/app.state';
import { CartItem, CartSummary, Product } from '../product.model';
import { cartServiceConstants } from '../../../core/constants/api.constants';

@Injectable()
export class CartService {

  cartSummary: CartSummary = {
    cart_qty: 0,
    cart_total: 0,
    total_payable: 0,
    discount: 0,
    cartItems: []
  }

  public CartItemsCount = new BehaviorSubject<CartSummary>(this.CurrentCartSummary()); 
  
  constructor( private http: HttpClient,) { 
   
  }
  public api_getCart () {
    return this.http.get(cartServiceConstants.getCart);
  }

  public api_addToCart(data) {
    return this.http.post(cartServiceConstants.addToCart, data);
  }

  public api_getCartCalculations(data) {
    return this.http.post(cartServiceConstants.getCartCalculations, data);
  }

  addToCart(item: CartItem): Observable<CartItem> {
   
    let localitems: CartItem[] = this.getCartItems();
  
    var _itemsfound = localitems.filter(function (cartItem) {
     
      return cartItem.product.product_Id ==  item.product.product_Id;
    });
 
    if (_itemsfound == null || _itemsfound.length == 0) {
     
      localitems.push(item)
    } else { 
      _itemsfound[0].count++
    }  
    this.setCartTotalCount(localitems);
    return of(item);
  }

  getCart(): Observable<CartItem[]> {
    let localitems: CartItem[] = this.getCartItems(); 
    return of(localitems);
  }

  cleanCart() { 
    this.setCartTotalCount([]); 
  }
 

  removeFromCart(id: number): Observable<CartItem[]> {
    let cart: CartItem[] = this.getCartItems();
    const newCart = cart.splice(id, 1);
    this.setCartTotalCount(cart);
    return of(newCart);
  }

  removeItem(id: number): void {
    let cart: CartItem[] = this.getCartItems();
    for (let i = 0; i < cart.length; i++) {
      let item: CartItem =  cart[i] ;
      if (item.product.product_Id   === id) {
        cart.splice(i, 1);
        break;
      }
    } 
    this.setCartTotalCount(cart);
  }

  private CurrentCartSummary(): CartSummary {
    let cartitems: CartItem[] = this.getCartItems();
    let cart_qty: number = 0;
    let cart_total: number = 0;
    let _count = 0, _price = 0;
    cartitems.forEach(a => {
      if (typeof (a.count) === 'string') {
        _count = parseInt(a.count);
      } else {
        _count = a.count
      }

      if (typeof (a.product.unit_price) === 'string') {
        _price = parseInt(a.product.unit_price);
      } else {
        _price = a.product.unit_price
      }

      cart_total += _price;
      cart_qty += _count;
    });
    this.cartSummary.cartItems = cartitems;
    this.cartSummary.cart_total = cart_total;
    this.cartSummary.cart_qty = cart_qty;
    return this.cartSummary;
  }

  private getCartItems(): CartItem[] {
    try {
      let cart: any[] = JSON.parse(localStorage.getItem('cart'))
      return cart|| [];
    } catch (err) {
      return [];
    }
  }
  setCartTotalCount(cartitems: CartItem[]): void { 
    localStorage.setItem('cart', JSON.stringify(cartitems)); 
    let cart_qty: number = 0;
    let cart_total: number = 0;
    let _count = 0, _price = 0;
    cartitems.forEach(a => {
      if (typeof (a.count) === 'string') {
        _count = parseInt(a.count);
      } else {
        _count = a.count
      }

      if (typeof (a.product.unit_price) === 'string') {
        _price = parseInt(a.product.unit_price);
      } else {
        _price = a.product.unit_price
      }

      cart_total += _price;
      cart_qty += _count;
    });
    this.cartSummary.cartItems = cartitems;
    this.cartSummary.cart_total = cart_total;
    this.cartSummary.cart_qty = cart_qty;
   
    this.CartItemsCount.next(this.cartSummary);
  }


  getCartTotalItems(): Observable<CartSummary> { 
    return this.CartItemsCount.asObservable();
  }

  increaseQuatity(productid) {
    let cart: CartItem[] = this.getCartItems();
    let position = cart.findIndex(x => x.product.product_Id == productid);
    if (position != -1) {
      cart[position].count++;

    }
    this.setCartTotalCount(cart); 
    return cart;
  }

  updateCart(productid, qty): Observable<boolean> { 
    let cart: CartItem[] = this.getCartItems();
  
    let position = cart.findIndex(x => x.product.product_Id == productid);
    if (position != -1) {
       
      cart[position].count = qty;
      
    }
     
    this.setCartTotalCount(cart);
    return of(true);
  }
  decreaseQuantity(productid) {
    let cart: CartItem[] = this.getCartItems();
    let position = cart.findIndex(x => x.product.product_Id == productid);

    if (position != -1) {
      cart[position].count--;
      if (cart[position].count-- < 1) {
         this.removeItem(productid);
      }

    }
    this.setCartTotalCount(cart);
    return cart;
  }
  ngOnDestroy() {
    this.CartItemsCount.unsubscribe();
  }
}
