import { Action, ActionReducerMap, ActionReducer, MetaReducer, createFeatureSelector } from '@ngrx/store';
import { routerReducer, RouterReducerState } from '@ngrx/router-store';
import { environment } from '../../environments/environment';
import { createReducer, createSelector, Selector } from '@ngrx/store';
//import { authReducer, initialState } from '../../features/account/store/auth.reducer';
//import { AuthActions } from '../../features/account/store';
//import { AuthState } from '../../features/account/store/auth.model';
import { RouterState } from './router.state';
import { storeLogger } from 'ngrx-store-logger';
import { featureProductsReducers } from 'src/app/features/products/store';
import { InjectionToken } from '@angular/core';

export interface AppState {
 // auth: AuthState;
  router: RouterReducerState<RouterState>;
}

export const reducers: ActionReducerMap<AppState> = {
  //  auth: authReducer,
  router: routerReducer
}; 

export const appReducers: ActionReducerMap<AppState> = {
 // auth: fromAuth.reducer,
  router: routerReducer,
 // featureProducts: featureProductsReducers,
};

export const metaReducers: MetaReducer<AppState>[] = !environment.production
  ? []
  : [];
 
//export const selectAuthState = createFeatureSelector<AppState, AuthState>('auth'); 
export const selectRouterState = createFeatureSelector<AppState, RouterReducerState<RouterState>>('router');

export function logger(reducer: ActionReducer<AppState>): any {
  return storeLogger()(reducer);
}



 
export const REDUCERS_TOKEN = new InjectionToken<ActionReducerMap<AppState>>('App Reducers');
export const reducerProvider = { provide: REDUCERS_TOKEN, useValue: appReducers };


//import { RouterReducerState } from '@ngrx/router-store';

//import { ProductState, initialProductState } from 'src/app/features/products/store/product.state';
//import { CartState, initialCartState } from   'src/app/features/products/store/cart.state';
//import { CheckoutState, initialCheckoutState } from 'src/app/features/products/store/checkout.state';

//export interface AppState {
//  router?: RouterReducerState;
//  products: ProductState;
//  cart: CartState;
//  checkout: CheckoutState;
//}

//export const initialAppState: AppState = {
//  products: initialProductState,
//  cart: initialCartState,
//  checkout: initialCheckoutState
//}

//export function getInitialState(): AppState {
//  return initialAppState;
//}
