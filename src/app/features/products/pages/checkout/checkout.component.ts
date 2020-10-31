import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { CheckoutService } from '../../services/checkout.service';
import { NgForm } from '@angular/forms';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { MatStepper } from '@angular/material/stepper';
import { catchError, delay, tap, map } from 'rxjs/operators';
import { Observable, throwError, Subscription, Subject, BehaviorSubject, of } from 'rxjs';
import { SnackbarService, EventService } from 'src/app/core/services';
import { TranslateService } from '@ngx-translate/core';
import { Country, State } from '../../../../core/settings';
import { Router } from '@angular/router';
import { Product, CartItem, CartSummary } from '../../product.model';
import { select, Store, ActionsSubject } from '@ngrx/store';
import { CleanCart, GetCart, getCartState, AddToCart, GetProducts, ProductsState, CartState, selectProducts } from '../../store';
import { AppState } from '../../../../core/app.state';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['../products.component.scss'],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: { showError: true }
  }]
})
export class CheckoutComponent implements OnInit {
  AddressFormGroup: FormGroup;
  CreditCardFormGroup: FormGroup;
  PlaceOrderSummary: any = {
    sub_total_qty: 10,
    sub_total_price: 920.38,
    card_number_last4: 8290,
    shipping_address: 'shipping_address'
  }
  selectedYY: number; 
  totalPrice: number = 0.00;
  totalQuantity: number = 0;
  countries: Country[] = [];
  billingAddressStates: State[] = [];
  creditCardyears: number[] = [];
  creditCardMonths: number[] = []; 
  orderData: CartSummary;
  private subscription: Subscription = new Subscription();
  constructor(private store: Store<CartState>, private router: Router,private formBuilder: FormBuilder, public service: CheckoutService, private evnService: EventService,
    private snackbarService: SnackbarService,   private fb: FormBuilder, private translate: TranslateService,) {


  }

  ngOnInit() {
  
    this.subscription.add(
      this.store
        .pipe(select((state: CartState) => state))
        .subscribe(cartstate => {
          this.orderData = cartstate;
        })
    );

    this.createForm(); 
    // populate the credit card Month
    const startMonth: number = new Date().getMonth() + 1;
    this.evnService.getCreditCardMonths().subscribe(
      data => { 
        this.creditCardMonths = data
      }
    );

    // populate the credit card Year
    this.evnService.getCreditCardYears().subscribe(
      data => { 
        this.creditCardyears = data
      }
    );

    // populate the countries credit card
    this.evnService.getCountries().subscribe(
      data => { 
        this.countries = data;
      }
    )

    this.evnService.getStates().subscribe(
      data => {
        //console.log(data);
        this.billingAddressStates = data;
      }
    )
  } 
  
 
   
  createForm() {

    this.AddressFormGroup = this.formBuilder.group({
      address1: new FormControl('My address1', [Validators.required, Validators.minLength(5)]),
      address2: new FormControl('My address2', [Validators.required, Validators.minLength(1)]),
      zip: new FormControl(22312, [Validators.required, Validators.minLength(3)]),
      city: new FormControl('Orlando', [Validators.required]),
      state: ['VA', [Validators.required]]
    });
    this.CreditCardFormGroup = this.formBuilder.group({
      cardType: [''],
      card_holder_name: ['Nahed Kadih', [Validators.required]],
      card_number: ['1223-3245-6278-8290', [Validators.required]],
      card_cvv: [234, [Validators.required, Validators.pattern('[0-9]{3}')]],
      card_exp_mm: [3, [Validators.required]],
      card_exp_yy: [2021, [Validators.required]]
    });
   
  }

  SubmitForm(): void {

    let address1 = this.AddressFormGroup ;
    if (address1.invalid) {
       address1.markAllAsTouched();
    }
    if (address1.invalid) {
      return;
    }

    let creditdata = this.CreditCardFormGroup;
    if (creditdata.invalid) {
      creditdata.markAllAsTouched();
    }
    if (creditdata.invalid) {
      return;
    }

    if (creditdata.valid && address1.valid) {
     
      let formdata = {

        card_holder_name: creditdata.value.card_holder_name,
        card_number: creditdata.value.card_number,
        card_exp_mm: creditdata.value.card_exp_mm,
        card_exp_yy: creditdata.value.card_exp_yy,
        card_cvv: creditdata.value.card_cvv, 

        address1: address1.value.address1,
        address2: address1.value.address2,
        city: address1.value.city,
        state: address1.value.state,
        zip: address1.value.zip 
      }
      console.log(formdata);
     // this.store.dispatch(new ClearCart());
      this.updateRecord(formdata); 
    }
    
  }
  GoToConfirmation() { 
    this.router.navigateByUrl('/products/ckoutConfirmation'); 
  }

  updateRecord(data: any) {
      this.evnService.showSpinner(); 
      this.service.putPaymentDetail(data).subscribe(
      res => { 
          this.snackbarService.info('Wait for confirmation'); 
          of(true).pipe(delay(1500)).subscribe(res => {
            this.snackbarService.success('Your order was successfully placed');
          });
          of(true).pipe(delay(1000)).subscribe(res => {
             this.evnService.hideSpinner();
             this.GoToConfirmation();
        });
        
      },
      err => {
        this.evnService.hideSpinner();
        this.snackbarService.error('An Error Occured');
        console.log(err);
      }
    );
  }
  chargeCreditCard(formdata) {
    (<any>window).Stripe.card.createToken(
      {
        number: formdata.card_number,
        exp_month: formdata.card_exp_mm,
        exp_year: formdata.card_exp_yy,
        cvc: formdata.card_cvv
      },
      (status: number, response: any) => {
        if (status === 200) {
          const token = response.id;
          if (token != null) {
            //this.chargeCard(token);
            localStorage.setItem("currentUserPayment", JSON.stringify(token));

            setTimeout(() => {
              //this.deleteCredentials();
            }, 6000);
            //this.msg = "Your Transaction is success";
            //            this.logisticService.setSlot(this.slotDetails);

            //           this.logisticService
            // .setOrderDetails(this.orderDetails)
            // .subscribe(data => {});

          }
          //this.orderId = this.orderDetails.orderId;

          if (token == null) {
            //this.msg = "Payment failure! Plase Check Your Internet Connection";
          }
        } else {
          //this.msg1 = "Payment Failure! Please Enter valid Credentials ";
        }
      }
    );
  }

  goBack(stepper: MatStepper) {
    stepper.previous();
  }

  goForward(stepper: MatStepper) { 
    stepper.next();
    console.log(stepper.selectedIndex);
    if (stepper.selectedIndex==2) {
      this.PlaceOrderSummary =  {
        sub_total_qty:  10 ,
        sub_total_price:  920.38 ,
        card_number_last4:  8290  ,
        shipping_address:  'shipping_address' 
      } ; 
    }
   
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
