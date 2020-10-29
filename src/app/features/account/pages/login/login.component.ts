import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { Subscription, Observable } from 'rxjs';
import { filter, debounceTime, map, take } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ROUTE_ANIMATIONS_ELEMENTS } from '../../../../core/core.module';
import { AuthActions,  selectAuthError, selectAuth  } from '../../store';

@Component({
    selector: 'auth-login',
  templateUrl: './login.component.html',
    styleUrls: ['../auth-styles.scss'] 
})
export class LoginComponent implements OnInit {
    isLoading = false;
    public error$: Observable<any>;
    hide = true;
    redirectUrl: string="";
    private loadingSub: Subscription;
    mainform: FormGroup;
 

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private formBuilder: FormBuilder,
    private store: Store,
    private translate: TranslateService 
  ) {}

    createForm() {
        this.mainform = this.formBuilder.group({
            email: ['', Validators.compose([
                Validators.required,
                Validators.minLength(3),
                Validators.maxLength(30),
                this.validateEmail
            ])],
            password: ['', Validators.compose([
                Validators.required,
                Validators.minLength(8),
                Validators.maxLength(30),
                this.validatePassword
            ])]
        })
    }

    validateEmail(controls) {
        const regExp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        if (regExp.test(controls.value)) {
            return null;
        } else {
            return { 'validateEmail': true }
        }
    }

    validatePassword(controls) {
        const regExp = new RegExp(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])([a-zA-Z0-9]{8,30})$/);
        if (regExp.test(controls.value)) {
            return null;
        } else {
            return { 'validatePassword': true }
        }
    }
    ngOnInit() {
        this.isLoading = false; 
        this.createForm();
      this.error$ = this.store.pipe(select(selectAuthError)); 
        this.route.params.subscribe((params) => {
            console.log(params); 
            if (params.redirectUrl) {
                this.redirectUrl = params.redirectUrl;
            }
            
            console.log(this.redirectUrl); 
        });
        this.route.queryParams.subscribe((params) => {
            console.log(params);
            if (params.redirectUrl) {
                this.redirectUrl = params.redirectUrl;
            }

            console.log(this.redirectUrl);
        }); 
  }
  
 

    SubmitForm(data: any): void {
      
        let formdata = {
            email: data.value.email,
            password: data.value.password,
            redirectUrl: this.redirectUrl
        } 
        if (data.value) {
            console.log(this.redirectUrl); 
            this.store.dispatch(new AuthActions.LogIn(formdata));
            // this.store.dispatch(AuthActions.SignIn({ payload: me }));
        }
    }
     
     
 
}
