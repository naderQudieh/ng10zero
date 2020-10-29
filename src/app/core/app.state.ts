import { Params, PRIMARY_OUTLET, RouterStateSnapshot } from '@angular/router';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { RouterReducerState, RouterStateSerializer } from '@ngrx/router-store';
import { CustomRouterState } from './router.state';

export interface AppState {
  router: RouterReducerState<CustomRouterState>;
}

export const initialAppState: AppState = {
  router: {
    state: {
      url: '/',
      params: {},
      queryParams: {},
      fragment: null,
      breadcrumbs: []
    },
    navigationId: 0
  }
};
 

export const selectAppState = (state: AppState) => {
  return state
};  
