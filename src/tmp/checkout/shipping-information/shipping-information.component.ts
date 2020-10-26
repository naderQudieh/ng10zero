import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ConfigurationsService } from 'src/app/core/services/configurations.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserManager } from 'src/app/core/managers/user.manager';
import { CartManager } from 'src/app/core/managers/cart.manager';
import { AuthManager } from 'src/app/core/managers/auth.manager';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-shipping-information',
  templateUrl: './shipping-information.component.html',
  styleUrls: ['./shipping-information.component.scss']
})
export class ShippingInformationComponent implements OnInit {

  constructor( ) { }

  ngOnInit(): void {
  }
}
