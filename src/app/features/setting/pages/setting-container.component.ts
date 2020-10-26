import { Component, OnInit, EventEmitter, Input, ChangeDetectionStrategy, ViewEncapsulation, } from '@angular/core';
import { Inject, ChangeDetectorRef, OnDestroy, AfterViewInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { ROUTE_ANIMATIONS_ELEMENTS, routeAnimations } from '../../../core/core.module';
import { Observable } from 'rxjs';
import { EventService } from '../../../core/services';
import { TranslateService } from '@ngx-translate/core';
import { OverlayContainer } from '@angular/cdk/overlay';

@Component({
    selector: 'anms-setting',
    animations: [routeAnimations],
  templateUrl: './setting-container.component.html',
  styleUrls: ['./setting-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingContainerComponent implements OnInit, OnDestroy, AfterViewInit {
    routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;
  
    public languages: any[];
    public themes: any[];
   

    public selectedTheme: any;
    public selectedLanguage: any;
    public selectedCountry: any;
   

    constructor(private cdRef: ChangeDetectorRef,  private translate: TranslateService, private eventService: EventService,) {
        this.languages = this.eventService.getLanguageList() ;
        this.themes = this.eventService.getThemeList();  
     }

    ngOnInit() {
        
        
        this.eventService.UserLanguage.subscribe(lang => { 
            let applang = this.languages.filter(item => { 
                return item.value  == lang  ;  
            });
            this.selectedLanguage = applang[0]; 
            this.cdRef.detectChanges();
        })

        this.eventService.Userthemes.subscribe(theme => {
            console.log(theme);
            let apptheme = this.themes.filter(item => {
                return item.value == theme.value;
            });
            this.selectedTheme = apptheme[0];
            this.cdRef.detectChanges();
        }) 
    }

    onLanguageSelect() {
        this.cdRef.detectChanges();
        this.eventService.setLanguage(this.selectedLanguage['value']);
    }
      
   
    onSelectTheme() {
        this.cdRef.detectChanges();
        this.eventService.setTheme(this.selectedTheme );
    } 
    compareFn(x: any, y: any): boolean {
        return x && y ? x.value === y.value : x === y;
    }
    ngAfterViewInit(): void {
        this.cdRef.detectChanges();
    }
    ngOnDestroy() {
         
    }
    //onThemeSelect({ value: theme }) {
    //    console.log(theme);
    //    let apptheme = this.themes.filter(item => {
    //        return item.value === theme.value
    //    });
    //    this.selectedtheme = apptheme[0];
    //    console.log(apptheme[0].value.toLowerCase());
    //    this.eventService.setTheme(apptheme[0].value.toLowerCase());
    //} 
}
