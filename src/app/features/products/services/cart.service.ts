/// <reference path="../../../core/constants/api.constants.ts" />
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Store, StoreModule, select } from '@ngrx/store';
import { environment } from '../../../../environments/environment';
import { catchError, delay, tap, map } from 'rxjs/operators';
import { Observable, throwError, Subscription, Subject, BehaviorSubject, of } from 'rxjs';
import { AppState } from '../../../core/app.state';
import { Cart, Product } from '../product.model';
import { cartServiceConstants } from '../../../core/constants/api.constants';

@Injectable()
export class CartService {
  public CartItemsCount = new BehaviorSubject<number>(this.CurrentCartTotalCount()); 
  
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

  addToCart(item: Cart): Observable<Cart> {
    console.log(item);
    let localitems: Cart[] = this.getCartItems();
    console.log(localitems);
    var _itemsfound = localitems.filter(function (cartItem) {
      console.log(cartItem);
      return cartItem.product.product_Id ==  item.product.product_Id;
    });
    console.log(_itemsfound);
    if (_itemsfound == null || _itemsfound.length == 0) {
     
      localitems.push(item)
    } else { 
      _itemsfound[0].count++
    }  
    this.setCartTotalCount(localitems);
    return of(item);
  }

  getCart(): Observable<Cart[]> {
    let localitems: Cart[] = this.getCartItems(); 
    return of(localitems);
  }

  cleanCart() { 
    this.setCartTotalCount([]); 
  }
 

  removeFromCart(id: number): Observable<Cart[]> {
    let cart: Cart[] = this.getCartItems();
    const newCart = cart.splice(id, 1);
    this.setCartTotalCount(cart);
    return of(newCart);
  }

  removeItem(id: number): void {
    let cart: Cart[] = this.getCartItems();
    for (let i = 0; i < cart.length; i++) {
      let item: Cart =  cart[i] ;
      if (item.product.product_Id   === id) {
        cart.splice(i, 1);
        break;
      }
    } 
    this.setCartTotalCount(cart);
  }

  private CurrentCartTotalCount(): number {
    let cart: Cart[] = this.getCartItems();
    let sum: number = 0;
    let _count = 0;
    cart.forEach(a => {
      if (typeof (a.count) === 'string') {
        _count = parseInt(a.count);
      } else {
        _count = a.count
      }

      sum += _count;
    });
    return sum || 0; 
  }

  private getCartItems(): Cart[] {
    try {
      let cart: any[] = JSON.parse(localStorage.getItem('cart'))
      return cart|| [];
    } catch (err) {
      return [];
    }
  }
  setCartTotalCount(cart: Cart[]): void { 
    localStorage.setItem('cart', JSON.stringify(cart));
    let sum: number = 0;
    let _count = 0;
    cart.forEach(a => {
      if (typeof (a.count) === 'string') {
        _count = parseInt(a.count);
      } else {
        _count = a.count
      }
     
      sum += _count;
    });
   
    this.CartItemsCount.next(sum);
  }


  getCartTotalItems(): Observable<number> { 
    return this.CartItemsCount.asObservable();
  }

  increaseQuatity(productid) {
    let cart: Cart[] = this.getCartItems();
    let position = cart.findIndex(x => x.product.product_Id == productid);
    if (position != -1) {
      cart[position].count++;

    }
    this.setCartTotalCount(cart); 
    return cart;
  }

  updateCart(productid, qty): Observable<boolean> { 
    let cart: Cart[] = this.getCartItems();
  
    let position = cart.findIndex(x => x.product.product_Id == productid);
    if (position != -1) {
       
      cart[position].count = qty;
      
    }
     
    this.setCartTotalCount(cart);
    return of(true);
  }
  decreaseQuantity(productid) {
    let cart: Cart[] = this.getCartItems();
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
