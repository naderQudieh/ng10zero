import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { map,catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { checkoutServiceConstants } from '../../../core/constants/api.constants';
import { Category, Checkout, Order, PaymentDetail, CartItem, Product } from '../product.model';
import { ORDER_URLS } from '../../../core/constants/api.constants';
 
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};


@Injectable()
export class CheckoutService {
  private createOrderUrl = "https://api.us.afterpay.com/v1/orders";
  private apiUrl = environment.baseUrl;
  private errors: string[] = [];
  private stripeError?: string;
  public orderId = ``;
  public paymentIntentId = ``;
  public paymentIntentClientSecret = ``;
  public shippingLevel = ``;
  public fees = {
    shipping: 0,
    taxes: 0,
    ccFeeOffset: 0,
  };

  formData: PaymentDetail;

  list: PaymentDetail[];

  constructor(private http: HttpClient ) {
  }

 
  activatePromocode(data) {
    return this.http.post<any>(checkoutServiceConstants.activatePromocode, data);
  }

  createOrder(order:  Order): Observable<Checkout> {
    return this.http.post<Checkout>(`${this.apiUrl}order/create`, order).pipe(
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

 

  getProductsSuggestions(): Observable<Product[]> {
    return this.http
      .get(checkoutServiceConstants.getOrderSuggestions)
      .pipe(
        map((data: any) =>
          data.collection.map(product => {
            //this.productCollectionAdapter.transform(product)
          })
        )
      );
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
    console.log(`${this.apiUrl}mail/send`);
    return this.http.post('http://localhost:4000/api/mail/send', data).subscribe();
  }
  chargeCard(token: string) {
    const headers = new Headers({ token: token, amount: this.getTotal() });
    this.http
      .post(
        "http://13.126.207.114:9088/payment/charge",
        {},
        { headers: headers }
      )
      .subscribe(resp => { });
  }

  refundCard() {
    this.http
      .post("http://13.126.207.114:9088/payment/refund", {})
      .subscribe(res => { });
  }
  postPaymentDetail() {
    return this.http.post(this.apiUrl + 'api/PaymentDetail', this.formData);
  }
  putPaymentDetail() {
    return this.http.put(this.apiUrl + 'api/PaymentDetail/' + this.formData.transaction_id , this.formData);
  }

  refreshList() {
    return this.http.get(this.apiUrl + 'api/PaymentDetail')
      .toPromise()
      .then(res => this.list = res as PaymentDetail[]);
  }
  deletePaymentDetail(id: string) {
    return this.http.delete(this.apiUrl + 'api/PaymentDetail/' + id);
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
