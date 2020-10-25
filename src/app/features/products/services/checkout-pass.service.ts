import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { checkoutServiceConstants } from '../../../core/constants/api.constants';
import { Category, Checkout, Order, Cart, Product } from '../product.model';
import { CreditCard } from "../credit-card";
import { Transaction } from "../transaction";
import { User } from "../user";
import { CheckoutConfirmationComponent } from '../pages/checkout-confirmation/checkout-confirmation.component';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

 
export class CheckoutPassService {

  public creditCard: CreditCard;
  public user: User;
  //private because must be set through setUserSocial
  private userSocial: any;
  public cart: Cart = new Cart();
  private preAuthCredit: any;
  transaction: Transaction;

  private passerelleApiURL = 'https://h19-passerelle.herokuapp.com/api/v1';
  private ourApiURL = environment.baseUrl;
  private MERCHANT_API_KEY = "HJoMststlPWjtosFtFG85Q3DdS5/v/8Db2jjPkssN6U=";
  private checkoutConfirmationComponent;

  constructor(private http: HttpClient) {
  }
 

  setUserSocial(userSocial: any) {
    //reset the user just in case
    this.user = new User();
    this.user.firstName = userSocial.FirstName;
    this.user.name = userSocial.LastName;
    this.user.postalCode = userSocial.PostalCode;
    this.user.province = userSocial.Province;
    this.user.city = userSocial.City;
    this.user.civicAddress = userSocial.Address;

    //and copy the returned request from social
    this.userSocial = userSocial;
  }

  getUserSocial() {
    return this.userSocial;
  }

  /**
   * Preauthorize the creditCard for the content of this.cart total
   *
   * @param crediCard the credit card to preauthorize
   */

  preauthCredit(crediCard: CreditCard) {
 
    var postData: any =
    {
      "MERCHANT_API_KEY": this.MERCHANT_API_KEY,
      "amount": this.calculateTotal(this.cart),
      "purchase_desc": "PURCHASE/ Vente2 ",
      "credit_card": {
        "first_name": crediCard.firstName,
        "last_name": crediCard.name,
        "number": Number(crediCard.number),
        "cvv": crediCard.cvv,
        "exp": {
          "month": Number(crediCard.expirationMonth),
          "year": Number(crediCard.expirationYear)
        }
      }
    };

    console.log(postData);
    return this.http.post<any>(this.passerelleApiURL + '/transaction/create', postData);
  

  }
  /**
   * Sends the COMMIT to passerelle de paiement API to proceed with transaction
   */
  commitTransaction() {

    var postData: any =
    {
      "transaction_number": this.preAuthCredit.transaction_number, //this.transactionPreAuth.transaction_number,
      "action": "COMMIT",
      "MERCHANT_API_KEY": this.MERCHANT_API_KEY
    };

    console.log(postData);

    return this.http.post<any>(this.passerelleApiURL + '/transaction/process', postData);
    
  }



  /** commit the transaction to our api by creating a new transaction containing
   *  the ticket
   */
  commitTransactionToOurAPI() {

    this.transaction = new Transaction();
    this.transaction.transactionConfirmation = this.makeid(16);
    this.transaction.dateTransaction = new Date(Date.now());
    this.transaction.user = this.user;


    var postData: any = {
      "transactionConfirmation": this.transaction.transactionConfirmation,
      "tickets": [],
      "user": {
        "name": this.user.firstName,
        "surname": this.user.name
      }
    }

    if(this.userSocial){
      postData.user.socialLink = this.userSocial.Email;
    }

    //this.cart.tickets.forEach(ticket => {
    //  postData.tickets.push({"uuid" : ticket.uuid});
    //});
    return this.http.post<any>(this.passerelleApiURL + '/transactions', postData);
 
  }

  //make an alpha-numeric string of lenth size
  private makeid(length) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < length; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  }

  setPreauthCredit(preauth: any) {
    this.preAuthCredit = preauth;
  }

  calculateTotal(cart) {
		var total = 0.0;
		if (cart.tickets) {
			cart.tickets.forEach(function (ticket) {
				total += Number(ticket.price);
			})
		}

		return total;
  }
  
  setCheckoutConfirmationComponent(checkoutConfirmationComponent : CheckoutConfirmationComponent ){
    this.checkoutConfirmationComponent = checkoutConfirmationComponent;
  }

  notifiyCheckoutConfirmationComponent(message){
    this.checkoutConfirmationComponent.notify(message);
  }

}
