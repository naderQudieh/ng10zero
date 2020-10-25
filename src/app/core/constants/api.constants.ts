

import { environment } from '../../../environments/environment';


export interface apsResponse {
  status?: number;
  payload?: any;
  message?: string;
}

export const authServiceConstants = {
  register: environment.baseUrl + 'register',
  login: environment.baseUrl + 'login',
  loginWithFacebook: environment.baseUrl + 'login/callback/facebook',
  forgetPassword: environment.baseUrl + 'reset/password',
  createGuestUser: environment.baseUrl + 'guest',
};

/**
 * All {@link BrandsService} API URLs
 */
export const brandsServiceConstants = {
  getAllBrands: environment.baseUrl + 'brands',
  getBrandProducts: environment.baseUrl + 'brands/products?'
};

/**
 * All {@link CartService} API URLs
 */
export const cartServiceConstants = {
  getCart: environment.baseUrl + 'cart',
  addToCart: environment.baseUrl + 'cart',
  getCartCalculations: environment.baseUrl + 'calculations/cart'
};

/**
 * All {@link CategoriesService} API URLs
 */
export const categoriesServiceConstants = {
  getAllCategories: environment.baseUrl + 'categorytree',
  getCategoryProducts: environment.baseUrl + 'products?'
};

/**
 * All {@link CheckoutService} API URLs
 */
export const checkoutServiceConstants = {
  activatePromocode: environment.baseUrl + 'promocode/validate',
  checkoutCash: environment.baseUrl + 'checkout',
  checkoutOnline: environment.baseUrl + 'checkout/payment?',
  getOrderSuggestions: environment.baseUrl + 'order/suggestion'
};

/**
 * All {@link ConfigurationsService} API URLs
 */
export const configurationsServiceConstants = {
  getDistrictsTree: environment.baseUrl + 'districtsTree',
  getTimeSections: environment.baseUrl + 'time/sections',
  getShippingNote: environment.baseUrl + 'configrations'
};


/**
 * All {@link ContactService} API URLs
 */
export const contactsServiceConstants = {
  sendEmail: environment.baseUrl + 'contact-us'
};

/**
 * All {@link HomeService} API URLs
 */
export const homeServiceConstants = {
  getHomeContent: environment.baseUrl + 'home',
  getHomeCollections: environment.baseUrl + 'collections',
  getRecentlyViewed: environment.baseUrl + 'recently/viewed',
};

/**
 * All {@link ProductService} API URLs
 */
export const productServiceConstants = {
  getProduct: environment.baseUrl + 'product?',
  getRelatedProducts: environment.baseUrl + 'related-products?',
  searchProducts: environment.baseUrl + 'search/products?name=',
};

/**
 * All {@link SearchService} API URLs
 */
export const searchServiceConstants = {
  searchEntries: environment.baseUrl + 'search/products?name=',
};

/**
 * All {@link UserService} API URLs
 */
export const userServiceConstants = {
  profileInfo: environment.baseUrl + 'userprofile',
  updateInfo: environment.baseUrl + 'user',
  changePassword: environment.baseUrl + 'user/changepassword',
  userAddress: environment.baseUrl + 'address',
  editAddress: environment.baseUrl + 'user/address/',
  deleteAddress: environment.baseUrl + 'user/address/',
  addAddress: environment.baseUrl + 'address',
  getOrders: environment.baseUrl + 'delivery/user/orders',
  getOrderDetails: environment.baseUrl + 'orders/',
  getWishlist: environment.baseUrl + 'user/favorites',
  removeFromWishList: environment.baseUrl + 'user/favorites?product_id=',
  addToWishlist: environment.baseUrl + 'user/favorites',
  getUserAddresses: environment.baseUrl + 'address',
};

export const USER_API = {
  // USER API INFO
  profile: environment.baseUrl + 'userprofile',
  updateProfile: environment.baseUrl + 'user',
  updatePassword: environment.baseUrl + 'user/changepassword',
  // USER API ADDRESS
  address: environment.baseUrl + 'address',
  cities: environment.baseUrl + 'districtsTree',
  updateAddress: environment.baseUrl + 'user/address/',
  // USER API ORDERS
  orders: environment.baseUrl + 'delivery/user/orders',
  orderSuggestions: environment.baseUrl + 'order/suggestion',
  orderDetails: environment.baseUrl + 'orders/',
  // USER API WISHLIST
  wishlist: environment.baseUrl + 'user/favorites',
  updateWishList: environment.baseUrl + 'user/favorites?product_id=',
};

export const ORDER_URLS = { 
  PRODUCT: environment.baseUrl + 'userprofile',
  PRODUCT_CATEGORY: environment.baseUrl + 'user',
  ORDER: environment.baseUrl + 'user/changepassword',
  ORDERS_BY_CUSTOMER_ID: environment.baseUrl + 'orders?customer_id',
  ORDER_BY_ID: environment.baseUrl + 'order?order_id',
};

export const PRODUCT_URL = {
  PRODUCTS: environment.baseUrl + 'products',
  PRODUCT: environment.baseUrl + 'product?product_id=',
  PRODUCT_DEPT: environment.baseUrl + 'product?department_id=' 
};
export const COMMON_URL = {
  countries: environment.baseUrl + 'lookupservices/countries',
  states: environment.baseUrl + 'lookupservices/states',
  languages: environment.baseUrl + 'lookupservices/languages',
};
