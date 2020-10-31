import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, delay, tap, map } from 'rxjs/operators';
import { Observable, throwError, Subscription, Subject, BehaviorSubject, of } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { checkoutServiceConstants } from '../../../core/constants/api.constants';
import { Category, CreditCard, Checkout, Order, PaymentDetail, CartItem, Product } from '../product.model';
import { ORDER_URLS } from '../../../core/constants/api.constants';
 
const httpOptions = {headers: new HttpHeaders({ 'Content-Type': 'application/json'})};
//const headers = new HttpHeaders({ 'Authorization': this.token.getToken() });

@Injectable()
export class CheckoutService {

  private checkoutUrl = ORDER_URLS.ORDER; 
  private errors: string[] = []; 
  formData: PaymentDetail; 

  constructor(private http: HttpClient) {

  }

 
  createOrder(order:  Order): Observable<Checkout> {
    return this.http.post<Checkout>(this.checkoutUrl+"order/create", order).pipe(
      catchError(this.errorMgmt)
    );
  }
  checkout(data) {
    if (data.payment_method === 'CASH') {
      return this.http.post(checkoutServiceConstants.checkoutCash, data);
    } else {
      return this.http.post(checkoutServiceConstants.checkoutOnline, data);
    }
  } 

  chargeCard(token: string) { 
    this.http.post(`${this.checkoutUrl}payment/charge`, {}, httpOptions).subscribe(
        resp => { 
        });
  }

  refundCard() {
    this.http.post("http://13.126.207.114:9088/payment/refund", {}).subscribe(res => {
    });
  }

  postPaymentDetail(): Observable<any> {  
   // let delayedObservable = of([1,2]).delay(2000);
    return this.http.post(`${this.checkoutUrl}payment/PaymentDetail`, this.formData);
  }

  putPaymentDetail(formData): Observable<any> {  
   // return this.http.put(this.checkoutUrl + 'api/PaymentDetail/', this.formData); 
    return of(true);
  }
   
  
  preauthCredit(paymentDetail: PaymentDetail) { 
    var postData: any =
    {
      "MERCHANT_API_KEY": paymentDetail.MERCHANT_API_KEY,
      "amount": paymentDetail.totalAmount,
      "purchase_desc": "PURCHASE/ Vente2 ",
      "credit_card": {
        "first_name": paymentDetail.firstName,
        "last_name": paymentDetail.card_holder_name,
        "number":  paymentDetail.card_number ,
        "cvv": paymentDetail.card_cvv,
        "exp": {
          "month": Number(paymentDetail.card_exp_mm),
          "year": Number(paymentDetail.card_exp_yy)
        }
      }
    };

    console.log(postData);
    return this.http.post<any>(this.checkoutUrl + '/transaction/create', postData);


  }
  commitTransaction(paymentDetail: PaymentDetail) { 
    var postData: any =
    {
      "transaction_number": paymentDetail.transaction_id, //this.transactionPreAuth.transaction_number,
      "action": "COMMIT",
      "MERCHANT_API_KEY": paymentDetail.MERCHANT_API_KEY
    }; 
    console.log(postData); 
    return this.http.post<any>(this.checkoutUrl + '/transaction/process', postData);

  }
  public addToCart(product: Product, quantity) {
    if (quantity == 0) return false;  
    this.http.post(this.checkoutUrl + 'add', {}, httpOptions) .subscribe((response) => {
      });
    location.reload()

  }

  sendMail(body) {
    let products = '';
    console.log(body);
    for (const product of body.products) {
      products += `<div>${product.title} ${product.price} руб. в количестве ${product.count}</div>`;
    }
    const template = `text`;
    const data = {
      name: body.name,
      email: body.email,
      subject: 'new order',
      text: `<h1>Привет! Вы заказали товар в магазине Bookmag</h1> ${products}`
    }
   
    return this.http.post(this.checkoutUrl + "/mail/send", data).subscribe();
  }
  errorMgmt(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.error}`;
    }
    return throwError(errorMessage);
  }
}
