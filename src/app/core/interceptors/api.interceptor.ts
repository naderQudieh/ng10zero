import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { AuthManager } from '../managers/auth.manager';
import { LocalStorage } from '../helpers/localStorage';
declare var $: any;

 
export class ApiInterceptor implements HttpInterceptor {
  message: string;
  constructor(
    private toastr: ToastrService,
    private authManager: AuthManager,
    private localStorage: LocalStorage
  ) {
    this.localStorage.getLang() === 'ar' ?
      this.message = 'هناك شئ خاطئ، يرجى المحاولة فى وقت لاحق.' :
      this.message = 'Something went wrong, Please try again later.';
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authManager.getUserToken() ? this.authManager.getUserToken() : '';
    const deviceId = this.authManager.getDeviceID();

    const lang = this.localStorage.getLang();
    const clonedReq = req.clone({
      setHeaders: {
        Authorization: token,
        deviceId: deviceId,
        deviceOs: 'WEB',
        lang: lang
        // 'district_id': districID
      }
    });


    return next.handle(clonedReq)
      .pipe(
        retry(1),
        catchError((error: HttpErrorResponse) => {
          let errorMessage = '';
          if (error.error instanceof ErrorEvent) {
            // client-side error
            errorMessage = `${error.error.message}`;
          } else {
            // server-side error
            errorMessage = `${error.error.message ? error.error.message : this.message}`;
          }
          this.toastr.clear();
          this.toastr.error(errorMessage);
          return throwError(errorMessage);
        })
      );
  }

}
