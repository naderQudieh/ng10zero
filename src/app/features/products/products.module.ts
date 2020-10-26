import { EffectsModule } from '@ngrx/effects';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
 import { HttpClient } from '@angular/common/http';
import { LazyElementsModule } from '@angular-extensions/elements';
import { StoreModule } from '@ngrx/store';
import { SharedModule } from '../../shared/shared.module';
import { environment } from '../../../environments/environment';
import { EventService } from '../../core/services';
import { MissingTranslationHandler, TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader'; 
import { HttpClientModule } from '@angular/common/http';
import { InfiniteScrollModule,InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CreditCardDirectivesModule } from 'angular-cc-library';
import { ProductsRoutingModule } from './products-routing.module'; 
import { CartService, OrderService, CheckoutService, ProductService } from './services';
import { InfiniteScrollComponent } from '../../core/components/infinite-scroll/infinite-scroll.component';
import { productReducers, cartReducers, checkoutReducers, featureProductsReducers } from './store'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; 
import { CartEffects, ProductEffects, CheckoutEffects  } from './store' 
import { uiPages  } from './pages';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(
    http, `${environment.i18nPrefix}/assets/i18n/`, '.json'
  );
}

@NgModule({
  declarations: [uiPages, InfiniteScrollComponent],
  imports: [  ReactiveFormsModule, FormsModule,
    InfiniteScrollModule, ScrollingModule,    CommonModule, SharedModule, LazyElementsModule,
    HttpClientModule, ProductsRoutingModule,
    InfiniteScrollModule,   CreditCardDirectivesModule ,
     
    StoreModule.forFeature('products', productReducers), 
    StoreModule.forFeature('cart', cartReducers), 
    //StoreModule.forFeature('purchases', checkoutReducers), 
    //StoreModule.forFeature('featureProducts', featureProductsReducers), 
    EffectsModule.forRoot([CartEffects, ProductEffects]),//, CheckoutEffects

    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      },
      isolate: false
    }) 
  ],
 
  exports: [InfiniteScrollComponent, ScrollingModule, InfiniteScrollDirective],
  providers: [ProductService,OrderService,  CartService, CheckoutService] 
})
 
export class ProductsModule {
  constructor(private readonly translateService: TranslateService,
    private readonly evnService: EventService) {
    this.evnService.getLanguage().subscribe((language) => {
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
