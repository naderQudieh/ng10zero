import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LazyElementsModule } from '@angular-extensions/elements';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { MissingTranslationHandler, TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader'; 
import { SharedModule } from '../../shared/shared.module';
import { environment } from '../../../environments/environment';
import { EventService } from '../../core/services';
import { AccountRoutingModule } from './account-routing.module'; 
import { AuthEffects } from './store/auth.effects';
import {  authReducer } from './store/auth.reducer';
import { LayoutComponent } from './layout/layout.component';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { ChangePasswordComponent } from './pages/change-password/change-password.component';
import { ProfileComponent } from './profile/profile.component';


export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(
    http,
    `${environment.i18nPrefix}/assets/i18n/`,
    '.json'
  );
}

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    LazyElementsModule,
    SharedModule,
    AccountRoutingModule,
    EffectsModule.forRoot([AuthEffects]),
    StoreModule.forFeature("feature_auth", authReducer),
   
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      },
      isolate: false
    }) 
  ],
  declarations: [
       LayoutComponent, LoginComponent, ChangePasswordComponent, SignupComponent, ResetPasswordComponent
      , ProfileComponent
  
  ],
  providers: []
})
export class AccountModule {
    constructor(private readonly translateService: TranslateService,
      private readonly globalVarSrv: EventService) {
        this.globalVarSrv.getLanguage().subscribe((language) => {
            let slang = language;

            if (language['value']) {
                slang = language['value']
            }
            
            this.translateService.use(slang)
        });
        //this.store.pipe(select(selectSettingLanguage))
        //    .subscribe((language) => { 
        //        this.translateService.use(language)
        //    }); 
    }
}
