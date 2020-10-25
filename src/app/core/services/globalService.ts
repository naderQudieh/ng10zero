/// <reference path="../constants.ts" />
import { Injectable } from '@angular/core';
import { BehaviorSubject, of, Observable} from 'rxjs'
import {shareReplay, map} from 'rxjs/operators' 
import { AuthService } from './auth.service';
import { LocalStorageService } from './local-storage.service';
import { ValueLabel } from '../constants';



@Injectable({ providedIn: 'root' })
export class GlobalService  { 

    themes = [
        { value: 'default-theme', label: 'Blue' },
        { value: 'light-theme', label: 'Light' },
        { value: 'nature-theme', label: 'Nature' },
        { value: 'black-theme',label:  'Dark' }
    ];
    
    languages = [
        { value: 'en', label: 'English' },
        { value: 'fr', label: 'Français' },
        { value: 'ar', label: 'ArabicA' }
    ];

    public isAuthenticated = new BehaviorSubject<boolean>(this.hasToken());   
    public UserLanguage = new BehaviorSubject<string>(this.CurrentLang()); 
    public Userthemes = new BehaviorSubject<ValueLabel>(this.CurrentTheme()); 
    private progressBar  = new BehaviorSubject<boolean>(false);
    private spinnerBar = new BehaviorSubject<boolean>(false);

    constructor(private localStorage: LocalStorageService) {
        this.InitilizaeApp();
    }

  
 
    InitilizaeApp(): void {
        this.setAuthenticated(false);

        let lang = this.CurrentLang();
        if (lang == null || lang == undefined) {
            lang = "en";
            this.setLanguage(lang);
        }

        let themes = this.CurrentTheme();
        if (themes == null || themes == undefined) { 
            this.setTheme(this.themes[0]);
        }

       
       
    }
     


    setAuthenticated(isAuthenticated: boolean): void {
        this.isAuthenticated.next(isAuthenticated);
    }

    getIsAuthenticated(): Observable<boolean> {
        if (this.hasToken()) {

            this.setAuthenticated(true);
        } else {

            this.setAuthenticated(false);
        }
        return this.isAuthenticated.asObservable();
    }

    getThemeList(): ValueLabel[] {
        return this.themes;
    }
    private CurrentTheme(): ValueLabel {
        try {
            return JSON.parse(this.localStorage.getItem('settingstheme') );
        } catch (err) {
            return this.themes[0];
        }
    }
    setTheme(theme: ValueLabel): void {
        this.localStorage.setItem('settingstheme', JSON.stringify(theme)) 
        this.Userthemes.next(theme);
    }


    getTheme(): Observable<ValueLabel> {
        let theme = this.localStorage.getItem('settingstheme');
        if (!theme) { 
            this.setTheme(this.themes[0]);
        }
        return this.Userthemes.asObservable();
    }

    getLanguageList(): any[] {
        return this.languages;
    }
    private CurrentLang(): string {
        try {
            return this.localStorage.getItem('settingslang') || 'en';
        } catch (err) {
            return 'en';
        }
    }
    setLanguage(lang: string): void {
        this.localStorage.setItem('settingslang', lang)
        console.log(lang);
        this.UserLanguage.next(lang);
    }


    getLanguage(): Observable<string> {
        let lang = this.localStorage.getItem('settingslang');
        if (!lang) {
            lang = "en";
            this.setLanguage(lang);
        }
        return this.UserLanguage.asObservable();
    }
    
 
  
  
    private hasToken(): boolean {
        return !!this.localStorage.getUserAuthToken();
    } 
   

    showBar(): void {
        this.progressBar.next(true);
    }

    hideBar(): void {
        this.progressBar.next(false);
    }

    getBarValue(): Observable<boolean> {
        return this.progressBar.asObservable();
    }

    showSpinner(): void {
        this.spinnerBar.next(true);
    }

    hideSpinner(): void {
        this.spinnerBar.next(false);
    }

    getSpinnerValue(): Observable<boolean> {
        return this.spinnerBar.asObservable();
  }


  getCreditCardMonth(startMonth: number): Observable<number[]> {

    let data: number[] = [];
    for (let theMonth = startMonth; theMonth <= 12; theMonth++) {
      data.push(theMonth);
    }

    return of(data);
  }

  getCreditCardYears(): Observable<number[]> {
    let data: number[] = [];

    const startYear: number = new Date().getFullYear();
    const endYear: number = startYear + 10;

    for (let theYear = startYear; theYear <= endYear; theYear++) {
      data.push(theYear);

    }
    return of(data);
  }
 
  ngOnDestroy() { 
    this.isAuthenticated.unsubscribe();
    this.UserLanguage.unsubscribe();
    this.progressBar.unsubscribe();
    this.spinnerBar.unsubscribe(); 
  }
}
