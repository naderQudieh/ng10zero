import { NgModule ,Optional, SkipSelf  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from './material.module';
import {  FontAwesomeModule,  FaIconLibrary} from '@fortawesome/angular-fontawesome';
import { faIconsshared } from '../core/constants';  
import { BigInputComponent } from './components/big-input/big-input/big-input.component';
import { BigInputActionComponent } from './components/big-input/big-input-action/big-input-action.component';
import { RtlSupportDirective } from './components/rtl-support/rtl-support.directive';
import { ConfirmModalComponent } from './components/confirm-modal/confirm-modal.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import {  NotifyService,   ConfirmModalService } from './services';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';


const SHARED_SERVICES: any[] = [
     ConfirmModalService, NotifyService 
];

const SHARED_COMPONENTS: any[] = [
    ConfirmModalComponent, RtlSupportDirective, BigInputActionComponent,
    BigInputComponent, PageNotFoundComponent
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule, InfiniteScrollModule,
        TranslateModule.forRoot(),
    MaterialModule,
    FontAwesomeModule
  ],
    declarations: [...SHARED_COMPONENTS],
  exports: [
    CommonModule, InfiniteScrollModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    MaterialModule,
    FontAwesomeModule,
    BigInputComponent,
    BigInputActionComponent,
    RtlSupportDirective
    ],
    providers: [...SHARED_SERVICES]
})
export class SharedModule {
    constructor(@Optional() @SkipSelf()   parentModule: SharedModule,  faIconLibrary: FaIconLibrary) {
        if (parentModule) {
            throw new Error('SharedModule is already loaded. Import only in AppModule');
        }
        faIconLibrary.addIcons(...faIconsshared);
  }
}
