import { AppState } from 'src/app/core/app.state';
import {Store} from '@ngrx/store';
import { of } from 'rxjs';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {Router} from '@angular/router';
import {CreateCheckout, CreateCheckoutSuccess, ECheckoutActions} from './checkout.actions';
import {catchError, map, switchMap} from 'rxjs/operators';
import { CheckoutService } from '../services/checkout.service';
import * as fromCheckout from "./checkout.reducers"
import {CreateProductError} from './product.actions';
import { SnackbarService } from 'src/app/core/services/snackbar.service';

export class CheckoutEffects {
    @Effect()
    createCheckout$ = this.actions$.pipe(
        ofType<CreateCheckout>(ECheckoutActions.CreateCheckout),
        switchMap((data) => {
            return this.checkoutService.createOrder(data.payload).pipe(
                map(res  => {
                    this.checkoutService.sendMail(res);
                    this.notify.success('CreateCheckoutSuccess');
                    this.router.navigate(['products']);
                  return new CreateCheckoutSuccess(res);
                }),
                catchError(err => of(new CreateProductError(err)))
            );
        }),
      )
    
    constructor(
      private store: Store<fromCheckout.CheckoutState>,
        private actions$: Actions,
        private checkoutService: CheckoutService,
        private notify: SnackbarService,
        private router: Router
    ) {
    }
}
