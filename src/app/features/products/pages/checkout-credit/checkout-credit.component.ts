import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from "@angular/router";
import { CheckoutPassService } from "../../services/checkout-pass.service"
import { CreditCard } from "../../credit-card";
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { User } from '../../user';
import { CreditCardValidators } from 'angular-cc-library';
import { GlobalService } from '../../../../core/services';
import { Observable, of, Subscription } from 'rxjs';
import { filter, delay,map, catchError, switchMap, debounceTime,   take } from 'rxjs/operators';
@Component({
  selector: 'app-checkout-credit',
  templateUrl: './checkout-credit.component.html',
  styleUrls: ['./checkout-credit.component.css']
})
export class CheckoutCreditComponent implements OnInit {

  creditCardFormGroup: FormGroup;
  creditCard: CreditCard;
  user: User;
  submitted: boolean = false;
  errorMessage;
  creditCardPreauthPassed: boolean = false;
  showSpinner$: Observable<boolean>;
  //todo Form Validation : https://angular.io/guide/form-validation

  constructor(
    public checkoutPassService: CheckoutPassService,
    private router: Router,
    private formBuilder: FormBuilder, private globalService: GlobalService,
  ) {

    globalService.getSpinnerValue().subscribe((e) => {
      this.showSpinner$ = of(e);
    });
    this.creditCardFormGroup = this.formBuilder.group({
      name: ['', [
        Validators.required,
        Validators.minLength(3)
      ]],
      firstName: ['', [
        Validators.required,
        Validators.minLength(3)
      ]],
      number: ['', [
        Validators.required
       // CreditCardValidator.validateCCNumber
      ]],
      cvv: ['', [
        Validators.required,
        Validators.minLength(3)
      ]],
      expirationMonth: ['', [
        Validators.required,
        Validators.pattern(/^[2-9]|1[0-2]?$/)
      ]],
      expirationYear: ['', [
        Validators.required,
        Validators.pattern(/^\b(20[1-4][0-9]|2050)\b$/)
      ]],

    });
  }

  ngOnInit() {
    this.user = this.checkoutPassService.user;
  }

  public onSubmit() {

    this.submitted = true;

    if (this.creditCardFormGroup.invalid) {
      return;
    }
 
    if (this.creditCardFormGroup.valid) {
      this.globalService.showSpinner();
      var tmpCreditCard = new CreditCard(this.creditCardFormGroup.value);

      this.checkoutPassService.preauthCredit(tmpCreditCard).pipe(
        map((res) => {
          this.globalService.hideSpinner();
          console.log("response data from credit : ", res.data);
          if (res.data.result != "ACCEPTED") {
            this.errorMessage = res.data.result;
          }
          else {
            this.checkoutPassService.setPreauthCredit(res.data);

            this.creditCardPreauthPassed = true;
            this.checkoutPassService.creditCard = tmpCreditCard;

            this.router.navigate(["checkout-recap"]);
          }
        }),
        catchError((err: any) => {
          this.globalService.hideSpinner();
          if (err.response) {
            if (err.response.status == 400) {
              console.log("error : ", err.response);
              this.errorMessage = "Carte de crédit non valide ou inexistante";
            }
            else {
              this.errorMessage = "Unknown error";
            }
          }
          else {
            this.errorMessage = "Unknown error";
          }
          console.log(this.errorMessage)
          return of(null);
        })
      );
       
    }
  }
}
