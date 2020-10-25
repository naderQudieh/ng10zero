import { Component, OnInit } from '@angular/core';
import { faSyncAlt } from '@fortawesome/free-solid-svg-icons';
import { AccountService } from 'src/app/core/services/account.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})
export class OrderDetailsComponent implements OnInit {

  faSyncAlt = faSyncAlt;
  orderId;
  orderDetails;

  constructor(
    private accountService: AccountService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.orderId = this.activatedRoute.snapshot.url[1].path;
    this.getOrderDetails();
  }

  getOrderDetails() {
    this.accountService.orderDetails(this.orderId).subscribe(res => {
      this.orderDetails = res;
    });
  }

}
