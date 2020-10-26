import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { CartManager } from '../../../core/managers/cart.manager';
import { ToastrService } from 'ngx-toastr';
import { CheckoutService } from '../../../core/services/checkout.service';
import { Router } from '@angular/router';
import { LocalStorage } from '../../../core/helpers/localStorage';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {

  @Output() showShippingInfo: EventEmitter<any> = new EventEmitter<any>();
  @Input() shippingInformation;
  @Input() item;

  promoCode = '';
  paymentMethod = 'CASH';

  constructor(
    
    public cartManager: CartManager,
    private toastr: ToastrService,
    private checkoutService: CheckoutService,
    private router: Router,
    public localStorage: LocalStorage
  ) { }

  ngOnInit(): void {
    this.cartManager.getCart();
  }

  

  goToShipping() {
    this.showShippingInfo.emit(0);
  }

  validatePromoCode() {
    this.checkoutService.activatePromocode({ code: this.promoCode }).subscribe(res => {
      this.toastr.success(res?.message || this.localStorage.getLang() === 'en' ? 'Promo Code applied successfully' : 'تم تطبيق الرمز الترويجي بنجاح');
      this.cartManager.calculateCart(this.shippingInformation.addressId, this.promoCode);
    }, (err) => {
      this.promoCode = '';
      // this.toastr.error(err?.message || this.localStorage.getLang() === 'en' ? 'Invalid Promo Code' : 'الرمز الترويجي غير صالح');
    });
  }

  paymentMethodChanged(method) {
    this.paymentMethod = method;
  }

  placeOrder() {
    const requestData = {
      name: this.shippingInformation.contact.name,
      email: this.shippingInformation.contact.email,
      phone: this.shippingInformation.contactForm?.phone,
      address_id: this.shippingInformation.addressId,
      payment_method: this.paymentMethod,
      promocode: this.promoCode
    };

    this.checkoutService.checkout(requestData).subscribe(res => {
      this.cartManager.cartItems.next([]);
      this.cartManager.cartValues.next({});
      this.router.navigateByUrl('payment/confirmation');
    });
  }

}
