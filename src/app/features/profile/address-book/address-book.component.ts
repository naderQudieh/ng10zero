import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserManager } from 'src/app/core/managers/user.manager';
import { Router, RouterEvent, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-address-book',
  templateUrl: './address-book.component.html',
  styleUrls: ['./address-book.component.scss']
})
export class AddressBookComponent implements OnInit, OnDestroy {

  userAddressess: any;
  addressSubscription;

  constructor(private userManager: UserManager, private router: Router) { }

  ngOnInit(): void {
    this.addressSubscription = this.router.events.pipe(
      filter((event: RouterEvent) => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.getUserAddresses();
    });
    this.getUserAddresses();
  }

  getUserAddresses() {
    this.userManager.getAddresses().subscribe(res => {
      this.userAddressess = res;
    });
  }

  deleteAddress(id) {
    this.userManager.deleteAddress(id).subscribe(res => {
      this.getUserAddresses();
    });
  }

  ngOnDestroy() {
    if (this.addressSubscription) {
      this.addressSubscription.unsubscribe();
    }
  }
}
