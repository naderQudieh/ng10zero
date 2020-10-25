import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { CheckoutService } from '../../services/checkout.service';
import { NgForm } from '@angular/forms';
import { SnackbarService, GlobalService } from 'src/app/core/services';
import { TranslateService } from '@ngx-translate/core';
import { Country, State } from '../../product.model';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['../../products.component.scss'],
})
export class CheckoutComponent implements OnInit {
  selectedYY: number;
  mainform: FormGroup;
  checkoutFormGroup: FormGroup;
  totalPrice: number = 0.00;
  totalQuantity: number = 0;
  countries: Country[] = [];
  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];

  constructor(private formBuilder: FormBuilder,public service: CheckoutService, private gService: GlobalService,
    private snackbarService: SnackbarService, private fb: FormBuilder, private translate: TranslateService,) {


  }

  ngOnInit() {
    this.createForm();

    // populate the credit card Month
    const startMonth: number = new Date().getMonth() + 1;
    this.luv2ShopFormService.getCreditCardMonth(startMonth).subscribe(
      data => { this.creditCardMonths = data }
    );

    // populate the credit card Year
    this.luv2ShopFormService.getCreditCardYears().subscribe(
      data => {
        this.creditCardyears = data
      }
    );

    // populate the countries credit card
    this.luv2ShopFormService.getCountries().subscribe(
      data => {
        this.countries = data;
      }
    )
  } 
  
 
   
  createForm() {
    this.mainform = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: [''],
        lastName: [''],
        email: ['']
      }),
      billingAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        state: [''],
        country: [''],
        zipCode: ['']

      }),
      creditCard: this.formBuilder.group({
        cardType: [''],
        cardOwner: ['', [Validators.required]],
        cardNumber: ['', [Validators.required]],
        cvv: ['', [Validators.required]],
        expDateMM: ['', [Validators.required]],
        expDateYY: ['', [Validators.required]] 

      })
    })
  }

  getStates(formGroupName: string) {
    console.log("formgroup name:" + formGroupName);
    const formGroup = this.checkoutFormGroup.get(formGroupName);
    const countryCode = formGroup.value.country.code;


    console.log("code of country:" + countryCode);

    this.luv2ShopFormService.getStates("IN").subscribe(


      data => {
        if (formGroupName === "shippingAddress") {
          this.shippingAddressStates = data;
        } else {
          this.billingAddressStates = data;
        }
        formGroup.get('state').setValue(data[0]);
      }
    );

  SubmitForm(data: any): void {
    let formdata = {
      cardOwner: data.value.cardOwner,
      cardNumber: data.value.cardNumber,
      expDateMM: data.value.expDateMM,
      expDateYY: data.value.expDateYY,
      cvv: data.value.cvv
    }
    console.log(formdata);
    this.updateRecord(formdata);
     
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
