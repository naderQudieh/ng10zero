import { Component, OnInit } from '@angular/core';
import { WishlistManager } from 'src/app/core/managers/wishlist.manager';
import { Product } from 'src/app/core/models/product.model';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss']
})
export class WishlistComponent implements OnInit {

  favorites: Product[];

  constructor(private wishlistManager: WishlistManager) { }

  ngOnInit(): void {
    this.getWishlist();
    this.wishlistManager.wishlistUpdated.subscribe(res => {
      this.getWishlist(); 
    })
  }

  getWishlist() {
    this.wishlistManager.getWishlist().subscribe(res => 
      {
       
      this.favorites = res;
      console.log("wishh");
      console.log(this.favorites);
      }
    );
  }

}
