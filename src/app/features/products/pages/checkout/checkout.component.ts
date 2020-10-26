import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { CheckoutService } from '../../services/checkout.service';
import { NgForm } from '@angular/forms';
import { SnackbarService, EventService } from 'src/app/core/services';
import { TranslateService } from '@ngx-translate/core';
import { Country, State } from '../../../../core/settings';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['../../products.component.scss'],
})
export class CheckoutComponent implements OnInit {
  selectedYY: number;
  mainform: FormGroup;
  totalPrice: number = 0.00;
  totalQuantity: number = 0;
  countries: Country[] = [];
  billingAddressStates: State[] = [];
  creditCardyears: number[] = [];
  creditCardMonths: number[] = [];


  constructor(private formBuilder: FormBuilder, public service: CheckoutService, private evnService: EventService,
    private snackbarService: SnackbarService, private fb: FormBuilder, private translate: TranslateService,) {


  }

  ngOnInit() {
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
        console.log(data);
        this.billingAddressStates = data;
      }
    )
  } 
  
 
   
  createForm() {
    this.mainform = this.formBuilder.group({
      creditCard: this.formBuilder.group({
        cardType: [''],
        card_holder_name: ['Nahed Kadih', [Validators.required]],
        card_number: ['1223-3245-6278-8290', [Validators.required, Validators.pattern('[0-9]{16}')]],
        card_cvv: [234, [Validators.required, Validators.pattern('[0-9]{3}')]],
        card_exp_mm: [3, [Validators.required]],
        card_exp_yy: [2021, [Validators.required]]

      }),
      billingAddress: this.formBuilder.group({
        address1: new FormControl('address1', [Validators.required, Validators.minLength(10)]),
        address2: new FormControl('address2', [Validators.required, Validators.minLength(1)]),
        zip: new FormControl('22312', [Validators.required, Validators.minLength(5)]),
        city: new FormControl('Orlando', [Validators.required]),
        state: ['VA', [Validators.required]] 
      }),
    })
  }

  SubmitForm(data: any): void {
    if (this.mainform.invalid) {
      this.mainform.markAllAsTouched();
    }
    console.log(data);
    let formdata = {
      card_holder_name: data.value.creditCard.card_holder_name,
      card_number: data.value.creditCard.card_number,
      card_exp_mm: data.value.creditCard.card_exp_mm,
      card_exp_yy: data.value.creditCard.card_exp_yy,
      card_cvv: data.value.creditCard.card_cvv,

      address1: data.value.billingAddress.address1,
      address2: data.value.billingAddress.address2,
      city: data.value.billingAddress.city,
      state: data.value.billingAddress.state,
      zip: data.value.billingAddress.zip

    }
    console.log(formdata);
    //this.updateRecord(formdata); 
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

 
  updateRecord(data: any) {
    this.service.putPaymentDetail().subscribe(
      res => { 
        this.service.refreshList();
        this.snackbarService.success('Successfull');
      },
      err => {
        this.snackbarService.error('An Error Occured');
        console.log(err);
      }
    );
  }
}
