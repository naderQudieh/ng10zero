import { Component, OnInit, OnDestroy } from '@angular/core';
import { UtilityService } from '../../../core/services/utility.service';
import { catchError,finalize,delay, tap, map } from 'rxjs/operators';
import { of, timer, combineLatest,BehaviorSubject, Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../../shared/services/language.service';
import { CanActivate, ActivatedRoute, ActivatedRouteSnapshot, RouterStateSnapshot, CanLoad, Route, UrlTree, Router } from '@angular/router';
import { SnackbarService, EventService } from 'src/app/core/services';
import { HomeService } from '../home.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
    
    webDevice = false;
    topSelection: any; 
    limit = 20;
    page = 1;
  constructor(private route: ActivatedRoute,  translate: TranslateService,
    private evnService: EventService, private snackbarService: SnackbarService,
    private homeService: HomeService, 
        private router: Router) { 
    }
    ngOnInit(): void {

      
    }


  getAll() {
    this.page += 1;
    this.homeService.getProducts(this.page ,20).subscribe(response => {
      
      console.log(response);
    },
      error => {
        console.error(error.message);
        //this.snackBar.open(error.message, 'x', { duration: 3000, horizontalPosition: 'right', verticalPosition: 'top' });
      });
  }

    goToPage() {
        let pageNum = 1
        this.router.navigate(['/products'], { queryParams: { page: pageNum } });
    }

    goToTestDialog() {
        let displayMessage ="My test error"
        this.snackbarService.showConfirmDialog({
            noCancelButton: true,
            messageHtml: `<span>${displayMessage}</span>`,
            title: `Error  `,
            confirmButtonText: 'OK'
        });
    }

    goToTestsnackbarMessage() {
        let displayMessage = "My test error"
        this.snackbarService.success(displayMessage);
       
    }
    goToBar() {
        
      this.evnService.showBar();
      of('dummy').pipe(delay(4000)).subscribe(val => {
        this.evnService.hideBar();
      });
    }
    goToShowSpinner() {
      this.evnService.showSpinner();
      of('dummy').pipe(delay(4000)).subscribe(val => {
        this.evnService.hideSpinner();
      })
        //this.evnService.getSpinnerValue().subscribe(lang => {
        //    of('dummy').pipe(delay(50)).subscribe(val => {
        //        //alert('dummy');
        //       // this.evnService.hideBar();
        //    });
        //}) 
    }
    ngOnDestroy() {
        
    }
}
