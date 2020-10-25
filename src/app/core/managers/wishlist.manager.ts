import { Injectable, EventEmitter } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../services/user.service';
import { AuthManager } from './auth.manager';
import { LocalStorage } from '../helpers/localStorage';
import { USER_API } from '../constants/api.constants';
import { ProductTransformer } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class WishlistManager {
  addProductMessage: string;
  removeProductMessage: string;
  wishlistUpdated: EventEmitter<any> = new EventEmitter<any>();
  constructor(
    private userService: UserService,
    private authManager: AuthManager,
    private toastr: ToastrService,
    private router: Router,
    private http: HttpClient,
    private localStorage: LocalStorage,
    private productAdapter: ProductTransformer
  ) {
    if (this.localStorage.getLang() === 'ar') {
      this.addProductMessage = 'تم إضافة المنتج إلى قائمة المفضلات بنجاح.';
      this.removeProductMessage = 'تمت إزالة المنتج من قائمة المفضلات بنجاح.';
    } else {
      this.addProductMessage = 'Product added to wishlist successfully.';
      this.removeProductMessage = 'Product removed successfully.';
    }
  }

  getWishlist() {
    return this.http.get(USER_API.wishlist)
    .pipe(map((data: any) => data.map(product => this.productAdapter.transform(product))));
  }

  addToWishlist(product) {
    if (this.authManager.getUserType() === 'CUSTOMER') {
      const data = {
        product_id: product.parent_id ? product.parent_id : product.product_Id,
        name: product.name
      };
      this.userService.addToWishlist(data).subscribe((res: any) => {
        if (res['Status'] === 'Success') {
          product.favourite = true;
          this.toastr.clear();
          this.toastr.success(this.addProductMessage);
          this.wishlistUpdated.emit();
        }
      });
    } else {
      this.toastr.info('Please log in to add items to wishlist');
    }
  }

  removeFromWishlist(product) {
    this.userService.removeFromWishList(product.product_Id).subscribe(res => {
      product.favourite = false;
      this.toastr.clear();
      this.toastr.success(this.removeProductMessage);
      this.wishlistUpdated.emit();
      // To reload data after removing one product
      if (this.router.url === '/user/wishlist') {
        this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
        this.router.navigate(['/user/wishlist']));
      }
    });
  }
}
