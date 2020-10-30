import { CartActions, ECartActions } from './cart.actions';
import { CartItem, CartSummary } from '../product.model';


export interface CartState extends CartSummary {

}

export const initialCartState: CartState = getCartSummary();

export const cartReducers = (state = initialCartState, action: CartActions): CartState => {
  switch (action.type) {

    case ECartActions.GetCartSuccess: {

      return {
        ...state,
        cartItems: action.payload
      };
    }
    case ECartActions.RemoveFromCartSuccess: {
      const tempItems = state.cartItems.filter(item => item.product!.product_Id !== action.payload);
      return {
        ...state,
        cartItems: tempItems
      };
    }

    case ECartActions.AddToCartSuccess: {
      const tempItems = state.cartItems.concat(action.payload);
      return {
        ...state,
        cartItems: tempItems
      };
    }
    case ECartActions.CleanCartSuccess: { 
      return { 
        cart_total:  0,
        cart_qty:   0,
        discount:  0,
        total_payable: 0, 
        cartItems: [] 
      };
    }
    default:
      return state;
  }
};
function getCartSummary(): CartSummary {
  let cartitems: CartItem[] = getCartItems();
  let cart_qty: number = 0;
  let cart_total: number = 0;
  let _count = 0, _price = 0;
  cartitems.forEach(a => {
    if (typeof (a.count) === 'string') {
      _count = parseInt(a.count);
    } else {
      _count = a.count
    }

    if (typeof (a.product.unit_price) === 'string') {
      _price = parseInt(a.product.unit_price);
    } else {
      _price = a.product.unit_price
    }

    cart_total += _price;
    cart_qty += _count;
  });

  let cartSummary: CartSummary = {
    cart_qty: cart_qty,
    cart_total: cart_total,
    total_payable: 0,
    discount: 0,
    cartItems: cartitems
  }

  return cartSummary;
}

function getCartItems(): CartItem[] {
  try {
    let cart: any[] = JSON.parse(localStorage.getItem('cart'))
    return cart || [];
  } catch (err) {
    return [];
  }
}
