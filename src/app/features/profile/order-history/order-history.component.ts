import { Component, OnInit } from '@angular/core';
import { AccountService } from 'src/app/core/services/account.service';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.scss']
})
export class OrderHistoryComponent implements OnInit {

  arr = Array(3).fill('');
  ordersList: any = [];

  constructor(private accountService: AccountService) { }

  ngOnInit(): void {
    this.getOrders();
  }

  getOrders() {
    this.accountService.orders().subscribe((response: any) => {
      this.ordersList = response;
    });
  }

}
