import {CartActions, ECartActions} from './cart.actions';
import { Cart } from '../product.model';


export interface CartState {
  CartItems: Cart[];
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
