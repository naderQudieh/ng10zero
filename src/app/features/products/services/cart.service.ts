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
    this.updateCartSummary(localitems);
    return of(item);
  }

  getCart(): Observable<CartItem[]> {
    let localitems: CartItem[] = this.getCartItems(); 
    return of(localitems);
  }

  cleanCart(): Observable<boolean> {
    this.updateCartSummary([]);
    return of(true);
  }
 

  removeFromCart(productid: number): Observable<number> {  
    let cartitems: CartItem[] = this.getCartItems(); 
    for (let i = 0; i < cartitems.length; i++) {
      let item: CartItem = cartitems[i] ;
      if (item.product.product_Id === productid) {
        cartitems.splice(i, 1);
        break;
      }
    } 
    this.updateCartSummary(cartitems);
    return of(productid);
  }

 

  private getCartItems(): CartItem[] {
    try {
      let cart: any[] = JSON.parse(localStorage.getItem('cart'))
      return cart|| [];
    } catch (err) {
      return [];
    }
  }
  updateCartSummary(cartitems: CartItem[]): void { 
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

      cart_total += (_count* _price);
      cart_qty += _count;
    });
    this.cartSummary.cartItems = cartitems;
    this.cartSummary.cart_total = cart_total;
    this.cartSummary.cart_qty = cart_qty; 
  }

  updateCart(productid, qty): Observable<boolean> {
   
    let cart: CartItem[] = this.getCartItems();

    let position = cart.findIndex(x => x.product.product_Id == productid);
 
    if (position != -1) {
      cart[position].count = qty;
    }

    this.updateCartSummary(cart);
    return of(true);
  }
  
  increaseQuatity(productid) {
    let cart: CartItem[] = this.getCartItems();
    let position = cart.findIndex(x => x.product.product_Id == productid);
    if (position != -1) {
      cart[position].count++;

    }
    this.updateCartSummary(cart); 
    return cart;
  }

 

  decreaseQuantity(productid) {
    let cart: CartItem[] = this.getCartItems();
    let position = cart.findIndex(x => x.product.product_Id == productid); 
    if (position > -1) {
      this.updateCart(productid, cart[position].count - 1).subscribe(isUpdated => {
        if (isUpdated) {
          this.updateCartSummary(cart);
          return cart;
        }
      }); 
    } 
  }
  ngOnDestroy() {
    //this.CartSummary.unsubscribe();
  }
}
