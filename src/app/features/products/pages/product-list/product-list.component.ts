import {  Injectable, AfterContentChecked, ChangeDetectorRef, Component, NgZone, OnInit, HostListener,
  ElementRef, Inject, ViewChild,  ChangeDetectionStrategy, OnDestroy, AfterViewInit
} from '@angular/core';
import { ViewportScroller } from '@angular/common';
import { select, Store } from '@ngrx/store';
import { ScrollStrategy, Overlay, ViewportRuler, ConnectionPositionPair, CdkScrollable, CdkConnectedOverlay } from '@angular/cdk/overlay';
import { CdkVirtualScrollViewport, ScrollDispatcher } from '@angular/cdk/scrolling';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ROUTE_ANIMATIONS_ELEMENTS, routeAnimations } from '../../../../core/core.module';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { fromEvent, BehaviorSubject, Subject, Observable, throwError } from 'rxjs';
import { debounceTime, takeUntil ,startWith, filter, tap, map, throttleTime, mergeMap, scan } from 'rxjs/operators';
import {AddToCart, GetProducts, ProductsState, CartState, selectProducts } from '../../store';
import { Product, CartItem } from '../../product.model'; 
import { CartService,   ProductService} from '../../services';

@Component({
  animations: [routeAnimations],
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['../products.component.scss'],
})
export class ProductListComponent implements AfterViewInit, OnInit, OnDestroy {
  //@ViewChild(CdkVirtualScrollViewport, { static: false }) private viewport: CdkVirtualScrollViewport;
 
  isMobile = new BehaviorSubject<boolean>(null);
  options = {
    indicators: false,
    numVisible: 5,
    noWrap: false
  };
  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;
  products: Product[] = []; 
  isLoading$: Observable<boolean>;
  limit = 10;
  currentPage = 1;
  total = 100;
  arrowDown = true;
  arrowTop = false;
  title = 'cdkScrollable';
  cdk: CdkScrollable;
  //@ViewChild(CdkScrollable) myscrollable: CdkScrollable;
  //@ViewChild('scrollingParent')  childDiv: ElementRef;
  constructor(private cdRef: ChangeDetectorRef, private myElement: ElementRef, 
    private viewportScroller: ViewportScroller,
    private zone: NgZone, private router: Router, private route: ActivatedRoute,
    private scrollDispatcher: ScrollDispatcher,
    private viewPortRuler: ViewportRuler,
    private store: Store<ProductsState>,
    private cartService: CartService,  private productService: ProductService) {

    this.route.params.forEach((params: Params) => {
      if (params['page'] !== undefined) {
        this.currentPage = params['page'];
      } else {
        this.currentPage = 1;
      }

     
    });

    scrollDispatcher.scrolled().subscribe((event: CdkScrollable) => { 
      var xxx = this.getScrollPosition(event);
     
      if (event.measureScrollOffset('bottom') < 300) {
        zone.run(() => {
          //console.log('bottom < 300');
        });
        this.cdk = event;
        //this.getProducts(this.currentPage,10); 
      }
    });
  }

  getProducts(_page = 1, limit = 10) {
    this.store.pipe(select(selectProducts)).subscribe(data => {
      console.log(data);
      let _data = data
      this.products = data['products'];
      this.currentPage++;
      this.cdRef.detectChanges();
    });
  }

 
  ngOnInit() {
  
       // { width, height }
   // console.log(this.viewPortRuler.getViewportSize()); 
    // { bottom, height, left, right, top, width }
   //console.log(this.viewPortRuler.getViewportRect());  
    // { top, left }
    //console.log(this.viewPortRuler.getViewportScrollPosition()); 
    // native resize event object
    this.viewPortRuler.change().subscribe(resizeEvent => {
     // console.log('resizeEvent')
      //console.log(this.viewPortRuler.getViewportSize()); 
    });
    this.store.dispatch(new GetProducts({ page: 1, limit: 22 }));
    this.getProducts(this.currentPage, 10); 
  }

  ngAfterViewInit() {
    this.scrollDispatcher.scrolled().subscribe((scrollable: CdkScrollable) => {
      if (scrollable) {
        //console.log(scrollable.getElementRef().nativeElement);
        // console.log('next page');
      } 
    }); 
  }

  refresh() {
    window.location.reload();
  }
  getScrollPosition(event) {
    if (event) {
      return event.getElementRef().nativeElement.scrollTop;
    } else {
      return window.scrollY;
    }
  }
  ngAfterContentChecked() {
    if (screen.width <= 800) {
      document.body.style.overflow = 'hidden';
      this.options = {
        indicators: true,
        numVisible: 5,
        noWrap: false
      };
    } else {
      document.body.style.overflow = 'visible';
      this.options = {
        numVisible: 5,
        indicators: true,
        noWrap: false
      };
    }
  }
 



  onScrollDown() {
    
  }

  onScrollEnd() { 
  }

  onScrollUp() {
    
  }

  addToCart(product: Product) {
    console.log(product);
  }
  
  ngOnDestroy() {
   // this.destroyed$.next();
   // this.destroyed$.complete();
  }
  goToTop(): void {
    this.viewportScroller.scrollToAnchor('pageTop');
  }
  scrollBottom() {
    if (navigator.userAgent.search(/Firefox/) > 0) {
      document.body.scrollTop = document.body.scrollHeight - document.body.clientHeight;
    }
    this.viewportScroller.scrollToPosition([10000, 10000]);
    setTimeout(() => {
      this.arrowDown = false;
    }, 200);
    setTimeout(() => {
      this.arrowTop = true;
    }, 500);
  }

  scrollTop() {
    if (navigator.userAgent.search(/Firefox/) > 0) {
      document.body.scrollTop = document.documentElement.scrollTop;
    }
    this.viewportScroller.scrollToPosition([0, 0]);
    this.arrowDown = true;
    this.arrowTop = false;
  }
  scrollToTop() {
    this.viewportScroller.scrollToPosition([0, 0]);
  }

  scrollIntoViewIfNeeded() {
    const el = this.myElement.nativeElement.querySelector('.title-micro-section');
    if (el.scrollIntoViewIfNeeded) {
      el.scrollIntoViewIfNeeded();
    } else {
      el.scrollIntoView();
    }
     
  }

  scrollToElement(id) {
    const el = document.getElementById('2');
    // el.scrollIntoView({ behavior: 'smooth', inline: 'start' });
    el.scrollIntoView();
    el.classList.remove('animation-class');
    setTimeout(() => {
      el.classList.add('animation-class');
    }, 0);
  }
  scrollToElement2(fragment): void {
    try {
      document.querySelector('#' + fragment).scrollIntoView({ behavior: 'smooth' });
    } catch (e) { }
  }
}
