import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CheckoutService } from '../../../core/services/checkout.service';
import { CartManager } from '../../../core/managers/cart.manager';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { LocalStorage } from '../../../core/helpers/localStorage';

@Component({
  selector: 'app-promocode',
  templateUrl: './promocode.component.html',
  styleUrls: ['./promocode.component.scss']
})
export class PromocodeComponent implements OnInit {

  @Output() showShippingInfo: EventEmitter<any> = new EventEmitter<any>();
  @Input() shippingInformation;
  promoCode = '';

  constructor(private checkoutService: CheckoutService ,
    public cartManager: CartManager,
    private toastr: ToastrService,
    private router: Router,
    public localStorage: LocalStorage) { }

  
  validatePromoCode() {
    this.checkoutService.activatePromocode({ code: this.promoCode }).subscribe(res => {
      this.toastr.success(res?.message || this.localStorage.getLang() === 'en' ? 'Promo Code applied successfully' : 'تم تطبيق الرمز الترويجي بنجاح');
      this.cartManager.calculateCart(this.shippingInformation.addressId, this.promoCode);
    }, (err) => {
      this.promoCode = '';
      // this.toastr.error(err?.message || this.localStorage.getLang() === 'en' ? 'Invalid Promo Code' : 'الرمز الترويجي غير صالح');
    });
  }


  ngOnInit(): void {
  }

}
