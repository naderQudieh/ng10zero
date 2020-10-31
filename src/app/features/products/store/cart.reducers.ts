import { CartActions, ECartActions } from './cart.actions';
import { CartItem, CartSummary } from '../product.model';


export interface CartState extends CartSummary {

}

export const initialCartState: CartState = getCartSummary();

export const cartReducers = (state = initialCartState, action: CartActions): CartState => {
  switch (action.type) { 
    default:
      let cartSummary = getCartSummary(); 
      return {
        ...state,
        cart_total: cartSummary.cart_total,
        cart_qty: cartSummary.cart_qty,
        discount: cartSummary.discount,
        total_payable: 0,
        cartItems: cartSummary.cartItems
      };
      return cartSummary;
  }
};

 
function getCartSummary(): CartSummary { 
  let cartitems: CartItem[]   = getCartItems(); 
  let cart_qty: number = 0;
  let cart_total: number = 0;
  let _count = 0, _price = 0;
  cartitems.forEach(item => {
    if (typeof (item.count) === 'string') {
      _count = parseInt(item.count);
    } else {
      _count = item.count
    }

    if (typeof (item.product.unit_price) === 'string') {
      _price = parseInt(item.product.unit_price);
    } else {
      _price = item.product.unit_price
    }
    item.total_value = _count * _price;
    cart_total += item.total_value;
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
