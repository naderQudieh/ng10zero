import {Injectable} from '@angular/core';
import { Effect, ofType, Actions} from '@ngrx/effects';
import {Store, select} from '@ngrx/store';
import { of } from 'rxjs';
import {switchMap, map, withLatestFrom, catchError, filter} from 'rxjs/operators';
import {AppState} from 'src/app/core/app.state';

import {
  GetProduct,
  GetProductSuccess,
  GetProductError,
  GetProducts,
  GetProductsSuccess,
  GetProductsError,
  UpdateProduct,
  UpdateProductSuccess,
  UpdateProductError,
  RemoveProduct,
  RemoveProductSuccess,
  RemoveProductError, EProductActions, CreateProductSuccess, CreateProductError, CreateProduct,

} from './product.actions';
import { Product, apsResponse } from '../product.model';
import { ProductService } from '../services/products.service';
import * as fromProducts from "./product.reducers"
import { SnackbarService } from 'src/app/core/services/snackbar.service';

import {Router} from '@angular/router';

@Injectable()
export class ProductEffects {
  @Effect()
  getProduct$ = this.actions$.pipe(
    ofType<GetProduct>(EProductActions.GetProduct),
    map(action => action.payload),
    switchMap(id => {
      return this.productService.getProduct(id);
    }),
    switchMap((product: any) => {
      return of(new GetProductSuccess(product));
    })
  );
 
  @Effect()
  getProducts$ = this.actions$.pipe(
    ofType<GetProducts>(EProductActions.GetProducts),
    switchMap((_data) => { 
      let data = _data['payload']; 
      return this.productService.getProducts(data['page'], data['limit']).pipe(
        map((resp: apsResponse) => { 
          this.notify.success('GetProductsSuccess');
          return new GetProductSuccess({ payload: resp });
        }),
        catchError((err) => {
          this.notify.error(err);
          return of(new GetProductError(err));
        })
      );
    })
  );
 

  @Effect()
  updateProduct$ = this.actions$.pipe(
      ofType<UpdateProduct>(EProductActions.UpdateProduct),
      switchMap((data) => {
        return this.productService.updateData(data, 'products').pipe(
          map((resp: apsResponse) => {
              this.notify.success('UpdateProductSuccess');
            return new UpdateProductSuccess({ payload: resp });
            }),
            catchError((err) => {
                this.notify.error(err);
                return of(new UpdateProductError(err));
            })
        );
      })
  );

  @Effect()
    createProduct$ = this.actions$.pipe(
        ofType<CreateProduct>(EProductActions.CreateProduct),
      switchMap((apiRes: apsResponse) => {
            const product: Product = {
              name: apiRes.payload['data']['name'], 
              description: apiRes.payload['data']['description'],
              price: apiRes.payload['data']['price'], 
              department_id: apiRes.payload['data']['department_id'],
              imge_url: apiRes.payload['data']['imge_url']
            }
        return this.productService.createData(product, 'products', product).pipe(
          map((resp: Product) => {
            this.notify.success(`CreateProductSuccess ${resp.name}`);
                    this.router.navigate(['products']);
                  return new CreateProductSuccess({ payload: resp });
                }),
                catchError((err) => {
                    this.notify.error(err);
                    return of(new CreateProductError(err));
                })
            );
        })
    );
  @Effect()
    removeProduct$ = this.actions$.pipe(
        ofType<RemoveProduct>(EProductActions.RemoveProduct),
      switchMap((data: apsResponse) => {
          return this.productService.removeData(data.payload, 'products').pipe(
            map((resp: Product) => {
              this.notify.success(`RemoveProductSuccess ${resp.name}`);
                    //this.store.dispatch(new GetProducts());
                  return new RemoveProductSuccess({ payload: resp });
                }),
                catchError((err) => {
                    this.notify.error(err);
                    return of(new CreateProductError(err));
                })
            );
        })
    );
  constructor(
    private actions$: Actions,
    private productService: ProductService,
    private store: Store<fromProducts.ProductsState>,
    private notify: SnackbarService,
    private router: Router
  ) {
  }
}
