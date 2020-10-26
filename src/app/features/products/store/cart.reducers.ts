import {CartActions, ECartActions} from './cart.actions';
import { CartItem } from '../product.model';


export interface CartState {
  CartItems: CartItem[];
}
export const initialCartState: CartState = {
  CartItems: null,
}



export const cartReducers = (
    state = initialCartState,
    action: CartActions
): CartState => {
    switch (action.type) {
        case ECartActions.GetCartSuccess: {
            return {
                ...state,
              CartItems: action.payload
            };
        }
        case ECartActions.RemoveFromCartSuccess: {
            return {
                ...state,
              CartItems: action.payload
            };
        }
        default:
            return state;
    }
};
