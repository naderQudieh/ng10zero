import {Injectable} from '@angular/core';
import {AuthManager} from './auth.manager';
import {CartService} from '../services/cart.service';
import {ToastrService} from 'ngx-toastr';
import {VariantProduct} from '../models/variant-product.model';
import {BehaviorSubject} from 'rxjs';
import { LocalStorage } from '../helpers/localStorage';

@Injectable({
  providedIn: 'root'
})

export class CartManager {
  addProductmessage: string;
  deleteProductmessage: string;
  updateProductmessage: string;
  public cartItems: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  public cartValues: BehaviorSubject<any> = new BehaviorSubject<any>({});

  constructor(
    private authManager: AuthManager,
    private cartService: CartService,
    private toastr: ToastrService,
    private localStorage: LocalStorage
    ) {
  }

  getCart() {
    if (this.localStorage.getLang() === 'ar') {
      this.addProductmessage = 'تم اضافة المنتج بنجاح';
      this.updateProductmessage = 'تم تحديث كمية المنتج بنجاح';
      this.deleteProductmessage = 'تمت إزالة المنتج بنجاح.';
    } else {
      this.addProductmessage = 'Product was added successfully',
      this.updateProductmessage = 'Product quantity updated successfully',
      this.deleteProductmessage = 'Product was removed successfully.';
    }
    if (this.authManager.getUserToken()) {
      this.cartService.getCart().subscribe((response: VariantProduct[]) => {
        if (response.length > 0) {
          this.cartItems.next(response);
          this.calculateCart();
        }
      });
    }
  }

  calculateCart(addressId = null, promoCode = null) {
    const requestData = {
      address_id: addressId ? Number(addressId) : null,
      promocode: promoCode
    };
    if (this.authManager.getUserToken()) {
      this.cartService.getCartCalculations(requestData).subscribe((response: any) => {
        this.cartValues.next(response);
      });
    }
  }

  async addToCart(data) {
    // Check user type, If Not an User, Create guest user
    if (!this.authManager.getUserToken()) {
      await this.authManager.createGuestUser();
    }
    this.cartService.addToCart(data).subscribe((response: any) => {
      this.cartItems.next(response);
      this.calculateCart();
      this.toastr.clear();
      this.toastr.success(this.addProductmessage);
    });
  }

  removeCartItem(item) {
    const requestBody = [
      {
        id: item.id,
        cart_item_id: item.cart_item_id ? item.cart_item_id : null,
        qty: 0
      }
    ];

    this.cartService.addToCart(requestBody).subscribe((response: any) => {
      this.cartItems.next(response);
      this.calculateCart();
      this.toastr.clear();
      this.toastr.success(this.deleteProductmessage);
    });
  }

  modifyItemQty(item, quantity) {
    const data = [{id: item.id, qty: quantity}];
    this.cartService.addToCart(data).subscribe((response: any) => {
      this.cartItems.next(response);
      this.calculateCart();
      this.toastr.clear();
      this.toastr.success(this.updateProductmessage);
    });
  }

}
