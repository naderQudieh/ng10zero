import {Injectable} from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { select, Store } from '@ngrx/store';
import {CartService} from '../services/cart.service';
import { AddToCart, CleanCart,  AddToCartSuccess,    ECartActions,    GetCart,
  GetCartSuccess, LoadCartInError, RemoveFromCart, CleanCartSuccess, RemoveFromCartSuccess} from './cart.actions';
import {map, switchMap} from 'rxjs/operators';
import { CartItem } from '../product.model';
import { SnackbarService } from 'src/app/core/services/snackbar.service';

import { selectCars } from './';

@Injectable()
export class CartEffects {
    @Effect()
    getCart$ = this.actions$.pipe(
        ofType<GetCart>(ECartActions.GetCart),
      switchMap(() => this.cartService.getCart()),
      switchMap((data: CartItem[]) => of(new GetCartSuccess(data)))
    );
    @Effect()
    addToCart$ = this.actions$.pipe(
        ofType<AddToCart>(ECartActions.AddToCart),
      switchMap(data => {
        console.log(data);
            return this.cartService.addToCart(data.payload).pipe(
              map((cart) => { 
                  this.notify.success('AddToCartSuccess');
                   return new AddToCartSuccess(cart);
                }),
            );
        })
    );
    @Effect()
    removeFromCart$ = this.actions$.pipe(
        ofType<RemoveFromCart>(ECartActions.RemoveFromCart),
        switchMap((data) => {
            return this.cartService.removeFromCart(data.payload).pipe(
              map((res: number) => {
                    return new RemoveFromCartSuccess(res);
                })
            );
        }),
    );
  
   
  //@Effect()
  //CleanCart$ = this.actions$.pipe(
  //  ofType<CleanCart>(ECartActions.CleanCart),
  //  switchMap((data) => {
  //    console.log(data);
  //    return this.cartService.cleanCart().pipe(
  //      map((res: boolean) => {
  //        return new CleanCartSuccess(res);
  //      })
  //    );
  //  }),
  //);

  @Effect({ dispatch: false })
  CleanCart$ = this.actions$.pipe(ofType(ECartActions.CleanCart),
    map((action: any) => {
      this.cartService.cleanCart();
      this.notify.success('CleanCartSuccess');
      return new CleanCartSuccess(true);

    })
  );

    constructor(
        private actions$: Actions,
        private cartService: CartService,
        private notify: SnackbarService 
    ) {
    }
}
