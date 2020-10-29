import { Params, PRIMARY_OUTLET, RouterStateSnapshot } from '@angular/router';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { RouterReducerState, RouterStateSerializer } from '@ngrx/router-store';
import * as fromRoot from "src/app/core/app.state"

export interface Breadcrumb {
  label: string;
  url: string;
  fragment?: string;
}

export type Breadcrumbs = Breadcrumb[];

export interface CustomRouterState {
  url: string;
  params: Params;
  queryParams: Params;
  fragment: string;
  breadcrumbs: Breadcrumbs;
}
 
export interface RouterState {
  router: RouterReducerState<CustomRouterState>;
}

 


export const selectRouterState = createFeatureSelector<RouterReducerState<CustomRouterState>>('router');
export const selectCustomRouterState = createSelector(selectRouterState, (state: RouterReducerState<CustomRouterState>) => state.state);
export const selectRouterDetailId = createSelector(selectCustomRouterState, (state: CustomRouterState) => state.params.id);
export const selectRouterFragment = createSelector(selectCustomRouterState, (state: CustomRouterState) => state.fragment);
export const selectRouterUrl = createSelector(selectCustomRouterState, (state: CustomRouterState) => state.url);
export const selectRouterBreadcrumbs = createSelector(selectCustomRouterState, (state: CustomRouterState) => state.breadcrumbs);


export class CustomSerializer implements RouterStateSerializer<CustomRouterState> {

  serialize(routerState: RouterStateSnapshot): CustomRouterState {
    const breadcrumbs: Breadcrumbs = [{ url: '/home', label: 'Home' }];
    let path = '/';
    let route = routerState.root;

    while (route.firstChild) {
      route = route.firstChild;
      if (route.outlet === PRIMARY_OUTLET && route.url.length > 0 && route.url[0].path !== 'home') {
        const urlSegment = route.url.map((segment) => segment.path).join('/');
        breadcrumbs.push(
          {
            url: `${path}${urlSegment}`,
            label: ('breadcrumb' in route.data) ? route.data.breadcrumb : null,
          }
        );
        path = `${path}${urlSegment}/`;
      }
    }

    const { params } = route;

    const {
      url,
      root: { queryParams, fragment },
    } = routerState;

    if ('id' in params) {
      breadcrumbs[breadcrumbs.length - 1].label = `#${params.id}`;
    }

    if (fragment) {
      breadcrumbs[breadcrumbs.length - 1].fragment = fragment;
    }

    // Only return an object including the URL, params, fragment and query params
    // instead of the entire snapshot
    return { url, params, queryParams, fragment: fragment || null, breadcrumbs };
  }
}

export const RouterStateProvider = {
  provide: RouterStateSerializer,
  useClass: CustomSerializer
}
