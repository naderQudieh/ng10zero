import { Component, OnInit, Input } from '@angular/core';
import { CartManager } from '../../../../core/managers/cart.manager';
import {faShoppingCart} from '@fortawesome/free-solid-svg-icons';
import { LocalStorage } from '../../../../core/helpers/localStorage';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PromocodeComponent } from '../../promocode/promocode.component';
@Component({
  selector: 'app-cart-item',
  templateUrl: './cart-item.component.html',
  styleUrls: ['./cart-item.component.scss']
})
export class CartItemComponent implements OnInit {

  @Input() item;
  faShoppingCart = faShoppingCart ;
 
  constructor(
    public router: Router ,
    public cartManager: CartManager,
    public localStorage: LocalStorage,
    public dialog: MatDialog
    ) { }

     
    promocode()
   {
     this.dialog.open(PromocodeComponent ,{
       width: '70vw',
       maxWidth: '100vw',
       autoFocus: false,
     })
    }

  ngOnInit(): void { this.cartManager.getCart();}

  changeItemQty(qty) {
    this.cartManager.modifyItemQty(this.item, qty);
  }

  deleteItem(item) {
    this.cartManager.removeCartItem(item);
  }

}
