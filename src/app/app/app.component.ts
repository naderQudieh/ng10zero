import browser from 'browser-detect';
import { MediaMatcher } from '@angular/cdk/layout';
import { Output, EventEmitter, Input, ChangeDetectionStrategy, ViewEncapsulation, } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { DOCUMENT } from "@angular/common";
import { Inject, Component, OnInit, ChangeDetectorRef, OnDestroy, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of, Subscription } from 'rxjs';
import { filter, delay, debounceTime, map, take } from 'rxjs/operators';
import { environment as env } from '../../environments/environment';
import { EventService } from '../core/services';
import { routeAnimations } from '../core/core.module';
import { BidiModule, Directionality, Direction } from '@angular/cdk/bidi'
import { OverlayContainer } from '@angular/cdk/overlay';
import { MatProgressBar } from '@angular/material/progress-bar';
import { NotificationComponent } from '../core/components/widgets/notification.component';
import { AppState, selectAppState  } from 'src/app/core/app.state';
import { AuthActions, AuthReducer, selectAuthError, selectAuth } from '../features/account/store/index';
@Component({
  selector: 'anms-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [routeAnimations],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,

})
export class AppComponent implements OnInit, OnDestroy, AfterViewInit {

  private _mobileQueryListener: () => void;
  mobileQuery: MediaQueryList;

  public isProd = env.production;
  public isRtl: boolean = false;
  public isRtl2: Direction;
  public envName = env.envName;
  public year = new Date().getFullYear();
  public logo = require('../../assets/images/logo.png').default;

  navigations = [
    { link: 'dashboard', label: 'main.menu.dashboard', icon: "dashboard" },
    { link: 'products', label: 'main.menu.products', icon: "star" },
    { link: 'admin', label: 'admin', icon: "star" },
    { link: 'setting', label: 'main.menu.setting', icon: "settings" },
    { link: 'privacy', label: 'privacy', icon: "privacy_tip" },
    { link: 'contact', label: 'contact', icon: "contact_page" }
  ];

  isLoggedIn: boolean;
  themeClass = "default-theme";

  public languages: any[];
  public themes: any[];



  public selectedLanguage: any;
  public selectedTheme: any;

  isAuthenticated$: Observable<boolean>;
  showLoadingBar$: Observable<boolean>;
  showSpinner$: Observable<boolean>;

  private _dirChangeSubscription = Subscription.EMPTY;
  @Output() toggleSidenavNotice = new EventEmitter<void>();

  constructor(private store: Store<AppState>, dir: Directionality, private cdRef: ChangeDetectorRef,
    private media: MediaMatcher,
    @Inject(DOCUMENT) private document: Document, private eventService: EventService,
    private overlayContainer: OverlayContainer, private router: Router) {

    this.mobileQuery = this.media.matchMedia('(max-width: 1000px)');
    this._mobileQueryListener = () => cdRef.detectChanges();
    // tslint:disable-next-line: deprecation
    this.mobileQuery.addListener(this._mobileQueryListener);

    // this.router.navigate([''])
    this.showLoadingBar$ = eventService.getBarValue().pipe(delay(30));

    eventService.getSpinnerValue().subscribe((e) => {
      this.showSpinner$ = of(e);
    });

    //this.isRtl = dir.value === 'rtl';
    //this.isRtl2 = dir.value;

    //this._dirChangeSubscription = dir.change.subscribe((drc: Direction) => {
    //    console.log('dir changed');
    //    this.isRtl2 = drc;
    //});
    this.isAuthenticated$ = this.eventService.getIsAuthenticated();
    this.languages = this.eventService.getLanguageList();
    this.themes = this.eventService.getThemeList();


  }

  private static isIEorEdgeOrSafari() {
    return ['ie', 'edge', 'safari'].includes(browser().name);
  }


  ngOnInit(): void {
    console.log('ngOnInit');
    this.store.pipe(select(selectAppState))
      .subscribe((_state) => {
        console.log(_state);
      });
    this.eventService.getIsAuthenticated().subscribe(auth => {
      this.isLoggedIn = auth;
    })

    this.eventService.UserLanguage.subscribe(lang => {
      let applang = this.languages.filter(item => {
        return item.value == lang;
      });
      this.selectedLanguage = applang[0];
    })

    this.eventService.Userthemes.subscribe(theme => {
      let apptheme = this.themes.filter(item => {
        return item.value == theme.value;
      });
      this.selectedTheme = apptheme[0];
      const classList = this.overlayContainer.getContainerElement().classList;
      const toRemove = Array.from(classList).filter((item: string) =>
        item.includes('-theme')
      );
      if (toRemove.length) {
        classList.remove(...toRemove);
      }
      this.themeClass = this.selectedTheme['value'];
      classList.add(this.themeClass);
    })


  }
  onSelectTheme() {
    this.cdRef.detectChanges();
    this.eventService.setTheme(this.selectedTheme);
  }


  onLanguageSelect() {
    this.cdRef.detectChanges();
    this.eventService.setLanguage(this.selectedLanguage['value']);
  }


  onLoginClick() {
    this.router.navigate(['/auth/login']);
  }


  onLogoutClick() {
    this.store.dispatch(new AuthActions.LogOut());
    this.eventService.setAuthenticated(false);
    this.router.navigate(['/home']);
  }



  changeLangage(lang: string) {
    this.isRtl = false;
    if (lang === "ar") {
      this.isRtl2 = "rtl";
      this.isRtl = true;
    }
    let htmlTag = this.document.getElementsByTagName("html")[0] as HTMLHtmlElement;
    htmlTag.dir = (this.isRtl) ? "rtl" : "ltr";
    //this.changeCssFile(lang);
  }

  changeCssFile(lang: string) {
    //let headTag = this.document.getElementsByTagName(
    //    "head"
    //)[0] as HTMLHeadElement;
    //let existingLink = this.document.getElementById(
    //    "langCss"
    //) as HTMLLinkElement;

    //let bundleName = lang === "ar" ? "arabicStyle.css" : "englishStyle.css";

    //if (existingLink) {
    //    existingLink.href = bundleName;
    //} else {
    //    let newLink = this.document.createElement("link");
    //    newLink.rel = "stylesheet";
    //    newLink.type = "text/css";
    //    newLink.id = "langCss";
    //    newLink.href = bundleName;
    //    headTag.appendChild(newLink);
    //}
  }
  ngAfterViewInit(): void {
    this.cdRef.detectChanges();
  }
  ngOnDestroy() {
    this.mobileQuery.removeListener(this._mobileQueryListener);
    this._dirChangeSubscription.unsubscribe();
  }
}
