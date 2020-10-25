import {EProductActions, ProductActions} from './product.actions';
import { Product } from '../product.model';

export interface ProductsState {
  products: Product[];
  categories: string[];
  selectedProduct: Product;
}
export const initialProductState: ProductsState = {
  products: null,
  categories: null,
  selectedProduct: null
}


export const productReducers = (
  state = initialProductState,
  action: ProductActions
): ProductsState => {
  switch (action.type) {
    case EProductActions.GetProducts: {
      return {
        ...state, 
      };
    }
    case EProductActions.RemoveProductSuccess: {
      return {
        ...state,
        selectedProduct: action.payload
      };
    }
    case EProductActions.GetProductSuccess: {
      let _products = action.payload['payload']['payload']['data']  ;
      return {
        ...state,
        products: _products,
        selectedProduct: _products
      };
    }
    default:
      return state;
  }
};
