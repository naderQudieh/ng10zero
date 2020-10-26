import { CommonModule } from '@angular/common';
import { NgModule, Optional, SkipSelf, ErrorHandler, APP_INITIALIZER } from '@angular/core';
import {  HttpClientModule,  HttpClient,  HTTP_INTERCEPTORS} from '@angular/common/http';
import { StoreRouterConnectingModule, RouterStateSerializer } from '@ngrx/router-store';
import { CustomRouterSerializer } from './router.state';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { StoreModule, Store } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools'; 
import { MissingTranslationHandler, TranslateModule, TranslateLoader, TranslateService, TranslateCompiler } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
//import { RecaptchaModule } from 'ng-recaptcha';
import { httpInterceptorProviders } from './interceptors';
import { FaIconLibrary,  FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import { MATERIAL_MODULES_CORE } from '../shared/material.module';
import { JwtModule } from '@auth0/angular-jwt';  
import {  ROUTE_ANIMATIONS_ELEMENTS,  routeAnimations} from './route.animations'; 
import { faIconscore } from './constants';  
import { environment } from '../../environments/environment';
import { Configuration } from './configuration';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { NotificationComponent } from './components/widgets/notification.component';
import { FooterComponent } from '../shared/components/footer/footer.component'; 
import { SidebarNoticeComponent } from './components/sidebar-notice/sidebar-notice.component';
import { UserComponent } from './components/widgets/user.component';
import { AppState } from 'src/app/core/app.state';
import { appReducers, reducerProvider, REDUCERS_TOKEN } from 'src/app/core/app.state';

import {
    AuthService, SnackbarService, EventService, //AppErrorHandler,
    LocalStorageService, AnimationsService, AuthGuard  } from './services';
 
const SHARED_SERVICES: any[] = [EventService,
    LocalStorageService, AnimationsService, SnackbarService,
    AuthGuard,// AppErrorHandler,
];

const SHARED_DECLARATIONS: any[] = [FooterComponent, NotificationComponent,
    UserComponent, SidebarNoticeComponent, ConfirmDialogComponent];
 

export {
    LocalStorageService, AnimationsService, SnackbarService,
    AuthGuard, routeAnimations, ROUTE_ANIMATIONS_ELEMENTS, //AppErrorHandler,
   // AppState,  selectRouterState     
};


export function tokenGetter() { 
    try { 
        let token = localStorage.getItem('user_token'); 
        let _token = JSON.parse(token); 
        return _token ? _token.access_token : null;
    } catch (err) {
        console.log('NoTOKEN');
        return null;
    }
}
 

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(
    http,`${environment.i18nPrefix}/assets/i18n/`,'.json'
  );
}

@NgModule({
  imports: [
    // angular
    CommonModule,
    HttpClientModule,
        FormsModule, //RecaptchaModule.forRoot(),
    // material
        MATERIAL_MODULES_CORE, 
        JwtModule.forRoot({
            config: {
                tokenGetter: tokenGetter 
            },
        }),
    // ngrx
    //StoreModule.forRoot(reducers, { metaReducers }),
    StoreModule.forRoot(REDUCERS_TOKEN),
    StoreRouterConnectingModule.forRoot(), 
    StoreDevtoolsModule.instrument({ logOnly: environment.production }),
    // 3rd party
    FontAwesomeModule,
        TranslateModule.forRoot({
            defaultLanguage: 'en',
              loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
              }
    })
  ],
    declarations: [...SHARED_DECLARATIONS],
  providers: [...SHARED_SERVICES, Configuration, httpInterceptorProviders,
    { provide: REDUCERS_TOKEN, useValue: appReducers },
       // { provide: ErrorHandler, useClass: AppErrorHandler },
        //{ provide: HTTP_INTERCEPTORS, useClass: JtwInterceptor, multi: true },
      { provide: RouterStateSerializer, useClass: CustomRouterSerializer },
       // {        provide: APP_INITIALIZER, useFactory: initStore, deps: [Store], multi: true  }
  ],
    exports: [...SHARED_DECLARATIONS,FormsModule,  MATERIAL_MODULES_CORE,  // RecaptchaModule,
             FontAwesomeModule, TranslateModule]
})
export class CoreModule {
    constructor(@Optional() @SkipSelf() parent: CoreModule, faIconLibrary: FaIconLibrary,
        private readonly translateService: TranslateService, private readonly evnService: EventService
    ) {
        if (parent) {
           throw new Error('CoreModule is already loaded. Import only in AppModule');
        }
        
        this.evnService.getLanguage().subscribe((language) => {  
            let slang = language;

            if (language['value']) {
                slang = language['value']
            }
          
            this.translateService.use(slang)
        }); 
      faIconLibrary.addIcons(...faIconscore);
  }
}
