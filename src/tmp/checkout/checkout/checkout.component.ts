import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Country, State } from '../checkout.model';
import { Luv2ShopFormService } from '../luv2-shop-form.service';
import { Luv2ShopValidatores } from '../luv2-shop-validatores';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup: FormGroup;

  totalPrice: number = 0;
  totalQuantity: number = 0;

  creditCardYears: number[] = [];
  creditCardMONTHS: number[] = [];

  countries: Country[] = [];

  shippingAddressState: State[] = [];
  billingAddressState: State[] = [];

  constructor(private formBuilder: FormBuilder,//also we added our sevices method so we can use them 
    private luv2ShopFormService: Luv2ShopFormService) { }// that's why we defined ReactiveFormsModule in the import part in app.module so now we can have a new form 


  ngOnInit(): void {

    this.checkoutFormGroup = this.formBuilder.group({

      customer: this.formBuilder.group({
        firstName: new FormControl('', [Validators.required,
        Validators.minLength(2),
        Luv2ShopValidatores.notOnlyWhiteSpace]), // [''] mean empty
        lastName: new FormControl('', [Validators.required,
        Validators.minLength(2),
        Luv2ShopValidatores.notOnlyWhiteSpace]),
        email: new FormControl('',
          [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')])
      }),
      shippingAddress: this.formBuilder.group({
        country: new FormControl('', [Validators.required]),// drop down list so only required is enough

        street: new FormControl('', [Validators.required,
        Validators.minLength(2),
        Luv2ShopValidatores.notOnlyWhiteSpace]),
        city: new FormControl('', [Validators.required,
        Validators.minLength(2),
        Luv2ShopValidatores.notOnlyWhiteSpace]),

        state: new FormControl('', [Validators.required]), //  drop down list so only required is enough

        zipCode: new FormControl('', [Validators.required,
        Validators.minLength(2),
        Luv2ShopValidatores.notOnlyWhiteSpace])
      }),
      billingAddress: this.formBuilder.group({
        country: new FormControl('', [Validators.required]),// drop down list so only required is enough

        street: new FormControl('', [Validators.required,
        Validators.minLength(2),
        Luv2ShopValidatores.notOnlyWhiteSpace]),
        city: new FormControl('', [Validators.required,
        Validators.minLength(2),
        Luv2ShopValidatores.notOnlyWhiteSpace]),

        state: new FormControl('', [Validators.required]), //  drop down list so only required is enough

        zipCode: new FormControl('', [Validators.required,
        Validators.minLength(2),
        Luv2ShopValidatores.notOnlyWhiteSpace])
      }),
      creditCard: this.formBuilder.group({
        cardType: new FormControl('', [Validators.required]),

        nameOnCard: new FormControl('', [Validators.required,
        Validators.minLength(6),
        Luv2ShopValidatores.notOnlyWhiteSpace]),

        cardNumber: new FormControl('', [Validators.required, Validators.pattern('[0-9]{16}')]),// only numbers from 0-9 and should be 16 number 
        securityCode: new FormControl('', [Validators.required, Validators.pattern('[0-9]{3}')]),
        expirationMonth: [''],
        expirationYear: ['']
      })

    });

    // populate credit card months 

    const startMonth: number = new Date().getMonth() + 1;// we added one because it's starting from zero, here gave us current month
    console.log("starting Month: " + startMonth);

    this.luv2ShopFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("retrived credit card months: " + JSON.stringify(data))
        this.creditCardMONTHS = data;
      }
    );

    //  populate credit card years 
    ; this.luv2ShopFormService.getCreditCardYears().subscribe(
      data => {
        console.log("retrived credit card months: " + JSON.stringify(data))
        this.creditCardYears = data;
      }
    );

    //  populate the countries

    this.luv2ShopFormService.getCountries().subscribe(
      data => {
        console.log("Retrieved the countries: " + JSON.stringify(data));
        this.countries = data;
      }
    );

  }
  onSubmit() {// we create it to handle the submit button Purchase
    console.log("Handling the submit button");

    // here is the last point when we will press on purchase the validation code will check and work for us 
    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
    }


    console.log(this.checkoutFormGroup.get('customer').value);
    console.log(this.checkoutFormGroup.get('customer').value.email);// here I will get only ythe email 
    // console.log("The shipping address country is " +this.checkoutFormGroup.get('shippingAddress').value.Country.name);
    // console.log("The shipping address state is " +this.checkoutFormGroup.get('shippingAddress').value.State.name);

  }

  // we added it for the validation perpose 
  get firstName() { return this.checkoutFormGroup.get('customer.firstName'); }//customer is the form builder up and firstName is the field
  get lastName() { return this.checkoutFormGroup.get('customer.lastName'); }
  get email() { return this.checkoutFormGroup.get('customer.email'); }

  get shippingAddressStreet() { return this.checkoutFormGroup.get('shippingAddress.street'); }//shippingAddress is the form builder and street is the field
  get shippingAddressCity() { return this.checkoutFormGroup.get('shippingAddress.city'); }
  get shippingAddressCountry() { return this.checkoutFormGroup.get('shippingAddress.country'); }
  get shippingAddressZipCode() { return this.checkoutFormGroup.get('shippingAddress.zipCode'); }
  get shippingAddressStates() { return this.checkoutFormGroup.get('shippingAddress.state'); }

  get billingAddressStreet() { return this.checkoutFormGroup.get('billingAddress.street'); }//shippingAddress is the form builder and street is the field
  get billingAddressCity() { return this.checkoutFormGroup.get('billingAddress.city'); }
  get billingAddressCountry() { return this.checkoutFormGroup.get('billingAddress.country'); }
  get billingAddressZipCode() { return this.checkoutFormGroup.get('billingAddress.zipCode'); }
  get billingAddressStates() { return this.checkoutFormGroup.get('billingAddress.state'); }

  get creditCardType() { return this.checkoutFormGroup.get('creditCard.cardType'); }
  get creditCardSecurityCode() { return this.checkoutFormGroup.get('creditCard.securityCode'); }
  get creditCardNumber() { return this.checkoutFormGroup.get('creditCard.cardNumber'); }
  get creditCardNameOnCard() { return this.checkoutFormGroup.get('creditCard.nameOnCard'); }

  copyShippingAddressToBillingAddress(event) {

    if (event.target.checked) {
      this.checkoutFormGroup.controls.billingAddress
        .setValue(this.checkoutFormGroup.controls.shippingAddress.value);

      // bug fix code for states
      this.billingAddressState = this.shippingAddressState;
    }
    else {
      this.checkoutFormGroup.controls.billingAddress.reset();

      this.billingAddressState = [];
    }
  }

  handleMonthsAndYears() {
    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');

    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(creditCardFormGroup.value.expirationYear);

    // if the current year equals the selected year, then start with the current month

    let startMonth: number;

    if (currentYear === selectedYear) {
      startMonth = new Date().getMonth() + 1;
    }
    else {
      startMonth = 1;//give us list from 1 - 12
    }

    this.luv2ShopFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrieved credit card months: " + JSON.stringify(data));
        this.creditCardMONTHS = data;
      }
    );

  }

  getStates(formGroupName: string) {

    const formGroup = this.checkoutFormGroup.get(formGroupName);// here we got the country so below will get the country code

    const countryCode = formGroup.value.country.code; // here we got the code so we can find the state up to this code 

    const countryName = formGroup.value.country.name;

    console.log(`${formGroupName} country code: ${countryCode}` + `${formGroupName} country name: ${countryName}`);

    this.luv2ShopFormService.getStates(countryCode).subscribe(

      data => {

        if (formGroupName == `shippingAddress`) {
          this.shippingAddressState = data;
        }
        else {
          this.billingAddressState = data;
        }
        //select first item by default 
        formGroup.get('state').setValue(data[0]);// when I choose the country, this will chose the first state automatically


      }

    );
  }

}
