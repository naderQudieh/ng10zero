import {CheckoutActions, ECheckoutActions} from './checkout.actions';
import { Checkout } from '../product.model';

export interface CheckoutState {
  order: Checkout;
  error: string;
}

export const initialCheckoutState: CheckoutState = {
  order: null,
  error: null
}


export const checkoutReducers = (
    state = initialCheckoutState,
    action: CheckoutActions
): CheckoutState => {
    switch (action.type) {
        case ECheckoutActions.CreateCheckoutSuccess : {
            return {
                ...state,
                order: action.payload
            };
        }
        case ECheckoutActions.CreateCheckoutError : {
            return {
                ...state,
                error: action.payload
            };
        }
        default:
            return state;
    }
}
