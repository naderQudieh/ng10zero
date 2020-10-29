import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Store, StoreModule, select } from '@ngrx/store';
import { environment } from '../../../environments/environment';
import { catchError, delay, tap, map } from 'rxjs/operators';
import { Observable, throwError, Subscription, Subject, BehaviorSubject, of } from 'rxjs';
import { LocalStorageService } from './local-storage.service';
import { UserInfo, AuthToken, UserClaims, AuthModel } from '../core.model';
import { EventService } from './event.service';



const TOKEN_INFO = 'user_token';
const USER_INFO = 'user_claims';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _credentials: AuthToken | null = null;
  private _token: any = null;
  userId: number;
  protected logoutUrl = `${environment.baseUrl}/auth/sign-out`;
  protected tokenUrl = `${environment.baseUrl}/auth/login`;
  isLoggedIn = false;
  // store the URL so we can redirect after logging in
  redirectUrl: string = "";

  constructor(private gStoreService: EventService, protected http: HttpClient, public jwtHelper: JwtHelperService,
    protected storageService: LocalStorageService) {
    this.redirectUrl = "";
    const savedCredentials = sessionStorage.getItem(TOKEN_INFO) || localStorage.getItem(TOKEN_INFO);
    if (savedCredentials) {
      this._credentials = JSON.parse(savedCredentials);
    }
  }

  public registerUser(registerData: any): Observable<any> {

    return this.http.post(`${environment.baseUrl}/auth/sign-up`, registerData);
  }


  public login(loginData: any): Observable<AuthToken> {
    console.log(loginData);
    this.redirectUrl = loginData.redirectUrl;
    // let fakeResponse = [1, 2, 3];
    // let delayedObservable = Observable.of(fakeResponse).delay(5000);
    let _userClaims: UserClaims = {
      "iss": "NahedIssuer",
      "iat": 1603856869,
      "exp": 1635392869,
      "aud": "www.nahedkadih.com",
      "sub": "nkadih@yahoo.com",
      "email": "nkadih@yahoo.com",
      "role": "1,2",
      "first_name": "nahed",
      "last_name": "kadih"
    }
    let mytokenkey = "qwertyuiopasdfghjklzxcvbnm123456";//"HS256"
    let token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE2MDM4NTc5NDksImV4cCI6MTYzNTM5Mzk0OSwiYXVkIjoiTmthZGloQXVkaWVuY2UiLCJzdWIiOiJua2FkaWhAc3ViamVjdC5jb20iLCJFbWFpbCI6Im5rYWRpaEB5YWhvby5jb20iLCJSb2xlIjpbIjEiLCIyIl0sImZpcnN0X25hbWUiOiJOYWhlZCIsImxhc3Rfa2FkaWgiOiJLYWRpaCJ9.HXErTKUzcVBWSvw5w65aLXUtW0oqQ8SRBZwufq6HfvE";
    var now = new Date();
    let isoDate = new Date(now).toISOString();
    let utcDate = new Date(now).toUTCString();
    console.log();
    let _token: AuthToken = {
      userId: 1601841917,
      access_token: token,
      refresh_token: 'fea054eb-98f8-46c7-ad5d-5074db74c2b6',
      token_type: 'bear',
      expires_date: new Date(utcDate)
    }
    this.userId = _token.userId;
    _token['redirectUrl'] = this.redirectUrl;

    if (_token.access_token) { 
         _token['expires_date'] = this.getTokenExpirationDate(_token.access_token);
    }

    this.gStoreService.setAuthenticated(true);
    return of(_token)
  }

  public LogInSuccess(authtoken: AuthToken): Observable<any> {

    this.gStoreService.setAuthenticated(true);
    this.storageService.setUserToken(authtoken);
    return of(true);
  }

  public logout(): Observable<any> {
    //const headers = new HttpHeaders();
    //const accessToken = this.storageService.getAccessToken();
    //headers.set('Authorization', 'Bearer ' + accessToken);
    //headers.set('Cache-Control', 'no-cache');
    console.log('call setAuthenticated(false)');
    this.gStoreService.setAuthenticated(false);
    this.storageService.clearToken();
    return of(true);
  }

  public forgot(forgotData: any) {
    return this.http.post(
      `${environment.baseUrl}/auth/forgot-password`,
      forgotData,
    );
  }

  public reset(forgotData: any) {
    return this.http.post(
      `${environment.baseUrl}/auth/change-password`,
      forgotData,
    );
  }




  getAuthRefreshToken(refresh_token?: string): Observable<AuthToken> {
    const payload = {
      grant_type: 'refresh_token',
      refresh_token: this.storageService.getRefreshToken()
    };
    return this.http.post(`${environment.baseUrl}/auth/refresh_token/`, payload)
      .pipe(
        catchError(this.handleError),
        tap((data: any) => {
          this.storageService.setUserToken(data);
        })
      );
  }

  getAccessToken(): string {
    return this.storageService.getAccessToken();
  }
  getRefreshToken(): string {
    return this.storageService.getRefreshToken();
  }
  setUserToken(authtoken: AuthToken) {
    this.storageService.setUserToken(authtoken);
  }
  getUserToken(): AuthToken {
    return this.storageService.getUserAuthToken();
  }
  isTokenExpired() {
    try {
      let accessToken = this.storageService.getAccessToken(); 
      return this.jwtHelper.isTokenExpired(accessToken);
    } catch (err) {
      return false;
    }
  } 
 
  getTokenExpirationDate(token: string): Date {
    if (!token) { return null; }
    const decoded = this.jwtHelper.decodeToken(token); 
    const expirationDate = decoded.exp;
    if (expirationDate === undefined) { return null; }

    const date = new Date(0);
    date.setUTCSeconds(expirationDate);
    console.log(date);
    return date;
  }

  decodeToken() {
    let token = this.storageService.getAccessToken();
    return this.jwtHelper.decodeToken(token);
  }

  public isAuthenticated(): boolean {
    let accessToken = this.storageService.getAccessToken();
    if (!accessToken) { console.error('accessToken is null'); }
    if (accessToken) {
      let isexp = this.jwtHelper.isTokenExpired(accessToken);
      if (isexp) { console.error('expired'); }
      return !isexp;
    }
    return false;

  }
  public confirmEmail(token: string) {
    return this.http.post(`${environment.baseUrl}/auth/confirm-email`, {
      token,
    });
  }

  public checkToken(data: { token: string; user_id: number | string }) {
    return this.http.post(`${environment.baseUrl}/auth/check-token`, data);
  }

  public resendCodeTFA() {
    return this.http.get(`${environment.baseUrl}/two-factor-auth/send-code`);
  }
  public checkTFA() {
    return this.http.get(`${environment.baseUrl}/auth/check-two-factor-auth`);
  }

  public confirmCodeTFA(code: string) {
    return this.http.put(
      `${environment.baseUrl}/two-factor-auth/confirm-code`,
      { code },
    );
  }
  private handleError(error: HttpErrorResponse): Observable<never> {
    return throwError(error);
  }


}
