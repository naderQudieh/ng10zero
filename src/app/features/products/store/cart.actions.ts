import {Action} from '@ngrx/store';
import { CartItem } from '../product.model';

export enum ECartActions {
    GetCart = '[Cart] Get cart',
    GetCartSuccess = '[Cart] Get cart success',
    AddToCart = '[Cart] Add to cart',
    AddToCartSuccess = '[Cart] Add to cart success',
    RemoveFromCart = '[Cart] Remove from cart',
    RemoveFromCartSuccess = '[Cart] Remove from cart success',
    CleanCart = '[Cart] Clean Cart',
    LoadInCartError = '[Cart] Load in cart error',
}

export class GetCart implements Action {
    public readonly type = ECartActions.GetCart;
}

export class GetCartSuccess implements Action {
    public readonly type = ECartActions.GetCartSuccess;
    constructor(public payload: any[]) {}
}

export class AddToCart implements Action {
    public readonly type = ECartActions.AddToCart;
    constructor(public payload: any) {}
}

export class AddToCartSuccess implements Action {
    public readonly type = ECartActions.AddToCartSuccess;
    constructor(public payload: any) {}
}

export class RemoveFromCart implements Action {
    public readonly type = ECartActions.RemoveFromCart;
    constructor(public payload: number) {}
}
export class CleanCart implements Action {
  public readonly type = ECartActions.CleanCart;
   
}
export class RemoveFromCartSuccess implements Action {
    public readonly type = ECartActions.RemoveFromCartSuccess;
    constructor(public payload: any[]) {}
}

export class LoadCartInError implements Action {
    public readonly type = ECartActions.LoadInCartError;
    constructor(public payload: any) {}
}

export type CartActions = GetCart
| GetCartSuccess
| AddToCart
| AddToCartSuccess
| RemoveFromCart
| RemoveFromCartSuccess
| LoadCartInError | CleanCart;
