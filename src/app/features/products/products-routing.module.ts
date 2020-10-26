import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../core/core.module';
import { LayoutComponent } from './layout/layout.component';
import { PageNotFoundComponent } from 'src/app/shared/pages/page-not-found/page-not-found.component';
import { CartComponent, ProductComponent, ProductListComponent, CheckoutComponent, CheckoutConfirmationComponent} from './pages';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '', component: ProductListComponent
      }, 
      {
        path: 'list', component: ProductListComponent
      },
      {
        path: 'cart', component: CartComponent
      },
      {
        path: 'checkout', component: CheckoutComponent
      },
      {
        path: 'ckoutConfirmation', component: CheckoutConfirmationComponent
      },
      {
        path: 'notfound',
        component: PageNotFoundComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule { }
