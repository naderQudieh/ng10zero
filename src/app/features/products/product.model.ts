import { Data } from '@angular/router';
 

export enum OrderActions {

  'Cancel' = 'Cancel'
}
export interface apsResponse {
  status?: number;
  payload?: any; 
  message?: string; 
}
 
export class PaymentDetail {
  transaction_id?: number;
  customer_id?: number;
  card_holder_name?: string;
  card_number?: string;
  card_exp_mm?: number;
  card_exp_yy?: number;
  card_cvv?: string;
  trans_status?: string;
  payment_date?: Date;
  date_created?: Date;
  date_modified?: Date;
}

export class Address {
  address_id?: number;
  Address1?: string;
  Address2?: string;
  city?: string;
  state?: string;
  postcode?: string;
  country? : string;
  phone?: string;
  mobile?: string;
}
export interface Product {
  product_Id?: number;
  name?: string;
  description?: string;
  unit_price: number | 0;
  currency?: 'rupee' | 'euro' | null;
  imge_url?: string, 
  department_id?: number; 
  date_created?: Date;
  date_modified?: Date;
}

export class CartSummary { 
  customer_id?: number;
  cart_total?: number;
  cart_qty?: number;
  discount?: number;
  total_payable?: number;
  date_modified?: Date;
  cartItems?: CartItem[];
}
export class CartItem{ 
  product?: Product;
  count?: number|0; 
  total_value?: number | 0;
}

 
export class Checkout {
  name?: string;
  address?: string;
  email?: string;
  products?: Product[];
}

export interface Category {
  id?: string;
  nome?: string;
}
export interface Order {
  id?: number;
  first_name?: string;
  last_name?: string;
  phone?: string;
  address?: string;
  products?: any[];
}
export class Courier {
}
export class Discount {
}
export class Customer {
}
export class Money {
}
export class Order {
  order_id?: number;
  customer_id?: number;
  transaction_id?: number; 
  customer?: Customer;
  billing?: Address;
  shipping?: Address; 
  items?: Product[];
  discounts?: Discount[];
  paymentType?: string = "PAY_BY_INSTALLMENT"; 
  order_status?: string;
  confirm_n?: string;
  order_total?: Money;
  taxAmount?: Money;
  shippingAmount?: Money;

}
export interface OrderUnit {
  product?: any;
  hash?: number;
  quantity?: number;
}
