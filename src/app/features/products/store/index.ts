import { createSelector, createFeatureSelector, ActionReducerMap } from "@ngrx/store";
import * as fromCart   from "./cart.reducers";
import * as fromProducts  from "./product.reducers"
import * as fromCheckouts  from "./checkout.reducers"
import * as fromRoot from "src/app/core/app.state"
 

export interface featureProductsState {
  cart: fromCart.CartState;
  products: fromProducts.ProductsState;
  checkout: fromCheckouts.CheckoutState;
}


 
export interface AppState extends fromRoot.AppState {
  featureProducts: featureProductsState;
}
export interface ProductsState {
  products: fromProducts.ProductsState;
}
export interface CartsState {
  cart: fromCart.CartState;
}

export interface CheckoutState {
  checkout: fromCheckouts.CheckoutState;
}

export const productReducers: ActionReducerMap<ProductsState> = {
  products: fromProducts.productReducers,
};

export const cartReducers: ActionReducerMap<CartsState> = {
  cart: fromCart.cartReducers,
};

export const checkoutReducers: ActionReducerMap<CheckoutState> = {
  checkout: fromCheckouts.checkoutReducers,
};

export const featureProductsReducers: ActionReducerMap<featureProductsState> = {
  products: fromProducts.productReducers,
  cart: fromCart.cartReducers  ,
  checkout: fromCheckouts.checkoutReducers
};

 
export const getCartState = createFeatureSelector<fromCart.CartState>('cart');
export const getProductState = createFeatureSelector<fromProducts.ProductsState>('products');
export const getCheckoutState = createFeatureSelector<fromCheckouts.CheckoutState>('checkout');

export const selectproductsfeatureState = createFeatureSelector<featureProductsState>("productsfeature");

export const selectProducts = createSelector(getProductState, state => state.products );
export const selectCartItems = createSelector(getCartState, state => state.cartItems);
   

export * from './cart.reducers';
export * from './cart.actions';
export * from './cart.effects';
export * from './product.reducers';
export * from './product.actions';
export * from './product.effects';
export * from './checkout.reducers';
export * from './checkout.actions';
export * from './checkout.effects';

